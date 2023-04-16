const { faker } = require("@faker-js/faker");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const generateRandCategories = (count) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    const name = faker.commerce.productMaterial();
    const category = {
      name,
      image: name,
      imageUrl: `https://source.unsplash.com/random/300x300?${name}`,
    };
    !items.map((a) => a.name).includes(name) ? items.push(category) : i--;
  }
  return items;
};
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("category").del();
  await knex("category").insert(generateRandCategories(10));
};
