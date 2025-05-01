import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const uri = process.env.MONGO_URI;

  try {
    const client = await new MongoClient(uri).connect();
    const db = client.db("chaossystem");
    const collections = await db.listCollections().toArray();
    return res.status(200).json({ status: "ok", collections });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
