import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";
import { deleteFile } from "@middlewares/files";

export default async function handler(req, res) {
  if (req.method != "DELETE") return res.status(405).end();

  const auth = await authorization(req, res);

  const { id } = req.query;
  const { image } = req.body;
  try {
    await db("category").where({ id }).del();
    deleteFile("category", image);
    const [rows] = await db("products").count("id");
    res.status(200).send(`remain rows : ${rows["count(`id`)"]}`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.code);
  }
}
