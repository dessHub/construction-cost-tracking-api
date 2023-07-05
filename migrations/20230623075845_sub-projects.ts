// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sub-projects', (table) => {
    table.increments('id')

    table.string('title')
    table.string('description')
    table.bigint('projectId').references('id').inTable('projects').notNullable()
    table.string('status').defaultTo('Pending')
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sub-projects')
}
