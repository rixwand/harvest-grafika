import db from "@libs/koneksi";
export default async function handler(req, res) {
  if (req.method != "GET") return res.status(401).end();
  try {
    const populer = await db("populer")
      .join("category", "category.id", "=", "populer.category_id")
      .select(
        "populer.id",
        "category.id as category_id",
        "category.name",
        "category.image",
        "category.imageUrl"
      );
    res.status(200).send(populer);
  } catch (err) {
    console.log(err);
  }
}
