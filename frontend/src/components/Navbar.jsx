import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, nickname, avatar, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success('Logout effettuato con successo!');
    navigate('/login');
  };

  return (
    <nav style={{
      padding: '10px',
      background: '#121212',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Logo + Link Home */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/assets/logo-chaos.svg"
          alt="Chaos System Arkadia2099 Logo"
          style={{ width: '200px', height: '40px', marginRight: '20px' }}
        />
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
          Home
        </Link>
      </div>

      {/* Parte destra: Avatar + Nickname o Login/Register */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
              <img
                src={avatar}
                alt="Avatar"
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
              />
              <span style={{ fontWeight: 'bold', color: '#FFD700' }}>{nickname}</span>
            </Link>
            <button onClick={handleLogout} style={{
              marginLeft: '15px',
              backgroundColor: '#8A2BE2',
              border: 'none',
              padding: '8px 12px',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '15px', color: '#00BFFF', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#00BFFF', textDecoration: 'none' }}>Registrati</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
