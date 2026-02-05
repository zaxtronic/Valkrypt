const express = require('express');
const router = express.Router();

<<<<<<< HEAD
=======
// 1. Importar las rutas (Asegúrate de importar las de auth)
>>>>>>> 4a64156f464224e851556985ac770b42376f4415
const authRoutes = require('./authRoutes');
const gameRoutes = require('./gameRoutes');
const combatRoutes = require('./combatRoutes');

// 2. Usar las rutas
router.use('/auth', authRoutes); 
router.use('/game', gameRoutes);
<<<<<<< HEAD
router.use('/auth', authRoutes);
=======
>>>>>>> 4a64156f464224e851556985ac770b42376f4415
router.use('/combat', combatRoutes);

module.exports = router;