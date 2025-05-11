// ✅ /api/sessions/chat.js
import { connectToDatabase } from "../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { sessionId, message, nickname } = req.body;

  if (!sessionId || !message || !nickname) {
    return res.status(400).json({ message: "Dati mancanti" });
  }

  try {
    const { db } = await connectToDatabase();

    const chatEntry = {
      type: "chat",
      user: nickname,
      text: message,
      timestamp: new Date()
    };

    const result = await db.collection("sessions").updateOne(
      { _id: sessionId },
      { $push: { log: chatEntry } }
    );

    if (result.modifiedCount === 1) {
      const session = await db.collection("sessions").findOne({ _id: sessionId });
      return res.status(200).json({ message: "Messaggio inviato", log: session.log });
    } else {
      return res.status(404).json({ message: "Sessione non trovata" });
    }
  } catch (err) {
    console.error("Errore durante l'invio della chat:", err);
    return res.status(500).json({ message: "Errore del server", error: err.message });
  }
}
