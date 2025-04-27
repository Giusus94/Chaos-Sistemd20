import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se non viene inserito un avatar personalizzato, genera uno random
    const randomAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${nickname}`;

    try {
      const res =API_URL = process.env.REACT_APP_API_URL; 
      fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, nickname, avatar: randomAvatar }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registrazione completata! Ora effettua il login.');
        navigate('/login');
      } else {
        setError(data.message || 'Registrazione fallita');
        toast.error(data.message || 'Registrazione fallita');
      }
    } catch (err) {
      setError('Errore di rete o server non raggiungibile');
      toast.error('Errore di rete o server non raggiungibile');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
      <h2>Registrazione</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <br />
        <input
          type="password"
          placeholder="Password (6-16 caratteri)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <br />
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <br />
        <button type="submit" style={{ padding: '8px 20px' }}>Registrati</button>
      </form>
    </div>
  );
};

export default Register;
