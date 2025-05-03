const { connectToDatabase } = require("../lib/mongodb");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    // Lettura dell'admin dal header (es. da localStorage)
    const userRole = req.headers["x-user-role"];
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Accesso negato" });
    }

    const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();
    return res.status(200).json({ users });

  } catch (err) {
    console.error("Errore caricamento utenti:", err);
    return res.status(500).json({ message: "Errore del server" });
  }
};
