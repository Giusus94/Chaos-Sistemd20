// 📦 Importa mongoose
const mongoose = require('mongoose');

// 🛠️ Definisci il modello/schema dell'utente
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,       // L'email è obbligatoria
    unique: true,         // Nessun duplicato di email consentito
    lowercase: true,      // Converti automaticamente in minuscolo
    trim: true            // Rimuovi spazi bianchi prima/dopo
  },
  password: {
    type: String,
    required: true,       // La password è obbligatoria
    minlength: 6,         // Almeno 6 caratteri
    maxlength: 16         // Massimo 16 caratteri
  },
  nickname: {
    type: String,
    required: true,       // Nickname obbligatorio
    minlength: 3,         // Minimo 3 caratteri
    maxlength: 30,        // Massimo 30 caratteri
    trim: true
  },
  avatar: {
    type: String,
    required: true,       // Avatar URL obbligatorio
  }
}, { timestamps: true }); // Aggiunge automaticamente createdAt e updatedAt

// 📤 Esporta il modello User
module.exports = mongoose.model('User', UserSchema);
