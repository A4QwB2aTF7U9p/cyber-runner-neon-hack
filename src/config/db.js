const { Pool } = require('pg');
require('dotenv').config();

// Creamos un Pool de conexiones utilizando la DATABASE_URL provista en el .env
// Si estamos en producción (Railway), solemos necesitar SSL habilitado.
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RAILWAY_ENVIRONMENT;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('✅ Conexión con PostgreSQL establecida con éxito.');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
});

// Función auxiliar para ejecutar consultas
const query = (text, params) => pool.query(text, params);

// Inicialización de la base de datos (creación automática de tablas si no existen)
async function initDatabase() {
  console.log('🔄 Inicializando base de datos...');
  try {
    // 1. Tabla de Usuarios
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        shards_balance INTEGER DEFAULT 0,
        active_skin VARCHAR(50) DEFAULT 'default',
        is_guest BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Tabla de Partidas
    await query(`
      CREATE TABLE IF NOT EXISTS runs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER NOT NULL,
        shards_collected INTEGER NOT NULL,
        distance_run INTEGER NOT NULL,
        death_reason VARCHAR(100) NOT NULL,
        duration_seconds INTEGER NOT NULL,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Tabla de Mejoras de Power-ups (RPG progression)
    await query(`
      CREATE TABLE IF NOT EXISTS user_upgrades (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        upgrade_type VARCHAR(50) NOT NULL,
        level INTEGER DEFAULT 1,
        PRIMARY KEY (user_id, upgrade_type)
      );
    `);

    // 4. Tabla de Aspectos Comprados (Skins)
    await query(`
      CREATE TABLE IF NOT EXISTS user_skins (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        skin_id VARCHAR(50) NOT NULL,
        PRIMARY KEY (user_id, skin_id)
      );
    `);

    console.log('🚀 Esquema de la base de datos verificado/creado con éxito.');
  } catch (error) {
    console.error('❌ Error inicializando el esquema de la base de datos:', error);
    // Nota: No paramos el servidor por si la DB aún no está conectada o configurada,
    // permitiendo al desarrollador configurar su .env correctamente.
  }
}

module.exports = {
  query,
  pool,
  initDatabase
};
