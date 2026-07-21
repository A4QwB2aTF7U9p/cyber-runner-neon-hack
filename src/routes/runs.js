const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// 1. Guardar el resultado de una partida
router.post('/save', authenticateToken, async (req, res) => {
  const { score, shards_collected, distance_run, death_reason, duration_seconds } = req.body;
  const userId = req.user.id;

  // Validación básica de tipos
  if (
    score === undefined || 
    shards_collected === undefined || 
    distance_run === undefined || 
    !death_reason || 
    duration_seconds === undefined
  ) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios de la partida.' });
  }

  // 🛡️ Sistema Anti-Trampas Básico (Consistencia Física)
  if (duration_seconds < 1) {
    return res.status(400).json({ error: 'Duración de partida inválida.' });
  }

  const shardsPerSecond = shards_collected / duration_seconds;
  const scorePerSecond = score / duration_seconds;

  // Límites físicos del juego normal
  // Ningún jugador legítimo puede recoger más de 12 fragmentos por segundo sostenidamente,
  // ni puntuar más de 1000 puntos por segundo.
  if (shardsPerSecond > 15 || scorePerSecond > 1500) {
    console.warn(`🛡️ Intento de hack detectado para usuario ${userId}: shards/sec: ${shardsPerSecond}, score/sec: ${scorePerSecond}`);
    return res.status(400).json({ error: 'Actividad sospechosa detectada. Puntuación descartada.' });
  }

  try {
    // Iniciar transacción para asegurar que la partida se guarde y las monedas se sumen de forma segura
    await db.query('BEGIN');

    // Insertar la partida en 'runs'
    await db.query(
      `INSERT INTO runs (user_id, score, shards_collected, distance_run, death_reason, duration_seconds) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, score, shards_collected, distance_run, death_reason, duration_seconds]
    );

    // Sumar los fragmentos recolectados al balance del usuario en la tabla 'users'
    const userUpdateResult = await db.query(
      `UPDATE users 
       SET shards_balance = shards_balance + $1 
       WHERE id = $2 
       RETURNING shards_balance`,
      [shards_collected, userId]
    );

    const newBalance = userUpdateResult.rows[0].shards_balance;

    await db.query('COMMIT');

    res.status(201).json({
      message: 'Partida guardada y balance actualizado con éxito.',
      shards_balance: newBalance
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error al guardar partida:', error);
    res.status(500).json({ error: 'Error interno al registrar la partida.' });
  }
});

// 2. Obtener el historial de partidas del usuario logueado
router.get('/history', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT score, shards_collected, distance_run, death_reason, duration_seconds, played_at 
       FROM runs 
       WHERE user_id = $1 
       ORDER BY played_at DESC 
       LIMIT 10`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ error: 'Error al cargar el historial.' });
  }
});

// 3. Obtener el perfil extendido y estadísticas del jugador
router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Obtener datos de balance, skin activa y username
    const userResult = await db.query(
      'SELECT username, shards_balance, active_skin, is_guest, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    const user = userResult.rows[0];

    // 2. Obtener estadísticas de partidas (Puntaje Máximo, Total recorridos, Total partidas)
    const statsResult = await db.query(
      `SELECT 
        COALESCE(MAX(score), 0) AS high_score,
        COALESCE(SUM(distance_run), 0) AS total_distance,
        COALESCE(SUM(shards_collected), 0) AS total_shards_collected,
        COUNT(id) AS total_runs
       FROM runs 
       WHERE user_id = $1`,
      [userId]
    );
    const stats = statsResult.rows[0];

    // 3. Obtener niveles de mejoras de Power-ups
    const upgradesResult = await db.query(
      'SELECT upgrade_type, level FROM user_upgrades WHERE user_id = $1',
      [userId]
    );
    
    // Convertir la lista de mejoras en un objeto para un manejo más sencillo en el frontend
    const upgrades = { magnet: 1, shield: 1, multiplier: 1 };
    upgradesResult.rows.forEach(row => {
      upgrades[row.upgrade_type] = row.level;
    });

    res.json({
      username: user.username,
      shards_balance: user.shards_balance,
      active_skin: user.active_skin,
      is_guest: user.is_guest,
      created_at: user.created_at,
      stats: {
        high_score: parseInt(stats.high_score),
        total_distance: parseInt(stats.total_distance),
        total_shards_collected: parseInt(stats.total_shards_collected),
        total_runs: parseInt(stats.total_runs)
      },
      upgrades
    });

  } catch (error) {
    console.error('Error cargando perfil:', error);
    res.status(500).json({ error: 'Error al cargar estadísticas del perfil.' });
  }
});

module.exports = router;
