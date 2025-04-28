// Profile Page - React

import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <h2>Non sei loggato</h2>;
  }

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
