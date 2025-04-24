import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('https://chaos-sistemd20.onrender.com/api/profilo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || 'Benvenuto nel tuo profilo!');
      })
      .catch(() => {
        setMessage('Errore nel caricamento del profilo.');
      });
  }, []);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

export default Profile;
