import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/User/Profile';
import { AuthProvider } from './context/AuthContext'; // Questo NON serve qui se lo hai già in index.js

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Chaos System Arcadia2099 🌐 Homepage</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div>Pagina non trovata</div>} />
      </Routes>
    </>
  );
}

export default App;
