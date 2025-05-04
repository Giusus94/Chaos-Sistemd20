// ✅ src/pages/Lobbies.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Lobbies = () => {
  const [lobbies, setLobbies] = useState([]);
  const [asMaster, setAsMaster] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Avventura");
  const [maxPlayers, setMaxPlayers] = useState(4);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("/api/lobbies")
      .then((res) => res.json())
      .then((data) => setLobbies(data.lobbies))
      .catch((err) => console.error("Errore nel caricamento lobbies:", err));
  }, []);

  const handleCreateLobby = async () => {
    if (!name) return alert("Inserisci un nome per la campagna!");

    const res = await fetch("/api/lobbies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        type,
        maxPlayers,
        master: asMaster ? { id: user.id, nickname: user.nickname } : null,
        players: asMaster
          ? []
          : [{ id: user.id, nickname: user.nickname, avatar: user.avatar }],
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
      <h2>Crea nuova Lobby</h2>

      <input
        placeholder="Nome campagna"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Avventura">Avventura</option>
        <option value="Horror">Horror</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Sci-fi">Sci-fi</option>
        <option value="Comico">Comico</option>
      </select>
      <br />
      <input
        type="number"
        min="2"
        max="20"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
      />
      <label> Max giocatori</label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={asMaster}
          onChange={() => setAsMaster(!asMaster)}
        />{" "}
        Crea come Master
      </label>
      <p>
        Ruolo iniziale: <strong>{asMaster ? "🧙 Master" : "🎲 Giocatore"}</strong>
      </p>

      <button onClick={handleCreateLobby}>Crea</button>

      <hr />

      <h3>Lobbies disponibili</h3>
      <ul>
        {lobbies.map((lobby) => (
          <li key={lobby._id}>
            <strong>{lobby.name}</strong> – {lobby.type || "Generico"} <br />
            Master: {lobby.master?.nickname || "—"} <br />
            Giocatori: {lobby.players.length}/{lobby.maxPlayers} <br />
            <button onClick={() => handleJoin(lobby._id)}>Unisciti</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobbies;
