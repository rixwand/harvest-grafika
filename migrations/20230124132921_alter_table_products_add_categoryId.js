const { table } = require("console");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("products", (table) => {
    table
      .integer("category_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("category");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("products", (table) => {
    table.dropForeign("category_id", "products_category_id_foreign");
    table.dropColumn("category_id");
  });
};
