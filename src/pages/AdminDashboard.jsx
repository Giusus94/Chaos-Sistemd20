import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login"); // blocca accesso se non admin
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

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Email</th>
            <th>Nickname</th>
            <th>Ruolo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.nickname}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
