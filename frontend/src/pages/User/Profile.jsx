import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [newNickname, setNewNickname] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    if (!user || !user.token) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    if (newNickname.trim().length < 3) {
      toast.error('Il nickname deve avere almeno 3 caratteri.');
      return;
    }

    const newAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${newNickname}`;

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        credentials: 'include',
        body: JSON.stringify({ nickname: newNickname, avatar: newAvatar })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profilo aggiornato!');
        setPreviewAvatar(newAvatar);
      } else {
        toast.error(data.message || 'Errore durante l\'aggiornamento');
      }
    } catch (err) {
      toast.error('Errore di rete');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
      <h1>Il tuo profilo</h1>

      {previewAvatar && (
        <img
          src={previewAvatar}
          alt="Avatar"
          style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '20px' }}
        />
      )}

      <h2>{user?.nickname || 'Nickname non disponibile'}</h2>

      <input
        type="text"
        placeholder="Nuovo nickname"
        value={newNickname}
        onChange={(e) => setNewNickname(e.target.value)}
        style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
      />
      <br />

      <button onClick={handleUpdateProfile} style={{ margin: '10px', padding: '10px 20px' }}>
        Aggiorna Nickname + Avatar
      </button>

      <button onClick={logout} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'red', color: 'white' }}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
