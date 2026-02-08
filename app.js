require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();

/* ================= DB ================= */
connectDB();

/* ================= MIDDLEWARE ================= */

// CORS
app.use(cors());

// JSON parser + лимит
app.use(express.json({ limit: '1mb' }));

/* ================= ROUTES ================= */

// AUTH
app.use('/api/auth', authRoutes);

// USERS
app.use('/api/users', userRoutes);

// GAMES
app.use('/api/games', gameRoutes);

/* ================= HEALTH CHECK ================= */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Casino API running'
  });
});

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;