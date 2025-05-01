import { connectToDatabase } from "./mongodb"; // se usi un helper
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { email, password, nickname, avatar } = req.body;

  if (!email || !password || !nickname || !avatar) {
    return res.status(400).json({ message: "Campi mancanti" });
  }

  try {
    const { db } = await connectToDatabase();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Utente già registrato" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      nickname,
      avatar,
      createdAt: new Date()
    };

    await db.collection("users").insertOne(newUser);

    return res.status(200).json({ message: "Registrazione completata!" });
  } catch (err) {
    return res.status(500).json({ message: "Errore del server" });
  }
}
