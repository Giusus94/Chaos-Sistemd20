import { connectToDatabase } from "./_db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e password sono obbligatorie" });
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login riuscito",
      token,
      nickname: user.nickname,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Errore login:", err);
    res.status(500).json({ message: "Errore interno del server" });
  }
}
