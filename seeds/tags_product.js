const { faker } = require("@faker-js/faker");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const generateRandProducts_tags = () => {
  const total_products = 500;
  const total_tags = 10;
  const min_tags = 2;
  const max_tags = 3;
  const tags_id = [];
  for (let i = 1; i <= total_products; i++) {
    const raw = [];
    const tag_count = Math.floor(
      Math.random() * (max_tags - min_tags + 1) + min_tags
    );
    for (let j = 0; j < tag_count; j++) {
      const tag_id = Math.floor(Math.random() * (total_tags - 1 + 1) + 1);
      raw.filter((r) => r.tags_id == tag_id).length == 0
        ? raw.push({ products_id: i, tags_id: tag_id })
        : j--;
    }
    tags_id.push(...raw);
  }
  return tags_id;
};
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("products_tags").del();
  await knex("products_tags").insert(generateRandProducts_tags());
};
