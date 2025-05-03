const { connectToDatabase } = require("../lib/mongodb");
const { ObjectId } = require("mongodb");

module.exports = async function handler(req, res) {
  const { db } = await connectToDatabase();

  const userRole = req.headers["x-user-role"];
  if (userRole !== "admin") {
    return res.status(403).json({ message: "Accesso negato" });
  }

  if (req.method === "GET") {
    const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();
    return res.status(200).json({ users });
  }

  if (req.method === "PATCH") {
    const { userId, newRole } = req.body;
    if (!userId || !newRole) {
      return res.status(400).json({ message: "userId e newRole sono obbligatori" });
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: newRole } }
    );

    return res.status(200).json({ message: "Ruolo aggiornato" });
  }

  return res.status(405).json({ message: "Metodo non consentito" });
};
