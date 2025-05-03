const { connectToDatabase } = require("../lib/mongodb");
const bcrypt = require("bcryptjs"); // <--- IMPORTA bcryptjs

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password, nickname, avatar } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { db } = await connectToDatabase();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email già registrata" });
    }

    // 🔐 Cifra la password PRIMA di salvarla
    const hashedPassword = await bcryptjs.hash(password, 10);

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword, // <--- salva la password cifrata
      nickname,
      avatar,
      createdAt: new Date()
    });

    return res.status(201).json({ message: "Registrazione completata", userId: result.insertedId });

  } catch (err) {
    console.error("Errore durante la registrazione:", err);
    return res.status(500).json({ message: "Errore del server", error: err.message });
  }
};
