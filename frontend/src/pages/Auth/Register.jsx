import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 6 || password.length > 16) {
      setError('La password deve contenere tra 6 e 16 caratteri');
      return;
    }

    // Genera avatar automaticamente
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${nickname}`;

    try {
      const res = await fetch('https://chaos-sistemd20.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname, avatar: avatarUrl })
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registrazione fallita');
      }
    } catch (err) {
      setError('Errore di rete o server non raggiungibile');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
      <h2>Registrati</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="text" placeholder="Nickname" value={nickname}
          onChange={(e) => setNickname(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Crea Account</button>
      </form>
    </div>
  );
};

export default Register;
