import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Tentativo di registrazione con:', email, password);

    try {
      const res = await fetch('https://chaos-sistemd20.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log('Risposta dal backend:', data);

      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registrazione fallita');
      }
    } catch (err) {
      console.error('Errore di rete:', err);
      setError('Errore di rete o server non raggiungibile');
    }
  };

  return (
    <div>
      <h2>Registrati</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Crea Account</button>
      </form>
    </div>
  );
};

export default Register;
