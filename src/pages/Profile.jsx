
// ✅ Profile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <p>Caricamento dati...</p>;
  }

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
    </div>
  );
};

export default Profile;
