import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";
import { deleteFile, saveFile } from "@middlewares/files";

export default async function handler(req, res) {
  if (req.method != "PUT") return res.status(405).end();
  const auth = await authorization(req, res);
  try {
    const { id } = req.query;
    const parsed = await saveFile(req, "category");
    console.log(parsed);
    // extract old image name
    const { oldImage, body } = (({ oldImage = null, ...body }) => ({
      oldImage,
      body,
    }))(parsed);
    await db("category")
      .where({ id })
      .update({
        ...body,
      });
    // delete Image if image update
    if (oldImage != null) {
      deleteFile("category", oldImage);
    }
    const result = await db("category").where({ id });
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
