const { connectToDatabase } = require("../lib/mongodb");
const bcrypt = require("bcrypt");

module.exports = async function handler(req, res) {
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
      return res.status(404).json({ message: "Utente non trovato" });
    }

    if (!user.password) {
      return res.status(500).json({ message: "Password non trovata nel database" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password errata" });
    }

    return res.status(200).json({
      message: "Login effettuato",
      user: {
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        id: user._id,
      },
    });

  } catch (err) {
    console.error("Errore durante il login:", err);
    return res.status(500).json({ message: "Errore del server", error: err.message });
  }
};
