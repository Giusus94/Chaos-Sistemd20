import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "2rem", color: "white", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Benvenuto in Chaos System d20!</h1>

      <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
        Chaos System d20 è un sistema di gioco di ruolo innovativo ambientato in un universo sci-fi post-apocalittico dove magia, tecnologia e strategia si fondono per creare campagne epiche e combattimenti dinamici.
      </p>

      <div style={{ marginTop: "2rem" }}>
        {!user ? (
          <>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Crea un personaggio, esplora il multiverso e unisciti alle missioni di altri giocatori.
            </p>
            <Link to="/register" style={{ marginRight: "1rem", color: "#61dafb" }}>Registrati ora</Link>
            <Link to="/login" style={{ color: "#61dafb" }}>Accedi</Link>
          </>
        ) : (
          <>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              Bentornato <strong>{user.nickname}</strong>! Continua le tue avventure:
            </p>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              <li><Link to="/profile" style={{ color: "#61dafb" }}>Profilo</Link></li>
              <li><Link to="/marketplace" style={{ color: "#61dafb" }}>Marketplace</Link></li>
              <li><Link to="/your-games" style={{ color: "#61dafb" }}>Le tue campagne</Link></li>
              {user.role === "admin" && (
                <li><Link to="/admin" style={{ color: "#ffcc00" }}>🔧 Admin Dashboard</Link></li>
              )}
            </ul>
          </>
        )}
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h2>🔥 Cosa puoi fare su Chaos System d20</h2>
        <ul style={{ marginTop: "1rem", fontSize: "1rem" }}>
          <li>🎲 Crea e personalizza il tuo eroe</li>
          <li>⚔️ Partecipa a battaglie strategiche</li>
          <li>📚 Esplora moduli di avventura ufficiali</li>
          <li>💬 Chatta e commercia con altri giocatori</li>
          <li>🧙‍♂️ Sblocca Classi Uniche e abilità nascoste</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
