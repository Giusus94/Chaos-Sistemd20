const { connectToDatabase } = require("../lib/mongodb");
const bcrypt = require("bcrypt");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e password sono obbligatori" });
  }

  try {
    const { db } = await connectToDatabase();

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password errata" });
    }

    // ✅ Assicurati che venga incluso anche il role
    return res.status(200).json({
      message: "Login effettuato",
      user: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role || "player", // default se non esiste
      },
    });

  } catch (err) {
    console.error("Errore nel login:", err);
    return res.status(500).json({ message: "Errore del server", error: err.message });
  }
};
