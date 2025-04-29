// API Route: Profile update

export async function updateProfileAPI(profileData) {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    return res.json();
  }
  