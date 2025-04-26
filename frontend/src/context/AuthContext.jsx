import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [nickname, setNickname] = useState(localStorage.getItem('nickname'));
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar'));

  const login = (token, email, nickname, avatar) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('avatar', avatar);
    setToken(token);
    setEmail(email);
    setNickname(nickname);
    setAvatar(avatar);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setEmail(null);
    setNickname(null);
    setAvatar(null);
  };

  // Nuova funzione per aggiornare nickname e avatar dinamicamente
  const updateProfile = (newNickname, newAvatar) => {
    localStorage.setItem('nickname', newNickname);
    localStorage.setItem('avatar', newAvatar);
    setNickname(newNickname);
    setAvatar(newAvatar);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, nickname, avatar, login, logout, updateProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
