// ✅ /api/sessions.js
const { connectToDatabase } = require("../lib/mongodb");
const { ObjectId } = require("mongodb");

module.exports = async function handler(req, res) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();

    if (method === "POST") {
      const { lobbyId, startedBy, players } = req.body;
      if (!lobbyId || !startedBy || !players) {
        return res.status(400).json({ message: "Dati mancanti" });
      }

      const session = {
        lobbyId,
        startedBy,
        players,
        log: [],
        createdAt: new Date(),
      };

      const result = await db.collection("sessions").insertOne(session);
      return res.status(200).json({ sessionId: result.insertedId });
    }
    if (method === "GET") {
      const sessions = await db.collection("sessions").find().toArray();
      return res.status(200).json({ sessions });
    }
    
    if (method === "PATCH") {
      const { sessionId, logEntry } = req.body;
      if (!sessionId || !logEntry) {
        return res.status(400).json({ message: "Dati mancanti per il log" });
      }

      await db.collection("sessions").updateOne(
        { _id: new ObjectId(sessionId) },
        { $push: { log: { ...logEntry, timestamp: new Date() } } }
      );

      return res.status(200).json({ message: "Log aggiunto" });
    }

    return res.status(405).json({ message: "Metodo non supportato" });
  } catch (error) {
    console.error("Errore nella sessione:", error);
    return res.status(500).json({ message: "Errore del server" });
  }
};
