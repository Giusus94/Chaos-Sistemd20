const { connectToDatabase } = require("../lib/mongodb");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e password sono obbligatori" });
  }
  
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });
    console.log("🔎 Utente trovato:", user);

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const bcrypt = require("bcryptjs");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password errata" });
    }

    // Login riuscito
    return res.status(200).json({
      message: "Login effettuato",
      user: {
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        _id: user._id
      }
    });

  } catch (err) {
    console.error("🔥 [ERRORE LOGIN]:", err.message);
    return res.status(500).json({ message: "Errore del server", error: err.message });
  }
};