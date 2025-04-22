import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav className='navbar'>
    <h2>Chaos System</h2>
    <div>
      <Link to='/'>Home</Link>
      <Link to='/classes'>Classi</Link>
      <Link to='/factions'>Fazioni</Link>
      <Link to='/character'>Personaggio</Link>
      <Link to='/marketplace'>Marketplace</Link>
      <Link to='/profile'>Profilo</Link>
      <Link to='/login'>Login</Link>
      <Link to='/register'>Register</Link>
    </div>
  </nav>
);

export default Navbar;
