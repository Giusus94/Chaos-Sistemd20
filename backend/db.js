// backend/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connessione a MongoDB riuscita');
  } catch (err) {
    console.error('❌ Connessione a MongoDB fallita:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
