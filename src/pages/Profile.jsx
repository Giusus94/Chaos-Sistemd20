import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <p>Caricamento dati...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Benvenuto, {user.nickname}</h2>
      {user.avatar ? (
        <img src={user.avatar} alt="Avatar" style={styles.avatar} />
      ) : (
        <p style={{ color: "gray" }}>Nessun avatar</p>
      )}
      <p><strong>Email:</strong> {user.email}</p>
      <p>
        <strong>Ruolo:</strong>{" "}
        <span style={{ color: user.role === "admin" ? "lightgreen" : "#ccc" }}>
          {user.role}
        </span>
      </p>

      {user.role === "admin" && (
        <button onClick={() => navigate("/admin")} style={styles.adminButton}>
          Vai alla Admin Dashboard
        </button>
      )}

      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    color: "white",
    textAlign: "center",
    fontFamily: "Arial",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    marginBottom: "1rem",
  },
  adminButton: {
    backgroundColor: "#6c63ff",
    border: "none",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    margin: "1rem",
    cursor: "pointer",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Profile;
