import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://chaos-sistemd20.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // (opzionale) salva token: localStorage.setItem('token', data.token);
        navigate('/login'); // o direttamente /profile se preferisci
      } else {
        setError(data.message || 'Registrazione fallita');
      }
    } catch (err) {
      setError('Errore di rete o server non raggiungibile');
    }
  };

  return (
    <div>
      <h2>Registrati</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
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
      <p>Hai già un account? <a href="/login">Accedi qui</a></p>
      <p>Non hai un account? <a href="/register">Registrati</a></p>

    </div>
  );
};

export default Register;
