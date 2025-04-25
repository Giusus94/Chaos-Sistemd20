import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { checkAuth } from '../../utils/auth';


const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        navigate('/profile');
      }
    };
    verify();
  }, []);

  // ...
};

const Login = () => {
  const navigate = useNavigate();

  // Stato per i dati dell’utente
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Funzione chiamata al submit del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // blocca il reload della pagina

    try {
      const res = await fetch('https://chaos-sistemd20.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Salva il token nel browser
        localStorage.setItem('token', data.token);
        // Vai alla pagina profilo
        navigate('/profile');
      } else {
        setError(data.message || 'Login fallito');
      }
    } catch (err) {
      setError('Errore di rete o server non raggiungibile');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
