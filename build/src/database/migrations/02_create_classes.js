"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function up(knex) {
    return knex.schema.createTable("classes", (table) => {
        table.increments("id").primary();
        table.string("materia").notNullable();
        table.decimal("custo").notNullable();
        table
            .integer("teacher_id")
            .notNullable()
            .references("id")
            .inTable("teachers")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable("classes");
}
exports.down = down;
