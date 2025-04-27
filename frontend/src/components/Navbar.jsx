import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();

  // Recupera i dati dal localStorage
  const token = localStorage.getItem('token');
  const nickname = localStorage.getItem('nickname');
  const avatar = localStorage.getItem('avatar');

  // Funzione per logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    localStorage.removeItem('avatar');
    toast.success('Logout effettuato con successo.');
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#111',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px'
    }}>
      
      {/* Logo principale */}
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '22px' }}>
          Chaos System Arkadia2099
        </Link>
      </div>

      {/* Sezioni navigazione */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {!token ? (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Registrati</Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
              {/* Mostra avatar + nickname */}
              {avatar && (
                <img src={avatar} alt="Avatar" style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '10px',
                  verticalAlign: 'middle'
                }} />
              )}
              <span>{nickname}</span>
            </Link>
            <button onClick={handleLogout} style={{
              backgroundColor: '#e63946',
              border: 'none',
              padding: '8px 12px',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '5px'
            }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
