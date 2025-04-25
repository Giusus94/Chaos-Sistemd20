export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
};

export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const res = await fetch('https://chaos-sistemd20.onrender.com/api/profilo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();
    return true;
  } catch (err) {
    removeToken();
    return false;
  }
};
