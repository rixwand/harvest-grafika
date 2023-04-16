import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";

export default async function handler(req, res) {
  if (req.method != "POST") return res.status(405).end();
  const auth = await authorization(req, res);
  try {
    const { tag: name } = req.body;
    const [id] = await db("tags").insert({ name });
    const [result] = await db("tags").where({ id });
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
