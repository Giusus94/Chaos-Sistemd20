// Register Page - React

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname, avatar: '' })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registrazione completata!');
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Errore di rete');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password (6-16 caratteri)" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <input type="text" placeholder="Nickname" value={nickname}
          onChange={(e) => setNickname(e.target.value)} required />
        <br />
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
};

export default Register;
