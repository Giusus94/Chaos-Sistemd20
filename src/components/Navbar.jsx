// Navbar Component - React

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#222', color: 'white' }}>
      <Link to="/">Home</Link>{" "}
      {user ? (
        <>
          <Link to="/profile">Profilo</Link>{" "}
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
