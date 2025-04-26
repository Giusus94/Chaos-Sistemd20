import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [nickname, setNickname] = useState(localStorage.getItem('nickname'));
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar'));

  const login = (token, email) => {
    const generatedNickname = email.split('@')[0]; // esempio: giuseppe@xxx → nickname = giuseppe
    const generatedAvatar = `https://api.dicebear.com/6.x/initials/svg?seed=${generatedNickname}`; // avatar casuale
   
   
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('nickname', generatedNickname);
    localStorage.setItem('avatar', generatedAvatar);

    setToken(token);
    setEmail(email);
    setNickname(generatedNickname);
    setAvatar(generatedAvatar);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setEmail(null);
    setNickname(null);
    setAvatar(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, nickname, avatar, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};