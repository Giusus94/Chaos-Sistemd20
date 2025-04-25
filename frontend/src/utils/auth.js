// utils/auth.js

export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const res = await fetch('https://chaos-sistemd20.onrender.com/api/profilo', {
      headers: {
        Authorization: `Bearer ${token}`
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
