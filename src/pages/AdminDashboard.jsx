import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    fetch("/api/users", {
      headers: {
        "x-user-role": user.role
      }
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => console.error("Errore:", err));
  }, [navigate]);

  const updateRole = async (userId, newRole) => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": currentUser.role
      },
      body: JSON.stringify({ userId, newRole })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Ruolo aggiornato!");
      // 🔄 refresh utenti
      const refreshed = await fetch("/api/users", {
        headers: { "x-user-role": currentUser.role }
      });
      const newData = await refreshed.json();
      setUsers(newData.users || []);
    } else {
      alert(data.message || "Errore durante l'aggiornamento");
    }
  };

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>👑 Admin Dashboard</h2>
      <table border="1" style={{ width: "100%", background: "#2c2c2c", color: "white" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nickname</th>
            <th>Ruolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.nickname}</td>
              <td>{u.role || "player"}</td>
              <td>
                <select
                  value={u.role || "player"}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                >
                  <option value="player">player</option>
                  <option value="mod">mod</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
