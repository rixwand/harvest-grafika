import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";
import { saveFile } from "@middlewares/files";
export default async function handler(req, res) {
  if (req.method != "POST") return res.status(405).end();
  const auth = await authorization(req, res);
  try {
    const name = await db("category").where({ name: req.query.name });
    if (name.length != 0) {
      return res.status(417).send("ERR_DUP_ENTRY");
    }
    const data = await saveFile(req, "category");
    const [id] = await db("category").insert(data);
    const [result] = await db("category").where({ id });
    res.status(200).send(result);
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
