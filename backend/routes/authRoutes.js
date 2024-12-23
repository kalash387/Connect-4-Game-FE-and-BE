// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/authMiddleware');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Update game route
router.post('/update-game', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const gameData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.lastGame = {
      gameStatus: gameData.gameStatus,
      score: gameData.score,
      difficulty: gameData.difficulty,
      moves: gameData.moves,
      duration: gameData.duration,
      playedAt: gameData.playedAt
    };

    await user.save();
    res.json({ success: true, lastGame: user.lastGame });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Error updating game data', error: error.message });
  }
});

// Get last game route
router.get('/last-game', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ lastGame: user.lastGame || null });
  } catch (error) {
    console.error('Error fetching last game:', error);
    res.status(500).json({ message: 'Error fetching game data', error: error.message });
  }
});

module.exports = router;
