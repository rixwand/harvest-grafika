import db from "@libs/koneksi";
export default async function handler(req, res) {
  if (req.method != "GET") return res.status(401).end();
  try {
    const carousel = await db("carousel");
    res.status(200).send(carousel);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
