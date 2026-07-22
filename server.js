const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/db');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const runsRoutes = require('./src/routes/runs');

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/runs', runsRoutes);

// Ruta de test básica
app.get('/', (req, res) => {
  res.send('Cyber-Runner API en funcionamiento.');
});

// Iniciar servidor e inicializar DB
async function startServer() {
  try {
    // Inicializar tablas de la BD si no existen
    await db.initDatabase();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor ejecutándose en http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

startServer();
