const express = require('express');
const router = express.Router();
const GameController = require('../controllers/GameController');

router.get('/status', GameController.getStatus);
router.post('/start', GameController.startCampaign);
router.post('/choice', GameController.makeChoice);

module.exports = router;