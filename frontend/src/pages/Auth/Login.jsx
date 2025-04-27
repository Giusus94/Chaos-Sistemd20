import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  // Stati per email e password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Funzione invocata al submit del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Invia richiesta POST per il login
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        // Salva token e dati utente su localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('nickname', data.nickname);
        localStorage.setItem('avatar', data.avatar);

        toast.success(`Benvenuto ${data.nickname}!`);
        navigate('/profile');
      } else {
        toast.error(data.message || 'Credenziali non valide.');
      }
    } catch (err) {
      toast.error('Errore di rete.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '60px', textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Accedi</button>
      </form>
    </div>
  );
};

export default Login;
