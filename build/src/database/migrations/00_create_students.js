"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function up(knex) {
    return knex.schema.createTable("students", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").notNullable();
        table.integer("senha").notNullable();
        table.string("avatar").notNullable();
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable("students");
}
exports.down = down;
