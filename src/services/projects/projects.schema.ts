// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { userSchema } from '../users/users.schema'

// Main data model schema
export const projectsSchema = Type.Object(
  {
    id: Type.Number(),
    title: Type.String(),
    description: Type.String(),
    location: Type.String(),
    status: Type.Optional(Type.String()),
    userId: Type.Number(),
    owner: Type.Ref(userSchema),
    start_date: Type.String({ format: 'date-time' }),
    end_date: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.Optional(Type.String()),
    updatedAt: Type.Optional(Type.String())
  },
  { $id: 'Projects', additionalProperties: false }
)
export type Projects = Static<typeof projectsSchema>
export const projectsValidator = getValidator(projectsSchema, dataValidator)
export const projectsResolver = resolve<Projects, HookContext>({
  owner: virtual(async (project, context) => {
    // Associate the user that sent the message
    return context.app.service('users').get(project.userId)
  })
})

export const projectsExternalResolver = resolve<Projects, HookContext>({})

// Schema for creating new entries
export const projectsDataSchema = Type.Pick(projectsSchema, [
  'title',
  'description',
  'location',
  'status',
  'start_date',
  'end_date'
], {
  $id: 'ProjectsData'
})
export type ProjectsData = Static<typeof projectsDataSchema>
export const projectsDataValidator = getValidator(projectsDataSchema, dataValidator)
export const projectsDataResolver = resolve<Projects, HookContext>({
  userId: async (_value, _project, context) => {
    // Associate the record with the id of the authenticated user
    return context.params.user.id
  }
})

// Schema for updating existing entries
export const projectsPatchSchema = Type.Partial(projectsSchema, {
  $id: 'ProjectsPatch'
})
export type ProjectsPatch = Static<typeof projectsPatchSchema>
export const projectsPatchValidator = getValidator(projectsPatchSchema, dataValidator)
export const projectsPatchResolver = resolve<Projects, HookContext>({})

// Schema for allowed query properties
export const projectsQueryProperties = Type.Pick(projectsSchema, [
  'id',
  'title',
  'description',
  'location',
  'status',
  'start_date',
  'end_date',
  'createdAt',
  'updatedAt',
  'userId'
])
export const projectsQuerySchema = Type.Intersect(
  [
    querySyntax(projectsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type ProjectsQuery = Static<typeof projectsQuerySchema>
export const projectsQueryValidator = getValidator(projectsQuerySchema, queryValidator)
export const projectsQueryResolver = resolve<ProjectsQuery, HookContext>({})
