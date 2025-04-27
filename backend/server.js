// 📦 Importazione dei moduli necessari
require('dotenv').config(); // Carica le variabili d'ambiente dal file .env
const express = require('express'); // Framework web per Node.js
const cors = require('cors'); // Middleware per abilitare CORS
const bcrypt = require('bcrypt'); // Libreria per l'hashing delle password
const jwt = require('jsonwebtoken'); // Libreria per la gestione dei token JWT
const multer = require('multer'); // Middleware per la gestione degli upload di file
const path = require('path'); // Modulo per la gestione dei percorsi dei file
const fs = require('fs'); // Modulo per la gestione del file system

// 📦 Importazione dei moduli personalizzati
const connectDB = require('./db'); // Funzione per la connessione al database
const User = require('./models/User'); // Modello Mongoose per l'utente
const verifyToken = require('./middleware/auth'); // Middleware per la verifica del token JWT

// 🚀 Creazione dell'app Express
const app = express();

// 🔧 Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 3000;

// 🌐 Configurazione delle opzioni CORS
const corsOptions = {
  origin: (origin, callback) => {
    // Lista dei domini autorizzati
    const allowedOrigins = [
      'https://chaos-sistemd20.vercel.app',
      'https://chaos-sistemd20.onrender.com'
    ];

    // Espressione regolare per consentire i domini temporanei di Vercel
    const vercelTemporaryPattern = /^https:\/\/chaos-sistemd20-[a-z0-9-]+\.vercel\.app$/;

    // Se l'origine è assente (es. Postman) o è tra quelle consentite, permetti la richiesta
    if (!origin || allowedOrigins.includes(origin) || vercelTemporaryPattern.test(origin)) {
      callback(null, true);
    } else {
      // Altrimenti, blocca la richiesta CORS
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Permette l'invio di cookie e credenziali
};

// 🛡️ Applicazione del middleware CORS
app.use(cors(corsOptions));

// 🧱 Middleware per il parsing del corpo delle richieste in formato JSON
app.use(express.json());

// 🖼️ Servire i file statici dalla cartella 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📁 Creazione della cartella 'uploads' se non esiste
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// 📤 Configurazione di Multer per la gestione degli upload di avatar
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_, file, cb) => {
    // Genera un nome univoco per il file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 📍 Rotta di base per verificare che il server sia attivo
app.get('/', (_, res) => {
  res.send('Chaos System backend online.');
});

// 📝 Rotta per la registrazione di un nuovo utente
app.post('/api/register', async (req, res) => {
  const { email, password, nickname, avatar } = req.body;
  const validator = require('validator');

  // Validazione dei campi obbligatori
  if (!email || !password || !nickname || !avatar) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  // Validazione del formato dell'email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email non valida' });
  }

  // Validazione della lunghezza della password
  if (password.length < 6 || password.length > 16) {
    return res.status(400).json({ message: 'La password deve contenere tra 6 e 16 caratteri' });
  }

  try {
    // Verifica se l'email è già registrata
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Hashing della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creazione di un nuovo utente
    const newUser = new User({ email, password: hashedPassword, nickname, avatar });

    // Salvataggio dell'utente nel database
    await newUser.save();
    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore interno', error: err.message });
  }
});

// 🔐 Rotta per il login dell'utente
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ricerca dell'utente nel database
    const user = await User.findOne({ email });

    // Se l'utente non esiste, restituisci un errore
    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    // Confronto della password fornita con quella salvata
    const isValid = await bcrypt.compare(password, user.password);

    // Se la password non è valida, restituisci un errore
    if (!isValid) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    // Generazione del token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Restituzione del token e delle informazioni dell'utente
    res.status(200).json({
      token,
      nickname: user.nickname,
      avatar: user.avatar
    });
  } catch (err) {
    res.status(500).json({ message: 'Errore interno', error: err.message });
  }
});

// ✏️ Rotta per aggiornare il profilo dell'utente (nickname e avatar)
app.patch('/api/profile', verifyToken, async (req, res) => {
  const { nickname, avatar } = req.body;

  // Validazione dei campi obbligatori
  if (!nickname || !avatar) {
    return res.status(400).json({ message: 'Nickname e avatar sono obbligatori' });
  }

  try {
    // Ricerca dell'utente nel database tramite l'ID ottenuto dal token
    const userId = req.user.userId;
    const user = await User.findById(userId);

    // Se l'utente non esiste, restituisci un errore
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Aggiornamento dei dati dell'utente
    user.nickname = nickname;
    user.avatar = avatar;
    await user.save();

    res.status(200).json({ message: 'Profilo aggiornato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore interno', error: err.message });
  }
});

// 📤 Rotta per l'upload dell'avatar da file
app.post('/api/profile/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  // Verifica che un file sia stato caricato
  if (!req.file) {
    return res.status(400).json({ message: 'Nessun file ricevuto' });
  }

  try {
    // Ricerca dell'utente nel database tramite l'ID ottenuto dal token
    const userId = req.user.userId;
    const user = await User.findById(userId);

    // Se l'utente non esiste, restituisci un errore
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Costruzione dell'URL dell'avatar
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Aggiornamento dell'avatar dell'utente
    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({ avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ message: 'Errore interno', error: err.message });
  }
});

// 🔌 Connessione al database
connectDB();

// 🚀 Avvio del server
app.listen(PORT, () => {
  console.log(`✅ Server attivo su porta ${PORT}`);
});
