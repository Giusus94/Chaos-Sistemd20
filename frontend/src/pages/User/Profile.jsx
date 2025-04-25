import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    alert('Logout effettuato con successo.');
    navigate('/login'); // ritorna alla login
  };
  
  return (
    <div>
     <h2>Benvenuto nel tuo profilo!</h2>
<p>Sei autenticato come: <strong>{localStorage.getItem('email')}</strong></p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
