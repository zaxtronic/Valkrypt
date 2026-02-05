// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rutas
const routes = require('./routes');

const app = express();

// --- Middlewares ---
app.use(cors()); // Permite peticiones del frontend
app.use(express.json()); // Permite leer JSON en el body de las peticiones
app.use(morgan('dev')); // Muestra logs en consola (ej: "GET /api/game 200")

// --- Rutas ---
app.use('/api', routes);

// Manejo de errores 404 (Ruta no encontrada)
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada en las sombras de Valkrypt.' });
});

module.exports = app;