import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');
  const [newNickname, setNewNickname] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // ✅ Cambia nickname e rigenera avatar legato
  const handleNicknameChange = async () => {
    if (newNickname.trim().length < 3) {
      toast.error('Il nickname deve avere almeno 3 caratteri.');
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
        localStorage.setItem('avatar', newAvatarUrl);
        toast.success('Nickname e avatar aggiornati con successo!');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Errore durante l\'aggiornamento');
      }
    } catch (err) {
      toast.error('Errore di rete');
    }
  };

  // ✅ Genera solo un nuovo avatar casuale
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
          nickname, // Mantieni il nickname attuale
          avatar: newAvatarUrl
        })
      });

      if (res.ok) {
        setAvatar(newAvatarUrl);
        localStorage.setItem('avatar', newAvatarUrl);
        toast.success('Nuovo avatar generato e salvato!');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Errore durante aggiornamento avatar');
      }
    } catch (err) {
      toast.error('Errore di rete');
    }
  };

  // ✅ Gestione caricamento file immagine personalizzata
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      toast.error('Seleziona prima un file immagine!');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('https://chaos-sistemd20.onrender.com/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setAvatar(data.avatar);
        localStorage.setItem('avatar', data.avatar);
        toast.success('Avatar personale caricato con successo!');
      } else {
        toast.error(data.message || 'Errore durante l\'upload avatar');
      }
    } catch (err) {
      toast.error('Errore di rete');
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
        <br /><br />

        {/* Upload Avatar Personalizzato */}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button onClick={handleUploadAvatar}>Carica Avatar Personale</button>
      </div>
    </div>
  );
};

export default Profile;
