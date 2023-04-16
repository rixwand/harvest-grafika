import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";
import { deleteFile, saveFile } from "@middlewares/files";

export default async function handler(req, res) {
  if (req.method != "PUT") return res.status(405).end();
  const auth = await authorization(req, res);
  try {
    const { id } = req.query;
    const data = await saveFile(req, "products");
    const { oldImage, tags, body } = (({ oldImage = null, tags, ...body }) => ({
      oldImage,
      tags,
      body,
    }))(data);
    const dataTags = tags
      .split(",")
      .map((tag) => ({ products_id: parseInt(id), tags_id: parseInt(tag) }));
    await db("products")
      .where({ id })
      .update({
        ...body,
      });

    const products_tags = await db("products_tags").where({ products_id: id });

    dataTags.forEach(async (tag) => {
      if (
        products_tags.filter(
          (product_tag) => product_tag.tags_id == tag.tags_id
        ).length == 0
      ) {
        await db("products_tags").insert(tag);
      }
    });
    products_tags.forEach(async (product_tag) => {
      if (
        dataTags.filter((tag) => tag.tags_id == product_tag.tags_id).length == 0
      ) {
        await db("products_tags").where(product_tag).del();
      }
    });

    if (oldImage != null) {
      deleteFile("products", oldImage);
    }

    res.status(200).send("success");
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
