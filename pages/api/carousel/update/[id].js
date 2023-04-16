import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";
import { saveFile, deleteFile } from "@middlewares/files";

export default async function handler(req, res) {
  if (req.method != "PUT") return res.status(401).end();
  const verify = await authorization(req, res);
  try {
    const { id } = req.query;
    const parsing = await saveFile(req, "carousel");
    const { oldImage, body } = (({ oldImage = null, ...body }) => ({
      oldImage,
      body,
    }))(parsing);
    await db("carousel").where({ id }).update(body);
    const [result] = await db("carousel").where({ id });
    if (oldImage != null) {
      deleteFile("carousel", oldImage);
    }
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
