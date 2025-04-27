const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token non valido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next(); // Passa al controller successivo
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido' });
  }
};
