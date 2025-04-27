import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from './db.js';
import User from './models/User.js';
import verifyToken from './middleware/auth.js';

const app = express();

// 🌐 CORS completo
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// 📦 Connessione al database
connectDB();

// 📍 API
app.get('/', (req, res) => {
  res.status(200).send('Chaos System backend online.');
});

app.post('/api/register', async (req, res) => {
  const { email, password, nickname, avatar } = req.body;
  if (!email || !password || !nickname || !avatar) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email già registrata' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, nickname, avatar });
    await newUser.save();
    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore interno', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenziali non valide' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Credenziali non valide' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, nickname: user.nickname, avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Errore interno', error: error.message });
  }
});

app.patch('/api/profile', verifyToken, async (req, res) => {
  const { nickname, avatar } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });

    user.nickname = nickname;
    user.avatar = avatar;
    await user.save();
    res.status(200).json({ message: 'Profilo aggiornato' });
  } catch (error) {
    res.status(500).json({ message: 'Errore interno', error: error.message });
  }
});

// 🛑 Esportazione compatibile con Vercel
export default app;
