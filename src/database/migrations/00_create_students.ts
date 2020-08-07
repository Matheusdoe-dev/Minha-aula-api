import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("students", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.integer("senha").notNullable();
    table.string("avatar").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("students");
}
