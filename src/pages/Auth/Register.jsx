import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  // Genera avatar casuale all'inizio
  useEffect(() => {
    generateAvatar();
  }, []);

  const generateAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
    setAvatar(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password, nickname, avatar };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registrazione completata!");
        navigate("/login");
      } else {
        alert(data.message || "Errore durante la registrazione.");
      }
    } catch (err) {
      alert("Errore di rete.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Crea il tuo account</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 caratteri)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={styles.input}
          required
        />

        {avatar && (
          <>
            <img
              src={avatar}
              alt="Avatar"
              style={{ width: 100, height: 100, borderRadius: "50%", margin: "10px auto" }}
            />
            <button type="button" style={styles.secondaryButton} onClick={generateAvatar}>
              Rigenera Avatar
            </button>
          </>
        )}

        <button type="submit" style={styles.button}>
          Registrati
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: "#111",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },
  form: {
    background: "#1e1e1e",
    padding: "30px",
    borderRadius: "16px",
    color: "#fff",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    width: "100%",
    background: "#2e2e2e",
    color: "#fff",
  },
  button: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6c63ff",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s",
    width: "100%",
  },
  secondaryButton: {
    marginTop: "10px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #6c63ff",
    backgroundColor: "#2e2e2e",
    color: "#6c63ff",
    cursor: "pointer",
  },
};

export default Register;
