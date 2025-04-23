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
  