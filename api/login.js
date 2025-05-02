const { connectToDatabase } = require("../lib/mongodb");

module.exports = async function handler(req, res) {
  console.log("[DEBUG] Richiesta ricevuta su api/login");
    
  if (req.method !== "POST") {
    console.log("Metodo non  supportato:", req.method);
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { email, password } = req.body;
console.log ("[DEBUG] Dati Ricevuti:",{email, password});
  if (!email || !password) {
    console.log("DatiMancanti");
    return res.status(400).json({ message: "Email e password sono obbligatori" });
  }
  
  try {
    const { db } = await connectToDatabase();
    console.log(" Connessione a MongoDB riuscita!");
    
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      console.log({message: "Nessun Utente trovato con questa email"});
      return res.status(404).json({ message: "Utente non trovato" });
    }
    

    const bcrypt = require("bcryptjs");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(" Password errata !");
      return res.status(401).json({ message: "Password errata" });
    }
    console.log("Login riuscito!");
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
    console.error("Errore nel login:", err);
    return res.status(500).json({ message: "Errore del server", error: err.message });
  }
};