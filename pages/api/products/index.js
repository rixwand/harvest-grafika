import db from "@libs/koneksi";
import knex from "knex";
export default async function handler(req, res) {
  if (req.method != "GET") return res.status(405).end();
  try {
    const {
      limit,
      offset,
      newest = false,
      search,
      populer = false,
    } = req.query;
    const query = db("products")
      .join("category", "category.id", "=", "products.category_id")
      .select(
        "products.id",
        "products.name",
        "products.image",
        "products.imageUrl",
        "products.harga",
        "products.category_id",
        "category.name as category"
      );

    if (limit) {
      query.limit(limit);
    }
    if (offset) {
      query.offset(offset);
    }
    if (newest) {
      query.orderBy("created_at", "desc");
    }
    if (search) {
      query
        .where("products.name", "like", `%${search}%`)
        .orWhere("category.name", "like", `%${search}%`);
    }
    if (populer) {
      const populer = await db("populer")
        .join("category", "category.id", "=", "populer.category_id")
        .select("category.name");
      const condition = [];
      populer.map(({ name }, i) => {
        const raw = `WHEN category = '${name}' THEN ${i + 1}`;
        condition.push(raw);
      });
      query.orderBy(db.raw(`CASE ${condition.join(" ")} ELSE 4 END`));
    } else {
      query.orderBy("id", "asc");
    }
    const products = await query;
    const tags = await db("tags");
    const products_tags = await db("products_tags");
    let tags_products = {};
    products_tags.map((product_tag) => {
      if (tags_products.hasOwnProperty(product_tag.products_id)) {
        tags_products[product_tag.products_id].push(product_tag.tags_id);
      } else {
        Object.assign(tags_products, {
          [product_tag.products_id]: [product_tag.tags_id],
        });
      }
    });
    const result = products.map((product) => {
      const tags_name = tags_products[product.id].map(
        (tags_id) => tags.filter((tag) => tag.id == tags_id)[0]
      );
      return { ...product, tags: tags_name };
    });

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
