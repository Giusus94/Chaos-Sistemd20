import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../utils/auth';

const Profile = () => {
  const navigate = useNavigate();
  const { email, logout } = useContext(AuthContext); // <-- QUESTA è la chiamata corretta
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('https://chaos-sistemd20.onrender.com/api/profilo', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    logout();
    alert('Logout effettuato con successo.');
    navigate('/login');
  };

  return (
    <div>
      <p>Sei autenticato come: <strong>{email}</strong></p>

      <p>{message}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
