const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastGame: {
    gameStatus: { type: String, enum: ['win', 'loss', 'draw', 'in_progress'] },
    score: {
      player: { type: Number, default: 0 },
      bot: { type: Number, default: 0 }
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    moves: { type: Number },
    duration: { type: Number }, // in seconds
    playedAt: { type: Date, default: Date.now }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;