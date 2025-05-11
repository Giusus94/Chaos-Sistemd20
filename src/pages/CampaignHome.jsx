// ✅ src/pages/CampaignHome.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CampaignHome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/lobbies?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.lobby) {
          setCampaign(data.lobby);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore caricamento campagna:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ color: "white" }}>Caricamento...</p>;
  if (!campaign) return <p style={{ color: "white" }}>Campagna non trovata</p>;

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-2">📖 {campaign.name}</h2>
      <p className="text-lg text-gray-300 mb-4">{campaign.description}</p>
      <p className="text-sm text-gray-500 mb-2">Tipologia: {campaign.type}</p>
      <p className="text-sm text-gray-500 mb-4">
        Master: {campaign.master ? campaign.master.nickname : "—"}
      </p>

      <img
        src="https://source.unsplash.com/800x300/?fantasy,magic"
        alt="Copertina campagna"
        className="rounded mb-4"
      />

      <button
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate(`/lobby/${campaign._id}`)}
      >
        🎲 Entra nella Lobby
      </button>
    </div>
  );
}
