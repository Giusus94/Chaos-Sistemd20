import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');
  const [newNickname, setNewNickname] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // ✅ Funzione per aggiornare nickname + avatar
  const handleNicknameChange = async () => {
    if (newNickname.trim().length < 3) {
      toast.error('Il nickname deve avere almeno 3 caratteri.')

 
      return;
    }

    const newAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${newNickname}`;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('https://chaos-sistemd20.onrender.com/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nickname: newNickname,
          avatar: newAvatarUrl
        })
      });

      if (res.ok) {
        setNickname(newNickname);
        setAvatar(newAvatarUrl);
        localStorage.setItem('nickname', newNickname);
        toast.success('Nickname e avatar aggiornati con successo!');   
      } else {
        const errorData = await res.json();
        toast.error('Errore durante aggiornamento nickname')
      }
    } catch (err) {
      alert('Errore di rete');
    }
  };

  // ✅ Funzione per generare solo nuovo Avatar (nickname rimane uguale)
  const handleGenerateNewAvatar = async () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const newAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('https://chaos-sistemd20.onrender.com/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nickname, // mantieni il nickname attuale
          avatar: newAvatarUrl
        })
      });

      if (res.ok) {
        setAvatar(newAvatarUrl);
        localStorage.setItem('avatar', newAvatarUrl);
        toast.success('Nuovo avatar generato!')
      } else {
        const errorData = await res.json();
        toast.error('Errore durante aggiornamento avatar')
      }
    } catch (err) {
      toast.error('Errore di rete')
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Profilo Utente</h1>

      <img
        src={avatar}
        alt="Avatar"
        style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '20px' }}
      />
      <h2>{nickname}</h2>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Nuovo Nickname"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          style={{ padding: '8px', width: '200px' }}
        />
        <br /><br />
        <button onClick={handleNicknameChange} style={{ marginRight: '10px' }}>
          Aggiorna Nickname + Avatar
        </button>
        <button onClick={handleGenerateNewAvatar}>
          Solo Nuovo Avatar
        </button>
      </div>
    </div>
  );
};

export default Profile;
