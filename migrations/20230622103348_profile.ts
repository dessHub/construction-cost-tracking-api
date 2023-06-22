// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('profile', (table) => {
    table.increments('id')

    table.string('name')
    table.string('location')
    table.string('occupation')
    table.string('avatar')
    table.bigint('userId').references('id').inTable('users').notNullable().unique()
    table.bigint('createdAt')
    table.bigint('updatedAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('profile')
}
