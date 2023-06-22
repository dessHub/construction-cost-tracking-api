// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Projects, ProjectsData, ProjectsPatch, ProjectsQuery } from './projects.schema'

export type { Projects, ProjectsData, ProjectsPatch, ProjectsQuery }

export interface ProjectsParams extends KnexAdapterParams<ProjectsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ProjectsService<ServiceParams extends Params = ProjectsParams> extends KnexService<
  Projects,
  ProjectsData,
  ProjectsParams,
  ProjectsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'projects'
  }
}
