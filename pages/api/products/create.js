import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";
import { saveFile } from "@middlewares/files";
export default async function handler(req, res) {
  if (req.method != "POST") return res.status(405).end();
  const auth = await authorization(req, res);
  try {
    const data = await saveFile(req, "products");
    const { tags: tag, body } = (({ tags = null, ...body }) => ({
      tags,
      body,
    }))(data);
    const [id] = await db("products").insert(body);
    const tags = tag.split(",");
    const product_tags = tags.map((item) => ({
      products_id: id,
      tags_id: item,
    }));
    await db("products_tags").insert(product_tags);
    const product = await db("products").where({ id });

    res.status(200).send({ product });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};
