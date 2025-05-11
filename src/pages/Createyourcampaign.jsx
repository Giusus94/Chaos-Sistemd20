// ✅ src/pages/CreateCampaign.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Generico",
    maxPlayers: 4,
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/lobbies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        master: { id: user.id, nickname: user.nickname },
        players: [{ id: user.id, nickname: user.nickname, avatar: user.avatar }],
      }),
    });

    const data = await res.json();
    if (res.ok) {
      navigate(`/campaign/${data.lobbyId}`);
    } else {
      alert(data.message || "Errore nella creazione della campagna");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">🛠️ Crea Nuova Campagna</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Titolo della campagna"
          value={formData.title}
          onChange={handleChange}
          required
          className="p-2 rounded bg-gray-800 text-white"
        />
        <textarea
          name="description"
          placeholder="Descrizione"
          value={formData.description}
          onChange={handleChange}
          required
          className="p-2 rounded bg-gray-800 text-white"
        ></textarea>
        <input
          type="text"
          name="type"
          placeholder="Tipologia (es: Horror, Sci-Fi, Fantasy...)"
          value={formData.type}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="number"
          name="maxPlayers"
          placeholder="Numero massimo di giocatori"
          value={formData.maxPlayers}
          onChange={handleChange}
          min={1}
          max={20}
          className="p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="url"
          name="image"
          placeholder="URL immagine della campagna (opzionale)"
          value={formData.image}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          ➕ Crea Campagna
        </button>
      </form>
    </div>
  );
}
