const { faker } = require("@faker-js/faker");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const generateRandTags = (count) => {
  const name = [];
  for (let i = 0; i < count; i++) {
    const tag = faker.commerce.productMaterial();
    name.filter((a) => a.name == tag).length == 0
      ? name.push({ name: tag })
      : i--;
  }
  return name;
};
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("tags").del();
  await knex("tags").insert(generateRandTags(10));
};
