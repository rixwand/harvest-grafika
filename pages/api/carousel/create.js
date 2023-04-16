import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";
import { saveFile } from "@middlewares/files";

export default async function handler(req, res) {
  if (req.method != "POST") return res.status(401).end();
  const verify = await authorization(req, res);
  try {
    const body = await saveFile(req, "carousel");
    const [id] = await db("carousel").insert(body);
    const [data] = await db("carousel").where({ id });
    res.status(200).send(data);
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
