require('dotenv').config({path: './.env'}); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
// const gameRoutes = require('./routes/gameRoutes'); // Uncomment this if you use game routes
console.log(process.env.PORT)
const app = express();
app.use(cors());

// Middleware
app.use(express.json());



// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017/connect4db",);
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process if the connection fails
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/game', gameRoutes); // Uncomment this if you use game routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
