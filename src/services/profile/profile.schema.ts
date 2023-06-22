// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import crypto from 'crypto'
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { userSchema } from '../users/users.schema'

// Main data model schema
export const profileSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    location: Type.Optional(Type.String()),
    occupation: Type.Optional(Type.String()),
    avatar: Type.Optional(Type.String()),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    userId: Type.Number(),
    user: Type.Ref(userSchema)
  },
  { $id: 'Profile', additionalProperties: false }
)
export type Profile = Static<typeof profileSchema>
export const profileValidator = getValidator(profileSchema, dataValidator)
export const profileResolver = resolve<Profile, HookContext>({
  user: virtual(async (profile, context) => {
    // Associate the user that sent the message
    return context.app.service('users').get(profile.userId)
  })
})

export const profileExternalResolver = resolve<Profile, HookContext>({})

// Schema for creating new entries
export const profileDataSchema = Type.Pick(profileSchema, [
  'name', 
  'location', 
  'occupation', 
  'avatar'
], {
  $id: 'ProfileData'
})
export type ProfileData = Static<typeof profileDataSchema>
export const profileDataValidator = getValidator(profileDataSchema, dataValidator)
export const profileDataResolver = resolve<Profile, HookContext>({
  avatar: async (value, Profile, context) => {
    // If the user passed an avatar image, use it
    if (value !== undefined) {
      return value
    }

    // Gravatar uses MD5 hashes from an email address to get the image
    const hash = crypto.createHash('md5').update(context.params.user.email.toLowerCase()).digest('hex')
    // Return the full avatar URL
    return `https://s.gravatar.com/avatar/${hash}?s=60`
  },
  userId: async (_value, _profile, context) => {
    // Associate the record with the id of the authenticated user
    return context.params.user.id
  },
  createdAt: async () => {
    return Date.now()
  },
  updatedAt: async () => {
    return Date.now()
  }
})

// Schema for updating existing entries
export const profilePatchSchema = Type.Partial(profileSchema, {
  $id: 'ProfilePatch'
})
export type ProfilePatch = Static<typeof profilePatchSchema>
export const profilePatchValidator = getValidator(profilePatchSchema, dataValidator)
export const profilePatchResolver = resolve<Profile, HookContext>({
  updatedAt: async () => {
    return Date.now()
  }
})

// Schema for allowed query properties
export const profileQueryProperties = Type.Pick(profileSchema, [
  'id', 
  'name', 
  'location', 
  'occupation',
  'createdAt',
  'updatedAt',
  'userId'
])
export const profileQuerySchema = Type.Intersect(
  [
    querySyntax(profileQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ProfileQuery = Static<typeof profileQuerySchema>
export const profileQueryValidator = getValidator(profileQuerySchema, queryValidator)
export const profileQueryResolver = resolve<ProfileQuery, HookContext>({
    // If there is a user (e.g. with authentication), they are only allowed to see their own data
    id: async (value, profile, context) => {
      // We want to be able to get a list of all profiles but
      // only let a user modify their own data otherwise
      if (context.params.user && context.method !== 'find') {
        return context.params.user.id
      }
  
      return value
    }
})
