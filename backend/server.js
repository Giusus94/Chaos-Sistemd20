require('dotenv').config();
const connectDB = require('./db');
const User = require('./models/User');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const verifyToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware base
// --- CORS corretto ---
const allowedOrigins = [
  'https://chaos-sistemd20.vercel.app',
  'https://chaos-sistemd20-hcfgpj0xs-giuseppes-projects-282f0567.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (typeof origin === 'string' && origin.endsWith('.vercel.app'))) {
      return callback(null, true);
    }
    console.error(`CORS error: Origin ${origin} not allowed`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Crea cartella uploads se non esiste
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer per upload avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- ROTTE API BASE --- //
app.get('/', (req, res) => {
  res.send('Chaos System backend online.');
});

// --- REGISTRAZIONE --- //
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

// --- LOGIN --- //
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

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

// --- PATCH PROFILO (aggiorna nickname + avatar) --- //
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

// --- UPLOAD AVATAR da FILE --- //
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

// --- AVVIO SERVER --- //
connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server attivo su porta ${PORT}`);
});
