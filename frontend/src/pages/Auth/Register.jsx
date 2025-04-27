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
    setError('');

    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${nickname}`;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, nickname, avatar })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registrazione completata!');
        navigate('/login');
      } else {
        setError(data.message || 'Errore nella registrazione');
        toast.error(data.message || 'Errore nella registrazione');
      }
    } catch (err) {
      setError('Errore di rete');
      toast.error('Errore di rete');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
      <h2>Registrati</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password (6-16 caratteri)"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Nickname"
          required
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Registrati
        </button>
      </form>
    </div>
  );
};

export default Register;
