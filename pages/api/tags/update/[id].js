import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";

export default async function handler(req, res) {
  if (req.method != "PUT") return res.status(405).end();
  const auth = await authorization(req, res);
  try {
    const { id } = req.query;
    const { tag: name } = req.body;
    await db("tags").where({ id }).update({ name });
    const [result] = await db("tags").where({ id });
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
