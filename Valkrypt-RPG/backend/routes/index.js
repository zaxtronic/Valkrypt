const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const gameRoutes = require('./gameRoutes');
const combatRoutes = require('./combatRoutes');

// 2. Usar las rutas
router.use('/auth', authRoutes); 
router.use('/game', gameRoutes);
router.use('/auth', authRoutes);
router.use('/combat', combatRoutes);

module.exports = router;