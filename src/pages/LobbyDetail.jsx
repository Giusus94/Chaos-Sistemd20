// ✅ src/pages/LobbyDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LobbyDetail = () => {
  const { id } = useParams();
  const [lobby, setLobby] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/lobbies")
      .then(res => res.json())
      .then(data => {
        const found = data.lobbies.find((l) => l._id === id);
        if (found) setLobby(found);
        else navigate("/lobbies");
      });
  }, [id, navigate]);

  const handleClose = async () => {
    const confirmClose = window.confirm("Vuoi davvero chiudere questa lobby?");
    if (!confirmClose) return;

    const res = await fetch("/api/lobbies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lobbyId: id }),
    });

    if (res.ok) navigate("/lobbies");
    else alert("Errore nella chiusura della lobby");
  };

  if (!lobby) return <p style={{ color: "white" }}>Caricamento...</p>;

  const isMaster = user.id === lobby.master.id;

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>{lobby.name}</h2>
      <p>{lobby.description}</p>
      <p>Master: {lobby.master.nickname}</p>
      <p>Giocatori ({lobby.players.length}/{lobby.maxPlayers}):</p>
      <ul>
        {lobby.players.map((p) => (
          <li key={p.id}>{p.nickname}</li>
        ))}
      </ul>

      {isMaster && (
        <>
          <button style={{ marginTop: "1rem" }} onClick={handleClose}>Chiudi Lobby</button>
          <button disabled style={{ marginLeft: "1rem" }}>Avvia Sessione (prossimo step)</button>
        </>
      )}

      {!isMaster && (
        <button onClick={() => navigate("/lobbies")}>Esci dalla lobby</button>
      )}
    </div>
  );
};

export default LobbyDetail;
