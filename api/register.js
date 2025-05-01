import { connectToDatabase } from "./_db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { email, password, nickname, avatar } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ message: "Campi richiesti mancanti" });
  }

  try {
    const { db } = await connectToDatabase();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email già registrata" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      nickname,
      avatar: avatar || "",
    });

    res.status(201).json({ message: "Registrazione completata con successo" });
  } catch (err) {
    console.error("Errore:", err);
    res.status(500).json({ message: "Errore server" });
  }
}
