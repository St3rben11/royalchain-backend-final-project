const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

/* ================= GAMES ================= */

// POST /api/games/coinflip
router.post('/coinflip', auth, gameController.coinFlip);

// POST /api/games/roulette
router.post('/roulette', auth, gameController.roulette);

/* ================= USER GAMES ================= */

// GET /api/games
router.get('/', auth, gameController.getMyGames);

/* ================= SINGLE GAME ================= */

// GET /api/games/:id
router.get('/:id', auth, gameController.getGameById);

// PUT /api/games/:id
router.put('/:id', auth, gameController.updateGame);

/* ================= ADMIN ONLY ================= */

// DELETE /api/games/:id
router.delete('/:id', auth, roles('admin'), gameController.deleteGame);

module.exports = router;