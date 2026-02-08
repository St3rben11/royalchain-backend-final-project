const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },

    email: {
      type: String,
      required: true,
      unique: true,      // создаёт индекс автоматически
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // не возвращается по умолчанию
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    tokens: {
      type: Number,
      default: 1000,
      min: 0
    },

    walletAddress: {
      type: String,
      default: ''
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    gamesPlayed: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true // createdAt + updatedAt автоматически
  }
);

/* ================= SAFE JSON ================= */
// чтобы пароль никогда не уходил в res.json
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);