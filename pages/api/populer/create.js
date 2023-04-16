import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";
export default async function handler(req, res) {
  if (req.method != "POST") return res.status(401).end();
  const verify = await authorization(req, res);
  const { id, category_id } = req.body;
  try {
    await db("populer").insert({ id, category_id });
    const [result] = await db("populer")
      .where({ "populer.id": id })
      .join("category", "category.id", "=", "populer.category_id")
      .select(
        "populer.id",
        "category.id as category_id",
        "category.name",
        "category.image",
        "category.imageUrl"
      );
    res.status(200).send(result);
  } catch (err) {
    if ((err.code = "ER_DUP_ENTRY")) res.status(409).end();
    console.log(err);
    res.status(500).end();
  }
}
