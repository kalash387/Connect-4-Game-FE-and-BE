// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { updateGame, getLastGame } = require('../controllers/gameController');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Game routes
router.post('/update-game', auth, updateGame);
router.get('/last-game', auth, getLastGame);

module.exports = router;
