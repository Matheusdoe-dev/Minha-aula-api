"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function up(knex) {
    return knex.schema.createTable("teachers", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("avatar").notNullable();
        table.string("whatsapp").notNullable();
        table.string("bio").notNullable();
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable("teachers");
}
exports.down = down;
