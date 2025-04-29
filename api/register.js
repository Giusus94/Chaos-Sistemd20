// frontend/src/api/profile.js

const API_URL = process.env.REACT_APP_API_URL || "https://chaos-sistemd20.vercel.app/api";

export async function updateProfileAPI(data, token) {
  const res = await fetch(`${API_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function uploadAvatarAPI(file, token) {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await fetch(`${API_URL}/profile/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return res.json();
}
