// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  projectsDataValidator,
  projectsPatchValidator,
  projectsQueryValidator,
  projectsResolver,
  projectsExternalResolver,
  projectsDataResolver,
  projectsPatchResolver,
  projectsQueryResolver
} from './projects.schema'

import type { Application } from '../../declarations'
import { ProjectsService, getOptions } from './projects.class'

export const projectsPath = 'projects'
export const projectsMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export * from './projects.class'
export * from './projects.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const projects = (app: Application) => {
  // Register our service on the Feathers application
  app.use(projectsPath, new ProjectsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: projectsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(projectsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(projectsExternalResolver),
        schemaHooks.resolveResult(projectsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(projectsQueryValidator),
        schemaHooks.resolveQuery(projectsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        authenticate('jwt'),
        schemaHooks.validateData(projectsDataValidator),
        schemaHooks.resolveData(projectsDataResolver)
      ],
      patch: [
        authenticate('jwt'),
        schemaHooks.validateData(projectsPatchValidator),
        schemaHooks.resolveData(projectsPatchResolver)
      ],
      remove: [
        authenticate('jwt'),
      ]
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
    [projectsPath]: ProjectsService
  }
}
