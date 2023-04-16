/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("populer", (table) => {
    table.integer("id").notNullable().unsigned().unique();
    table
      .integer("category_id")
      .unsigned()
      .notNullable()
      .unique()
      .references("id")
      .inTable("category");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("populer");
};
