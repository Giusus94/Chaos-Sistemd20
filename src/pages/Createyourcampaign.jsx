// ✅ src/pages/CreateCampaign.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    imageUrl: "",
    maxPlayers: 4,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/lobbies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.title,
        description: form.description,
        type: form.type,
        imageUrl: form.imageUrl,
        maxPlayers: parseInt(form.maxPlayers, 10),
        master: { id: user.id, nickname: user.nickname },
        players: [],
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-[#1e1e1e] text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">📖 Crea Nuova Campagna</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Titolo della campagna"
          className="w-full p-2 rounded bg-[#2c2c2c]"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descrizione"
          className="w-full p-2 rounded bg-[#2c2c2c]"
          rows="4"
          value={form.description}
          onChange={handleChange}
        ></textarea>
        <input
          type="text"
          name="type"
          placeholder="Tipologia (es. Fantasy, Cyberpunk)"
          className="w-full p-2 rounded bg-[#2c2c2c]"
          value={form.type}
          onChange={handleChange}
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="URL immagine copertina"
          className="w-full p-2 rounded bg-[#2c2c2c]"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPlayers"
          placeholder="Numero massimo giocatori"
          className="w-full p-2 rounded bg-[#2c2c2c]"
          value={form.maxPlayers}
          onChange={handleChange}
          min={1}
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
        >
          ➕ Crea Campagna
        </button>
      </form>
    </div>
  );
}
