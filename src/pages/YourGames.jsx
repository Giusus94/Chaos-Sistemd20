import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function YourGames() {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchLobbies = async () => {
    try {
      const res = await fetch("/api/lobbies");
      const data = await res.json();
      setLobbies(data.lobbies || []);
      setLoading(false);
    } catch (err) {
      console.error("Errore nel caricamento delle lobby:", err);
    }
  };

  useEffect(() => {
    fetchLobbies();
  }, []);

  const handleCreateLobby = async () => {
    const title = prompt("Titolo della nuova lobby:");
    if (!title) return;
  
    const res = await fetch("/api/lobbies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: title,
        description: "Partita generica",
        type: "Avventura",
        maxPlayers: 4,
        master: {
          id: user.id,
          nickname: user.nickname
        },
        players: []
      })
    });
  
    const data = await res.json();
    if (res.ok) {
      alert("Lobby creata!");
      navigate(`/lobby/${data.lobbyId}`);
    } else {
      alert(data.message || "Errore nella creazione della lobby");
    }
  };
  
  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">🎲 I Tuoi Giochi</h2>
      <p className="mb-4">Qui troverai le tue campagne e salvataggi personali.</p>

      <button
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-6"
        onClick={handleCreateLobby}
      >
        ➕ Crea Nuova Lobby
      </button>

      {loading ? (
        <p>Caricamento...</p>
      ) : lobbies.length === 0 ? (
        <p>Nessuna lobby disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lobbies.map((lobby) => (
            <div
              key={lobby._id}
              className="border border-gray-700 bg-[#2a2a2a] rounded p-4 hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/lobby/${lobby._id}`)}
            >
              <h3 className="text-lg font-semibold">🎮 {lobby.title}</h3>
              <p className="text-sm text-gray-400">Creatore: {lobby.creator}</p>
              <p className="text-sm text-gray-500">Giocatori: {lobby.players.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
