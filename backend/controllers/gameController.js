const User = require('../models/User');

// Update game controller
const updateGame = async (req, res) => {
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
};

// Get last game controller
const getLastGame = async (req, res) => {
    try {
        console.log(req);
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
};

module.exports = { updateGame, getLastGame };
