import db from "../../libs/koneksi";

export default async function handler(req, res) {
  const data = await db("products");
  res.status(200).json({ data });
}
