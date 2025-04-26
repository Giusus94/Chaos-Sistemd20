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
        toast.success('Avatar aggiornato con successo!');
      } else {
        toast.error(data.message || 'Errore durante upload');
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
