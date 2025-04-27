// 📦 Importa Mongoose
const mongoose = require('mongoose');

// 🔥 Funzione per connettersi a MongoDB
const connectDB = async () => {
  try {
    // Tentativo di connessione usando la variabile d'ambiente MONGO_URI
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,    // Consente nuove analisi degli URL (evita warning)
      useUnifiedTopology: true, // Usa il nuovo motore di scoperta dei server MongoDB
    });

    console.log('✅ Connessione a MongoDB avvenuta con successo');
  } catch (error) {
    console.error('❌ Errore di connessione a MongoDB:', error.message);
    process.exit(1); // Termina il processo se fallisce la connessione
  }
};

// 📤 Esporta la funzione per poterla usare in server.js
module.exports = connectDB;
