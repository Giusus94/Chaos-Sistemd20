const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- ROTTE API BASE --- //
app.get('/', (req, res) => {
  res.send('Chaos System backend online.');
});

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  // Qui in futuro potrai salvare nel database
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password obbligatorie' });
  }
  // Simula successo
  return res.status(200).json({ message: 'Registrazione riuscita!' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Simula un login valido
  if (email === 'admin@example.com' && password === '123456') {
    return res.status(200).json({ token: 'fake-jwt-token' });
  }
  return res.status(401).json({ message: 'Credenziali non valide' });
});

app.listen(PORT, () => {
  console.log(`✅ Server attivo su porta ${PORT}`);
});
