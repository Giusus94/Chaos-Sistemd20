import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getToken, removeToken } from '../../utils/auth';

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login'); // se non loggato → redireziona
    }
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div>
      <h2>Benvenuto nel tuo profilo!</h2>
      <p>Il tuo token è:</p>
      <code>{getToken()}</code>

      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
