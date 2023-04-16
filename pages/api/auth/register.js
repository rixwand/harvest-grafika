import db from "@libs/koneksi";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method != "POST") return res.status(405).end();

  const { username, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  try {
    await db("admin").insert({
      username,
      email,
      password: passwordHash,
    });
    res.status(200).json({ status: "register success" });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
