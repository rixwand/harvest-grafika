const { faker } = require("@faker-js/faker");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const generateRandmProduct = () => {
  const name = faker.commerce.product();
  const image = faker.commerce.productName();
  const imageUrl = `https://source.unsplash.com/random/300x300?${name}`;
  const category_id = Math.floor(Math.random() * (9 - 1 + 1) + 1);
  const harga = faker.commerce.price(10000, 50000, 0);
  return {
    name,
    image,
    imageUrl,
    category_id,
    harga,
  };
};
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("products").del();
  await knex("products").insert(
    Array.from({ length: 500 }, () => {
      return generateRandmProduct();
    })
  );
};
