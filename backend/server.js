require('dotenv').config();
const connectDB = require('./db');
const User = require('./models/User');
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

// --- REGISTRAZIONE ---
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email già registrata' });
      }
  
      const newUser = new User({ email, password });
      await newUser.save();
      res.status(201).json({ message: 'Utente registrato con successo' });
    } catch (err) {
      res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  });
  
  // --- LOGIN ---
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Credenziali non valide' });
      }
  
      res.status(200).json({ token: 'accesso-ok', email: user.email });
    } catch (err) {
      res.status(500).json({ message: 'Errore interno', error: err.message });
    }
  });
  
connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server attivo su porta ${PORT}`);
});
