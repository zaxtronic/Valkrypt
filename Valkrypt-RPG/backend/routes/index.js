const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const gameRoutes = require('./gameRoutes');
const combatRoutes = require('./combatRoutes'); // <-- NUEVO

router.use('/game', gameRoutes);
router.use('/auth', authRoutes);
router.use('/combat', combatRoutes);

module.exports = router;