// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rutas
const routes = require('./routes');

const app = express();

// --- Middlewares ---

// Configuración de CORS mejorada para el ejecutable de Electron
app.use(cors({
    origin: '*', // Permite peticiones desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Permite leer JSON en el body de las peticiones
app.use(morgan('dev')); // Muestra logs en consola

// --- Rutas ---
app.use('/api', routes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada en las sombras de Valkrypt.' });
});

// Middleware de error global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo se rompió en el motor del juego.' });
});

module.exports = app;