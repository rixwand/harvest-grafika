import db from "@libs/koneksi";
import authorization from "@middlewares/authorization";
import bcrypt from "bcryptjs";
import { deletaAllFiles, deleteFile } from "@middlewares/files";

export default async function handler(req, res) {
  if (req.method != "DELETE") return res.status(405).end();

  const { email } = await authorization(req, res);

  const { id } = req.query;
  const { image } = req.body;

  try {
    if (id == "all") {
      const { password } = req.body;
      await deletaAllFiles();
      const [admin] = await db("admin").where({ email });
      const checkPass = bcrypt.compareSync(password, admin.password);
      if (!checkPass) return res.status(403).send("password incorrect");
      await db("products_tags").del();
      await db("products").del();
      return res.status(200).send("all products deleted");
    }
    await db("products_tags").where({ products_id: id }).del();
    await db("products").where({ id }).del();
    // await deleteFile("products", image);
    const [rows] = await db("products").count("id");
    res.status(200).send(`remain rows : ${rows["count(`id`)"]}`);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
