// ✅ src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (user) {
      fetch("/api/sessions")
        .then(res => res.json())
        .then(data => {
          const filtered = data.sessions.filter(s =>
            s.players.some(p => p.id === user.id)
          );
          setSessions(filtered);
        });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <p>Caricamento dati...</p>;

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>Benvenuto, {user.nickname}</h2>
      <img src={user.avatar} alt="Avatar" width={80} />
      <p>Email: {user.email}</p>
      {user.role === "admin" && (
        <>
          <p style={{ color: "lightgreen" }}>👑 Admin</p>
          <button onClick={() => navigate("/admin")}>Vai alla Admin Dashboard</button>
        </>
      )}
      <br />
      <button onClick={handleLogout}>Logout</button>

      <div style={{ marginTop: "2rem" }}>
        <h3>🕹️ Sessioni Giocate</h3>
        {sessions.length === 0 && <p>Nessuna sessione trovata.</p>}
        <ul>
          {sessions.map((s) => (
            <li key={s._id}>
              <strong>Lobby:</strong> {s.lobbyId} – <strong>Master:</strong> {s.startedBy.nickname} <br />
              Log: {s.log.length} eventi – <em>{new Date(s.createdAt).toLocaleString()}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
