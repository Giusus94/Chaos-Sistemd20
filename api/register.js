import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { email, password, nickname, avatar } = req.body;

  if (!email || !password || !nickname || !avatar) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
  }

  try {
    await client.connect();
    const db = client.db("chaossystem");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Utente già registrato" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      nickname,
      avatar,
      createdAt: new Date()
    });

    return res.status(200).json({ message: "Registrazione completata!" });
  } catch (err) {
    return res.status(500).json({ message: "Errore del server", error: err.message });
  }
}
