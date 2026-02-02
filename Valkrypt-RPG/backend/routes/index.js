const express = require('express');
const router = express.Router();

const gameRoutes = require('./gameRoutes');
const combatRoutes = require('./combatRoutes'); // <-- NUEVO

router.use('/game', gameRoutes);
router.use('/combat', combatRoutes); // <-- NUEVO

module.exports = router;