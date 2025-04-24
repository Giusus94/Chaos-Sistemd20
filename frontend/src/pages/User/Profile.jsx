import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('https://chaos-sistemd20.onrender.com/api/profilo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Accesso non autorizzato.'));
  }, []);

  return (
    <div>
      <h2>👤 Profilo</h2>
      <p>{message}</p>
    </div>
  );
};

export default Profile;
