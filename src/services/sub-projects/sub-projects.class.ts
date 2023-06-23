// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { SubProjects, SubProjectsData, SubProjectsPatch, SubProjectsQuery } from './sub-projects.schema'

export type { SubProjects, SubProjectsData, SubProjectsPatch, SubProjectsQuery }

export interface SubProjectsParams extends KnexAdapterParams<SubProjectsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class SubProjectsService<ServiceParams extends Params = SubProjectsParams> extends KnexService<
  SubProjects,
  SubProjectsData,
  SubProjectsParams,
  SubProjectsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'sub-projects'
  }
}
