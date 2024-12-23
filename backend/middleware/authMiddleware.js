const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, "test123"); // Use the same secret as in authController
        
        if (!decoded.id) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        // Add user id to request
        req.user = { id: decoded.id };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token is not valid', error: error.message });
    }
};

module.exports = { auth };
