import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Profilo Utente</h1>
      <img
        src={user.avatar || 'https://api.dicebear.com/7.x/adventurer/svg'}
        alt="Avatar"
        style={{ width: '100px', height: '100px', borderRadius: '50%' }}
      />
      <h2>{user.nickname || 'Anonimo'}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
console.log("Utente corrente:", user);
