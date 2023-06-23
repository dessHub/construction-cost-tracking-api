import { subProjects } from './sub-projects/sub-projects'
import { projects } from './projects/projects'
import { profile } from './profile/profile'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(subProjects)
  app.configure(projects)
  app.configure(profile)
  app.configure(user)
  // All services will be registered here
}
