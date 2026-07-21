const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'cyber-runner-neon-hack-super-secret-key-2026';

// Generar Token JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, is_guest: user.is_guest },
    JWT_SECRET,
    { expiresIn: '30d' } // Expira en 30 días para no forzar re-logueos constantes en móvil
  );
}

// Inicializar mejoras y aspecto por defecto para un nuevo usuario
async function initializeUserData(userId) {
  try {
    // Agregar aspecto por defecto a user_skins
    await db.query(
      'INSERT INTO user_skins (user_id, skin_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, 'default']
    );

    // Inicializar los tres powerups principales a nivel 1
    const powerups = ['magnet', 'shield', 'multiplier'];
    for (const powerup of powerups) {
      await db.query(
        'INSERT INTO user_upgrades (user_id, upgrade_type, level) VALUES ($1, $2, 1) ON CONFLICT DO NOTHING',
        [userId, powerup]
      );
    }
  } catch (error) {
    console.error(`Error inicializando datos para usuario ${userId}:`, error);
  }
}

// 1. Registro de Usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
  }

  const cleanUsername = username.trim();
  if (cleanUsername.length < 3 || cleanUsername.length > 20) {
    return res.status(400).json({ error: 'El nombre de usuario debe tener entre 3 y 20 caracteres.' });
  }

  try {
    // Verificar si el usuario ya existe
    const userCheck = await db.query('SELECT id FROM users WHERE username = $1', [cleanUsername]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado.' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insertar usuario
    const result = await db.query(
      'INSERT INTO users (username, password_hash, is_guest) VALUES ($1, $2, false) RETURNING id, username, shards_balance, active_skin',
      [cleanUsername, passwordHash]
    );

    const newUser = result.rows[0];

    // Inicializar datos del jugador
    await initializeUserData(newUser.id);

    const token = generateToken(newUser);

    res.status(201).json({
      message: '¡Registro exitoso!',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        shards_balance: newUser.shards_balance,
        active_skin: newUser.active_skin,
        is_guest: false
      }
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// 2. Inicio de Sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
  }

  try {
    // Buscar usuario
    const result = await db.query(
      'SELECT id, username, password_hash, shards_balance, active_skin, is_guest FROM users WHERE username = $1',
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const user = result.rows[0];

    // Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = generateToken(user);

    res.json({
      message: '¡Sesión iniciada correctamente!',
      token,
      user: {
        id: user.id,
        username: user.username,
        shards_balance: user.shards_balance,
        active_skin: user.active_skin,
        is_guest: user.is_guest
      }
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// 3. Crear Cuenta de Invitado (Rápido y sin fricción)
router.post('/guest', async (req, res) => {
  try {
    // Generar un nombre único de invitado
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const guestUsername = `Guest_Hack_${randomNum}`;

    // Contraseña ficticia para invitados (nunca la necesitarán ya que usan JWT, pero la base de datos la requiere)
    const randomPassword = Math.random().toString(36).substring(2, 12);
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(randomPassword, salt);

    // Insertar invitado
    const result = await db.query(
      'INSERT INTO users (username, password_hash, is_guest) VALUES ($1, $2, true) RETURNING id, username, shards_balance, active_skin',
      [guestUsername, passwordHash]
    );

    const guestUser = result.rows[0];

    // Inicializar datos del jugador
    await initializeUserData(guestUser.id);

    const token = generateToken(guestUser);

    res.status(201).json({
      message: 'Invitado creado correctamente.',
      token,
      user: {
        id: guestUser.id,
        username: guestUser.username,
        shards_balance: guestUser.shards_balance,
        active_skin: guestUser.active_skin,
        is_guest: true
      }
    });

  } catch (error) {
    console.error('Error creando invitado:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
