import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, removeToken } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#222', color: 'white' }}>
        <img 
        src="/assets/logo-chaos.svg" 
        alt="Chaos System Arkadia2099 Logo" 
        style={{ width: '300px', height: '60px', margin: '20px auto', display: 'block' }} 
      />
      <Link to="/">Home</Link>{" "}
      {isLoggedIn() ? (
        <>
          <Link to="/profile">Profilo</Link>{" "}
          <Link to="/classes">Classi</Link>{" "}
          <Link to="/factions">Fazioni</Link>{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Registrati</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
