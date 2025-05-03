import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Inserisci email e password");
    }

    console.log("Invio:", { email, password });

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile");
      } else {
        alert(data.message || "Errore nel login");
      }
    } catch (error) {
      console.error("Errore durante il login:", error);
      alert("Errore di rete o del server");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Login</h2>
      <input
        type="email"
        autoComplete="off"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        style={{ margin: "0.5rem", padding: "0.5rem" }}
      />
      <input
        type="password"
        autoComplete="off"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Password"
        style={{ margin: "0.5rem", padding: "0.5rem" }}
      />
      <br />
      <button type="submit" style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        Accedi
      </button>
    </form>
  );
}
