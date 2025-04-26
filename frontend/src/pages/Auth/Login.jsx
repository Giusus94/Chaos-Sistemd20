import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://chaos-sistemd20.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Salva token, nickname e avatar nel localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('nickname', data.nickname);
        localStorage.setItem('avatar', data.avatar);

        // ✅ Dopo login, naviga al profilo
        navigate('/profile');
      } else {
        setError(data.message || 'Login fallito');
      }
    } catch (err) {
      setError('Errore di rete o server non raggiungibile');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Accedi</button>
      </form>
    </div>
  );
};

export default Login;
