/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("carousel", (table) => {
    table.increments().notNullable();
    table.string("title").notNullable();
    table.string("image").notNullable();
    table.string("imageUrl").notNullable();
    table.string("desc").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("carousel");
};
