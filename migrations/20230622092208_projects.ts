// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('projects', (table) => {
    table.increments('id')

    table.string('title')
    table.string('description')
    table.string('location')
    table.string('status').defaultTo('Pending')
    table.datetime('start_date').nullable()
    table.datetime('end_date').nullable()
    table.bigint('userId').references('id').inTable('users').notNullable()
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('projects')
}
