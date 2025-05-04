// ✅ src/pages/LobbyDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LobbyDetail = () => {
  const { id } = useParams();
  const [lobby, setLobby] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [logInput, setLogInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
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
    if (!window.confirm("Vuoi davvero chiudere questa lobby?")) return;
    const res = await fetch("/api/lobbies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lobbyId: id }),
    });
    if (res.ok) navigate("/lobbies");
    else alert("Errore nella chiusura della lobby");
  };

  const startSession = async () => {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lobbyId: id,
        startedBy: { id: user.id, nickname: user.nickname },
        players: lobby.players,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSessionId(data.sessionId);
      setChatMessages([]);
    } else alert(data.message || "Errore avvio sessione");
  };

  const addLogEntry = async () => {
    if (!logInput || !sessionId) return;
    const res = await fetch("/api/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        logEntry: {
          type: "note",
          content: logInput,
        },
      }),
    });
    if (res.ok) setLogInput("");
  };

  const sendChatMessage = async () => {
    if (!chatInput || !sessionId) return;
    const res = await fetch("/api/sessions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        nickname: user.nickname,
        message: chatInput,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setChatMessages(data.log.filter(entry => entry.type === "chat"));
      setChatInput("");
    }
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
          <button onClick={handleClose}>Chiudi Lobby</button>
          <button onClick={startSession} style={{ marginLeft: "1rem" }}>
            {sessionId ? "Sessione Attiva" : "Avvia Sessione"}
          </button>
        </>
      )}

      {sessionId && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📖 Log Sessione</h3>
          <textarea
            rows="3"
            placeholder="Annota evento, decisione, esito..."
            value={logInput}
            onChange={(e) => setLogInput(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          ></textarea>
          <button onClick={addLogEntry} style={{ marginTop: "0.5rem" }}>
            Aggiungi al log
          </button>

          <div style={{ marginTop: "2rem" }}>
            <h3>💬 Chat</h3>
            <div style={{ background: "#111", padding: "1rem", borderRadius: "8px", maxHeight: "200px", overflowY: "auto" }}>
              {chatMessages.map((msg, i) => (
                <div key={i}><strong>{msg.user}</strong>: {msg.text}</div>
              ))}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Scrivi un messaggio..."
                style={{ padding: "0.5rem", width: "80%" }}
              />
              <button onClick={sendChatMessage} style={{ marginLeft: "1rem", padding: "0.5rem" }}>
                Invia
              </button>
            </div>
          </div>
        </div>
      )}

      {!isMaster && (
        <button onClick={() => navigate("/lobbies")} style={{ marginTop: "1rem" }}>
          Esci dalla lobby
        </button>
      )}
    </div>
  );
};

export default LobbyDetail;
