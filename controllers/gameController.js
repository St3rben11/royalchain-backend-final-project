const User = require('../models/User');
const Game = require('../models/Game');

/* ================= COIN FLIP ================= */
exports.coinFlip = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bet, choice } = req.body;

    const betAmount = Number(bet);
    if (!betAmount || betAmount <= 0) {
      return res.status(400).json({ message: 'Invalid bet' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.tokens < betAmount) {
      return res.status(400).json({ message: 'Not enough tokens' });
    }

    /* ===== GAME LOGIC ===== */

    const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
    const win = coinResult === choice;
    const multiplier = win ? 2 : 0;

    const winAmount = win ? betAmount : -betAmount;

    user.tokens += winAmount;
    user.gamesPlayed += 1;
    await user.save();

    /* ===== SAVE GAME ===== */

    await Game.create({
      userId,
      gameType: 'coinflip',
      betAmount,
      winAmount: win ? betAmount * 2 : 0,
      result: win ? 'win' : 'lose', // ← ВОТ ГЛАВНОЕ
      value: coinResult,            // ← HEADS / TAILS СЮДА
      createdAt: new Date()
    });

    res.json({
      result: coinResult,
      win,
      multiplier,
      winAmount,
      balance: user.tokens
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
/* ================= ROULETTE ================= */
exports.roulette = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bet, type, value } = req.body;

    const betAmount = Number(bet);
    if (!betAmount || betAmount <= 0) {
      return res.status(400).json({ message: 'Invalid bet' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.tokens < betAmount) {
      return res.status(400).json({ message: 'Not enough tokens' });
    }

    const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const blackNumbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];

    const number = Math.floor(Math.random() * 37);

    let color = 'green';
    if (redNumbers.includes(number)) color = 'red';
    if (blackNumbers.includes(number)) color = 'black';

    let win = false;
    let multiplier = 0;

    switch (type) {
      case 'number':
        if (Number(value) === number) {
          win = true;
          multiplier = 35;
        }
        break;

      case 'color':
        if (value === color && number !== 0) {
          win = true;
          multiplier = 2;
        }
        break;

      case 'evenOdd':
        if (number !== 0) {
          if (value === 'even' && number % 2 === 0) win = true;
          if (value === 'odd' && number % 2 !== 0) win = true;
          if (win) multiplier = 2;
        }
        break;

      case 'highLow':
        if (number !== 0) {
          if (value === 'high' && number >= 19) win = true;
          if (value === 'low' && number <= 18) win = true;
          if (win) multiplier = 2;
        }
        break;

      default:
        return res.status(400).json({ message: 'Invalid bet type' });
    }

    const winAmount = win ? betAmount * multiplier : -betAmount;

    user.tokens += winAmount;
    user.gamesPlayed += 1;
    await user.save();

    await Game.create({
      userId,
      gameType: 'roulette',
      betAmount,
      winAmount,
      result: win ? 'win' : 'lose',
      createdAt: new Date()
    });

    res.json({
      number,
      color,
      win,
      multiplier,
      winAmount,
      balance: user.tokens
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= GAME CRUD ================= */

exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });

    game.result = req.body.result || game.result;
    await game.save();

    res.json(game);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyGames = async (req, res) => {
  try {
    const games = await Game.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(games);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};