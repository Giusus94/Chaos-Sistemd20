const { connectToDatabase } = require("../lib/mongodb");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const users = await db.collection("users").find().toArray();

    res.status(200).json(users);
  } catch (err) {
    console.error("Errore nel recupero utenti:", err);
    res.status(500).json({ message: "Errore server", error: err.message });
  }
};
