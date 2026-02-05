const express = require('express');
const router = express.Router();
const GameController = require('../controllers/GameController');

// Rutas base que ya tenías
router.get('/status', GameController.getStatus);
router.post('/start', GameController.startCampaign);
router.post('/choice', GameController.makeChoice);

// Rutas de Persistencia (Híbridas/Offline)
// He usado los nombres de función exactos que pusimos en el GameController anterior
router.get('/offline-load', GameController.loadOfflineProgress); 
router.post('/offline-save', GameController.saveOfflineProgress);

module.exports = router;