// ✅ api/lobbies.js
const { connectToDatabase } = require("../lib/mongodb");
const { ObjectId } = require("mongodb");

module.exports = async function handler(req, res) {
  const { db } = await connectToDatabase();

  switch (req.method) {
    case "GET": {
      const lobbies = await db.collection("lobbies").find().toArray();
      return res.status(200).json({ lobbies });
    }

    case "POST": {
      const { name, description, type, maxPlayers, master, players } = req.body;

      if (!name || !maxPlayers || (!master && (!players || players.length === 0))) {
        return res.status(400).json({ message: "Dati mancanti" });
      }

      const lobby = {
        name,
        description: description || "",
        type: type || "Generico",
        master: master || null,
        players: players || [],
        maxPlayers,
        createdAt: new Date(),
      };

      const result = await db.collection("lobbies").insertOne(lobby);
      return res.status(201).json({ lobbyId: result.insertedId });
    }

    case "PATCH": {
      const { lobbyId, player } = req.body;
      if (!lobbyId || !player?.id || !player?.nickname) {
        return res.status(400).json({ message: "Dati mancanti" });
      }

      const lobby = await db.collection("lobbies").findOne({ _id: new ObjectId(lobbyId) });
      if (!lobby) return res.status(404).json({ message: "Lobby non trovata" });

      const alreadyJoined = lobby.players.some(p => p.id === player.id);
      if (alreadyJoined) return res.status(200).json({ message: "Già unito" });

      if (lobby.players.length >= lobby.maxPlayers) {
        return res.status(403).json({ message: "Lobby piena" });
      }

      await db.collection("lobbies").updateOne(
        { _id: new ObjectId(lobbyId) },
        { $push: { players: player } }
      );

      return res.status(200).json({ message: "Unito con successo" });
    }

    case "DELETE": {
      const { lobbyId } = req.body;
      if (!lobbyId) return res.status(400).json({ message: "ID mancante" });

      await db.collection("lobbies").deleteOne({ _id: new ObjectId(lobbyId) });
      return res.status(200).json({ message: "Lobby eliminata" });
    }

    default:
      return res.status(405).json({ message: "Metodo non consentito" });
  }
};
