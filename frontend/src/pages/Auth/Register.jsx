import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nickname, avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${nickname}` }),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registrazione completata! Ora puoi fare il login.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Errore nella registrazione.');
      }
    } catch (err) {
      toast.error('Errore di rete.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '60px', textAlign: 'center' }}>
      <h2>Registrati</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password (6-16 caratteri)" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="Nickname" required value={nickname} onChange={(e) => setNickname(e.target.value)} />
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
};

export default Register;
