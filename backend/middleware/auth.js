// middleware/auth.js

const jwt = require('jsonwebtoken');

// Middleware per verificare il token JWT
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Header di autorizzazione

  if (!authHeader) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  // Estrai il token dal formato "Bearer <token>"
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato token non valido' });
  }

  const token = tokenParts[1];

  try {
    // Verifica il token con la chiave segreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attacca i dati decodificati alla richiesta
    next(); // Continua al prossimo middleware o controller
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido' });
  }
};
