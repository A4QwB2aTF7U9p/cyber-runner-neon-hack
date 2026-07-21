const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'cyber-runner-neon-hack-super-secret-key-2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // El token viene como "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    
    // Adjuntar la información del usuario desencriptada
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
