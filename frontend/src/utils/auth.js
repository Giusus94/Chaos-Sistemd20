// src/utils/auth.js

// Salva il token JWT nel browser
export const saveToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Legge il token salvato
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Rimuove il token (logout)
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // Controlla se c’è un token valido
  export const isLoggedIn = () => {
    const token = getToken();
    return !!token; // true se esiste
  };
  export const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    try {
      const res = await fetch('https://chaos-sistemd20.onrender.com/api/profilo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error();
      return true;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      return false;
    }
  };
  