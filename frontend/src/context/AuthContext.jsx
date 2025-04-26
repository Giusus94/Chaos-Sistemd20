import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (nickname) {
      localStorage.setItem('nickname', nickname);
    }
    if (avatar) {
      localStorage.setItem('avatar', avatar);
    }
  }, [token, nickname, avatar]);

  const logout = () => {
    setToken('');
    setNickname('');
    setAvatar('');
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    localStorage.removeItem('avatar');
  };

  return (
    <AuthContext.Provider value={{ token, setToken, nickname, setNickname, avatar, setAvatar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
