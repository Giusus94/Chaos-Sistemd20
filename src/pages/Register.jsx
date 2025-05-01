import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    generateAvatar();
  }, []);

  const generateAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatar(\`https://api.dicebear.com/7.x/adventurer/svg?seed=\${seed}\`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nickname, avatar })
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registrazione completata!");
      navigate("/login");
    } else {
      alert(data.message || "Errore");
    }
  };

  return (
    <div className="container">
      <h2>Registrati</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="Nickname" value={nickname} required onChange={(e) => setNickname(e.target.value)} />
        <input type="text" placeholder="Avatar URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        {avatar && <img src={avatar} alt="Avatar" style={{ width: 80, borderRadius: "50%" }} />}
        <button type="button" onClick={generateAvatar}>Rigenera Avatar</button>
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
};

export default Register;
