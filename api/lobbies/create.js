// ✅ /api/lobbies/create.js
import { connectToDatabase } from "../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { masterId, nickname } = req.body;
  if (!masterId || !nickname) {
    return res.status(400).json({ message: "Dati mancanti" });
  }

  try {
    const { db } = await connectToDatabase();

    const newLobby = {
      name: `Lobby di ${nickname}`,
      masterId,
      masterNickname: nickname,
      createdAt: new Date(),
      players: [],
      chat: [],
      map: null, // Puoi estendere più avanti
      status: "attiva"
    };

    const result = await db.collection("lobbies").insertOne(newLobby);

    return res.status(201).json({ message: "Lobby creata", lobbyId: result.insertedId });
  } catch (err) {
    console.error("Errore creazione lobby:", err);
    return res.status(500).json({ message: "Errore server", error: err.message });
  }
}
