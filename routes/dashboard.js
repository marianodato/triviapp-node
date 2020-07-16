const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games_controller');

router.get('/', gamesController.getDashboard);

module.exports = router;