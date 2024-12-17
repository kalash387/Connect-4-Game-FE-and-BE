require('dotenv').config({path: '.env'}); // Load environment variables from .env file
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

// Update with your new username and password
const MONGODB_URI = "mongodb+srv://connect4admin:VBWQUhZAaBqC2ifL@connect-4-game.jt5fl.mongodb.net/connect4db?retryWrites=true&w=majority";

// Connect to MongoDB with additional options
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/game', gameRoutes); // Uncomment this if you use game routes

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
