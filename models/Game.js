const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  gameType: {
    type: String,
    required: true
  },

  betAmount: {
    type: Number,
    required: true
  },

  winAmount: {
    type: Number,
    default: 0
  },

  // WIN / LOSE
  result: {
    type: String,
    enum: ['win', 'lose'],
    required: true
  },

  // HEADS / TAILS / NUMBER
  value: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);