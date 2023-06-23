// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  subProjectsDataValidator,
  subProjectsPatchValidator,
  subProjectsQueryValidator,
  subProjectsResolver,
  subProjectsExternalResolver,
  subProjectsDataResolver,
  subProjectsPatchResolver,
  subProjectsQueryResolver
} from './sub-projects.schema'

import type { Application } from '../../declarations'
import { SubProjectsService, getOptions } from './sub-projects.class'

export const subProjectsPath = 'sub-projects'
export const subProjectsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export * from './sub-projects.class'
export * from './sub-projects.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const subProjects = (app: Application) => {
  // Register our service on the Feathers application
  app.use(subProjectsPath, new SubProjectsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: subProjectsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(subProjectsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(subProjectsExternalResolver),
        schemaHooks.resolveResult(subProjectsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(subProjectsQueryValidator),
        schemaHooks.resolveQuery(subProjectsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(subProjectsDataValidator),
        schemaHooks.resolveData(subProjectsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(subProjectsPatchValidator),
        schemaHooks.resolveData(subProjectsPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [subProjectsPath]: SubProjectsService
  }
}
