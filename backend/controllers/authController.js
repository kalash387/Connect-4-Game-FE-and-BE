// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register user controller
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const user = await User.create({
            username,
            password
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'test123',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            _id: user._id,
            username: user.username,
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login user controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '30d' }
        );

        res.json({
            _id: user._id,
            username: user.username,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};