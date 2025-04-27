require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const User = require('./models/User');
const verifyToken = require('./middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 🌐 CORS configurato manualmente
const allowedOrigins = [
  'https://chaos-sistemd20.vercel.app',
  'https://chaos-sistemd20.onrender.com'
];
const vercelPattern = /^https:\/\/chaos-sistemd20-[a-z0-9-]+\.vercel\.app$/;

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Rispondi immediatamente ai preflight OPTIONS
  }

  next();
});

// 📦 Middleware base
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📁 Cartella uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// 📤 Multer upload avatar
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 📍 Rotte API
app.get('/', (_, res) => {
  res.send('Chaos System backend online.');
});

app.post('/api/register', async (req, res) => {
  const { email, password, nickname, avatar } = req.body;
  const validator = require('validator');

  if (!email || !password || !nickname || !avatar) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email non valida' });
  }
  if (password.length < 6 || password.length > 16) {
    return res.status(400).json({ message: 'La password deve contenere tra 6 e 16 caratteri' });
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
  } catch (err) {
    res.status(500).json({ message: 'Errore interno', error: err.message });
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

    res.status(200).json({
      token,
      nickname: user.nickname,
      avatar: user.avatar
    });
  } catch (err) {
    res.status(500).json({ message: 'Errore interno', error: err.message });
  }
});

app.patch('/api/profile', verifyToken, async (req, res) => {
  const { nickname, avatar } = req.body;

  if (!nickname || !avatar) {
    return res.status(400).json({ message: 'Nickname e avatar sono obbligatori' });
  }

  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    user.nickname = nickname;
    user.avatar = avatar;
    await user.save();

    res.status(200).json({ message: 'Profilo aggiornato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore interno', error: err.message });
  }
});

app.post('/api/profile/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nessun file ricevuto' });
  }

  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({ avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ message: 'Errore interno', error: err.message });
  }
});

// 🔌 Connetti il DB e avvia il server
connectDB();
app.listen(PORT, () => {
  console.log(`✅ Server attivo sulla porta ${PORT}`);
});
