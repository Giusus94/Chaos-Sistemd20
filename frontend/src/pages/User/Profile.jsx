import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const { token, nickname, setNickname, avatar, setAvatar, logout } = useContext(AuthContext);

  const [newNickname, setNewNicknameInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('https://chaos-sistemd20.onrender.com/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          console.log('Dati profilo ricevuti:', data);
          // opzionale: potresti voler aggiornare nickname/avatar qui se vuoi
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Errore di rete', err);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleNicknameChange = async () => {
    if (newNickname.trim().length < 3) {
      toast.error('Il nickname deve avere almeno 3 caratteri.');
      return;
    }

    const newAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${newNickname}`;

    try {
      const res = await fetch('https://chaos-sistemd20.onrender.com/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nickname: newNickname, avatar: newAvatarUrl })
      });

      if (res.ok) {
        setNickname(newNickname);
        setAvatar(newAvatarUrl);
        localStorage.setItem('nickname', newNickname);
        localStorage.setItem('avatar', newAvatarUrl);
        toast.success('Nickname e avatar aggiornati!');
        setNewNicknameInput('');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Errore durante aggiornamento');
      }
    } catch (err) {
      toast.error('Errore di rete');
    }
  };

  const handleGenerateNewAvatar = async () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const newAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;

    try {
      const res = await fetch('https://chaos-sistemd20.onrender.com/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nickname, avatar: newAvatarUrl })
      });

      if (res.ok) {
        setAvatar(newAvatarUrl);
        localStorage.setItem('avatar', newAvatarUrl);
        toast.success('Nuovo avatar generato!');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Errore durante aggiornamento');
      }
    } catch (err) {
      toast.error('Errore di rete');
    }
  };

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
        toast.success('Avatar personale caricato!');
      } else {
        toast.error(data.message || 'Errore durante upload avatar');
      }
    } catch (err) {
      toast.error('Errore di rete');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Profilo Utente</h1>

      <img
        src={avatar}
        alt="Avatar"
        style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '20px', border: '2px solid #00f0ff' }}
      />
      <h2 style={{ color: '#00f0ff' }}>{nickname}</h2>

      <div style={{ marginTop: '30px' }}>
        <input
          type="text"
          placeholder="Nuovo Nickname"
          value={newNickname}
          onChange={(e) => setNewNicknameInput(e.target.value)}
          style={{ padding: '8px', width: '250px', borderRadius: '8px' }}
        />
        <br /><br />
        <button onClick={handleNicknameChange} style={{ marginRight: '10px', padding: '10px 20px' }}>
          Aggiorna Nickname + Avatar
        </button>
        <button onClick={handleGenerateNewAvatar} style={{ padding: '10px 20px' }}>
          Solo Nuovo Avatar
        </button>
        <br /><br />

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button onClick={handleUploadAvatar} style={{ marginTop: '10px', padding: '10px 20px' }}>
          Carica Avatar Personale
        </button>
        <br /><br />
        <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
