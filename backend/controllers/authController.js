// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("From server")
  console.log(req.body)
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.log("New user")
    const user = await User.create({ username, password });
    console.log(user)

    const token = jwt.sign({ id: user._id }, "test123", { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  }
};


const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, "test123", { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };