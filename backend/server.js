require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const User = require("./models/User");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const verifyToken = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS automatico ---
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Permetti strumenti tipo Postman

    const allowedOrigins = [
      "https://chaos-sistemd20.vercel.app",
      "https://chaos-sistemd20.onrender.com",
    ];
    const vercelTemporaryPattern =
      /^https:\/\/chaos-sistemd20-[a-z0-9-]+\.vercel\.app$/;

    if (!origin ||
      allowedOrigins.includes(origin) ||
      vercelTemporaryPattern.test(origin)
    ) {
      callback(null, true);
    } else {
      console.error(`CORS block: Origin ${origin} non consentito`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// --- Middlewares ---
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Creazione cartella uploads ---
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// --- Multer config ---
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// --- API ROUTES ---
// HOME
app.get("/", (_, res) => {
  res.send("Chaos System backend online.");
});

// REGISTER
app.post("/api/register", async (req, res) => {
  const { email, password, nickname, avatar } = req.body;
  const validator = require("validator");

  if (!email || !password || !nickname || !avatar) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Email non valida" });
  }

  if (password.length < 6 || password.length > 16) {
    return res
      .status(400)
      .json({ message: "La password deve contenere tra 6 e 16 caratteri" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email già registrata" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      nickname,
      avatar,
    });

    await newUser.save();
    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (err) {
    res.status(500).json({ message: "Errore interno", error: err.message });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Credenziali non valide" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Credenziali non valide" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ token, nickname: user.nickname, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: "Errore interno", error: err.message });
  }
});

// PATCH PROFILO
app.patch("/api/profile", verifyToken, async (req, res) => {
  const { nickname, avatar } = req.body;

  if (!nickname || !avatar) {
    return res
      .status(400)
      .json({ message: "Nickname e avatar sono obbligatori" });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "Utente non trovato" });

    user.nickname = nickname;
    user.avatar = avatar;
    await user.save();

    res.status(200).json({ message: "Profilo aggiornato con successo" });
  } catch (err) {
    res.status(500).json({ message: "Errore interno", error: err.message });
  }
});

// UPLOAD AVATAR DA FILE
app.post(
  "/api/profile/avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Nessun file ricevuto" });
    }

    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ message: "Utente non trovato" });

      const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      user.avatar = avatarUrl;
      await user.save();

      res.status(200).json({ avatar: avatarUrl });
    } catch (err) {
      res.status(500).json({ message: "Errore interno", error: err.message });
    }
  }
);

// AVVIO SERVER
connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server attivo su porta ${PORT}`);
});
