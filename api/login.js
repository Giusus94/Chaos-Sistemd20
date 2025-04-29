// frontend/src/api/login.js

const API_URL = process.env.REACT_APP_API_URL || "https://chaos-sistemd20.vercel.app/api";

export async function loginAPI(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
}
