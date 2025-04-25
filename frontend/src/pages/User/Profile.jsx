import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../../utils/auth';
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
    const { logout } = useContext(AuthContext);
    logout();
    alert('Logout effettuato con successo.');
    navigate('/login'); // ritorna alla login
  };
  return (
    <div>
     <p>Sei autenticato come: <strong>{useContext(AuthContext).email}</strong></p>
     <p>Sei autenticato come: <strong>{email}</strong></p>


     <button onClick={logout}>Logout</button>

    </div>
  );
};

export default Profile;
