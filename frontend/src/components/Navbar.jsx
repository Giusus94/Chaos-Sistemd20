import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, nickname, avatar, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <nav style={{ padding: '10px', background: '#222', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <img 
        src="/assets/logo-chaos.svg" 
        alt="Chaos System Arkadia2099 Logo" 
        style={{ width: '200px', height: '40px', marginRight: '20px' }} 
      />
      <Link to="/">Home</Link>{" "}
      <Link to="/classes">Classi</Link>{" "}
      <Link to="/factions">Fazioni</Link>{" "}
    </div>
  
    <div>
      {isAuthenticated ? (
        <>
          <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{nickname}</span>
          </Link>{" "}
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Registrati</Link>
        </>
      )}
    </div>
  </nav>
  
  );
};

export default Navbar;
