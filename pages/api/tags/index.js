import db from "@libs/koneksi";
export default async function handler(req, res) {
  if (req.method != "GET") return res.status(405).end();
  try {
    const query = db("tags").orderBy("id", "asc");
    const { search } = req.query;
    if (search) {
      query
        .where("name", "like", `%${search}%`)
        .orWhere("name", "like", `%${search}%`);
    }
    const result = await query;
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
