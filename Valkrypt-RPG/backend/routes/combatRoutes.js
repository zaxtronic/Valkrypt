const express = require('express');
const router = express.Router();
const CombatController = require('../controllers/CombatController');

router.post('/start', CombatController.startCombat);
router.post('/action', CombatController.processAction);

module.exports = router;