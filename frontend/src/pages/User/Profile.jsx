import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();

  // Stati locali per nickname, avatar e nuovo nickname
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');
  const [newNickname, setNewNickname] = useState('');

  // Effetto per proteggere la pagina: se non loggato ➔ redirect login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Funzione per aggiornare nickname + avatar
  const handleNicknameChange = async () => {
    if (newNickname.trim().length < 3) {
      toast.error('Il nickname deve avere almeno 3 caratteri.');
      return;
    }

    const newAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${newNickname}`;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nickname: newNickname, avatar: newAvatarUrl })
      });

      const data = await res.json();

      if (res.ok) {
        // Aggiorna localStorage e stati
        setNickname(newNickname);
        setAvatar(newAvatarUrl);
        localStorage.setItem('nickname', newNickname);
        localStorage.setItem('avatar', newAvatarUrl);
        toast.success('Profilo aggiornato!');
      } else {
        toast.error(data.message || 'Errore durante aggiornamento.');
      }
    } catch (err) {
      toast.error('Errore di rete.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Profilo Utente</h1>

      {/* Avatar */}
      <img
        src={avatar}
        alt="Avatar"
        style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '20px' }}
      />

      {/* Nickname */}
      <h2>{nickname}</h2>

      {/* Form modifica nickname */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Nuovo Nickname"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          style={{ padding: '8px', width: '200px' }}
        />
        <br /><br />
        <button onClick={handleNicknameChange} style={{ marginRight: '10px' }}>Aggiorna Nickname + Avatar</button>
      </div>
    </div>
  );
};

export default Profile;
