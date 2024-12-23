// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { updateGame, getLastGame } = require('../controllers/gameController');
const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Game routes
router.post('/update-game', updateGame);
router.get('/last-game', getLastGame);

module.exports = router;
