const { connectToDatabase } = require("../lib/mongodb");
const bcrypt = require("bcrypt"); // CORRETTO

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

    const hashedPassword = await bcrypt.hash(password, 10); // CORRETTO

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
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

