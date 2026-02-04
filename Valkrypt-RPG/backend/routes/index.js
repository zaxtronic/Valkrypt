const express = require('express');
const router = express.Router();

// 1. Importar las rutas (Asegúrate de importar las de auth)
const authRoutes = require('./authRoutes');
const gameRoutes = require('./gameRoutes');
const combatRoutes = require('./combatRoutes');

// 2. Usar las rutas
router.use('/auth', authRoutes); 
router.use('/game', gameRoutes);
router.use('/combat', combatRoutes);

module.exports = router;