import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";

export default async function handler(req, res) {
  if (req.method != "DELETE") return res.status(405).end();

  const auth = await authorization(req, res);

  const { id } = req.query;
  try {
    await db("populer").where({ id }).del();
    const [rows] = await db("populer").count("id");
    res.status(200).send(`remain rows : ${rows["count(`id`)"]}`);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
