// API Route: Register

export async function registerAPI(credentials) {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  }
  