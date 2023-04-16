import db from "@libs/koneksi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method != "POST") return res.status(405).end();

  const { email, password } = req.body;
  if (!email) return res.status(401).end();
  const [admin] = await db("admin").where({ email });
  if (!admin) return res.status(401).end();

  const checkPass = bcrypt.compareSync(password, admin.password);
  if (!checkPass) return res.status(401).end();

  const token = jwt.sign(
    { username: admin.username, email },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );

  res.status(200).json({ status: "login success", token });
}
