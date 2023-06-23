// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { projectsSchema } from '../projects/projects.schema'

// Main data model schema
export const subProjectsSchema = Type.Object(
  {
    id: Type.Number(),
    title: Type.String(),
    description: Type.String(),
    projectId: Type.Number(),
    project: Type.Ref(projectsSchema),
    status: Type.Optional(Type.String()),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
  },
  { $id: 'SubProjects', additionalProperties: false }
)
export type SubProjects = Static<typeof subProjectsSchema>
export const subProjectsValidator = getValidator(subProjectsSchema, dataValidator)
export const subProjectsResolver = resolve<SubProjects, HookContext>({
  project: virtual(async (subproject, context) => {
    // Associate the user that sent the message
    return context.app.service('projects').get(subproject.projectId)
  })
})

export const subProjectsExternalResolver = resolve<SubProjects, HookContext>({})

// Schema for creating new entries
export const subProjectsDataSchema = Type.Pick(subProjectsSchema, [
  'title', 
  'description',
  'status',
  'projectId'
], {
  $id: 'SubProjectsData'
})
export type SubProjectsData = Static<typeof subProjectsDataSchema>
export const subProjectsDataValidator = getValidator(subProjectsDataSchema, dataValidator)
export const subProjectsDataResolver = resolve<SubProjects, HookContext>({
  createdAt: async () => {
    return Date.now()
  },
  updatedAt: async () => {
    return Date.now()
  }
})

// Schema for updating existing entries
export const subProjectsPatchSchema = Type.Partial(subProjectsSchema, {
  $id: 'SubProjectsPatch'
})
export type SubProjectsPatch = Static<typeof subProjectsPatchSchema>
export const subProjectsPatchValidator = getValidator(subProjectsPatchSchema, dataValidator)
export const subProjectsPatchResolver = resolve<SubProjects, HookContext>({
  updatedAt: async () => {
    return Date.now()
  }
})

// Schema for allowed query properties
export const subProjectsQueryProperties = Type.Pick(subProjectsSchema, [
  'title', 
  'description',
  'status',
  'projectId',
  'createdAt',
  'updatedAt'
])
export const subProjectsQuerySchema = Type.Intersect(
  [
    querySyntax(subProjectsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type SubProjectsQuery = Static<typeof subProjectsQuerySchema>
export const subProjectsQueryValidator = getValidator(subProjectsQuerySchema, queryValidator)
export const subProjectsQueryResolver = resolve<SubProjectsQuery, HookContext>({})
