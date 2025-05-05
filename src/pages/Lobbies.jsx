// ✅ src/pages/Lobbies.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Lobbies = () => {
  const [lobbies, setLobbies] = useState([]);
  const [asMaster, setAsMaster] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("/api/lobbies")
      .then(res => res.json())
      .then(data => setLobbies(data.lobbies))
      .catch(err => console.error("Errore nel caricamento lobbies:", err));
  }, []);

  const handleCreateLobby = async () => {
    const name = prompt("Nome della nuova lobby:");
    if (!name) return;
    const description = prompt("Descrizione:") || "";
    const type = prompt("Tipologia campagna:") || "Generico";
    const maxPlayers = parseInt(prompt("Numero massimo giocatori:"), 10) || 4;

    const res = await fetch("/api/lobbies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        type,
        maxPlayers,
        master: asMaster ? { id: user.id, nickname: user.nickname } : null,
        players: asMaster ? [] : [
          { id: user.id, nickname: user.nickname, avatar: user.avatar }
        ]
      }),
    });

    const data = await res.json();
    if (res.ok) navigate(`/lobby/${data.lobbyId}`);
    else alert(data.message || "Errore nella creazione della lobby");
  };

  const handleJoin = async (lobbyId) => {
    const res = await fetch("/api/lobbies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lobbyId,
        player: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
        },
      }),
    });
    const data = await res.json();
    if (res.ok) navigate(`/lobby/${lobbyId}`);
    else alert(data.message || "Errore nell'unione alla lobby");
  };

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>Lobby disponibili</h2>
      <label style={{ marginBottom: "1rem", display: "inline-block" }}>
        <input
          type="checkbox"
          checked={asMaster}
          onChange={() => setAsMaster(!asMaster)}
        />
        Crea come Master
      </label>
      <p style={{ color: "gray" }}>
        Ruolo selezionato: <strong>{asMaster ? "🧙 Master" : "🎲 Giocatore"}</strong>
      </p>
      <button onClick={handleCreateLobby}>Crea nuova lobby</button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {lobbies.map((lobby) => (
          <li key={lobby._id} style={{ marginBottom: "1rem" }}>
            <strong>{lobby.name}</strong> – {lobby.description} <br />
            Tipologia: {lobby.type || "N/A"}<br />
            Master: {lobby.master ? lobby.master.nickname : "—"} <br />
            Giocatori: {lobby.players.length} / {lobby.maxPlayers} <br />
            <button onClick={() => handleJoin(lobby._id)}>Unisciti</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobbies;
