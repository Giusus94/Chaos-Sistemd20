import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logout effettuato!');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '20px' }}>
        Chaos System
      </Link>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user?.token ? (
          <>
            <Link to="/profile" style={{ color: 'white', marginRight: '10px', textDecoration: 'none' }}>
              {user.nickname}
            </Link>
            {user.avatar && (
              <img
                src={user.avatar}
                alt="Avatar"
                onClick={() => navigate('/profile')}
                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', cursor: 'pointer' }}
              />
            )}
            <button onClick={handleLogout} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '10px', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Registrati
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
