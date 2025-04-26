import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, nickname, avatar, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="/assets/logo-chaos.svg" 
          alt="Chaos System Arkadia2099 Logo" 
          style={{ width: '300px', height: '60px', marginRight: '20px' }} 
        />
        <Link to="/" style={{ marginRight: '20px', color: '#61dafb' }}>Home</Link>
        {token && (
          <>
            <Link to="/profile" style={{ marginRight: '20px', color: '#61dafb' }}>Profilo</Link>
            <Link to="/classes" style={{ marginRight: '20px', color: '#61dafb' }}>Classi</Link>
            <Link to="/factions" style={{ marginRight: '20px', color: '#61dafb' }}>Fazioni</Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {token ? (
          <>
            {avatar && (
              <img src={avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
            )}
            <span style={{ marginRight: '10px', color: '#61dafb' }}>{nickname}</span>
            <button onClick={handleLogout} style={{ backgroundColor: '#007bff', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px', color: '#61dafb' }}>Login</Link>
            <Link to="/register" style={{ color: '#61dafb' }}>Registrati</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
