/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products_tags", (table) => {
    table
      .integer("products_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products")
      .primary();
    table
      .integer("tags_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tags")
      .primary();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products_tags");
};
