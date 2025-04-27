import React, { createContext, useState, useEffect } from 'react';

// 1. Creiamo il Context
export const AuthContext = createContext();

// 2. Creiamo il Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 3. Carichiamo i dati salvati al caricamento della pagina
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedNickname = localStorage.getItem('nickname');
    const storedAvatar = localStorage.getItem('avatar');

    if (storedToken && storedNickname && storedAvatar) {
      setUser({
        token: storedToken,
        nickname: storedNickname,
        avatar: storedAvatar,
      });
    }
  }, []);

  // 4. Login - salva nel context + localStorage
  const login = (token, nickname, avatar) => {
    localStorage.setItem('token', token);
    localStorage.setItem('nickname', nickname);
    localStorage.setItem('avatar', avatar);

    setUser({ token, nickname, avatar });
  };

  // 5. Logout - cancella tutto
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    localStorage.removeItem('avatar');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
