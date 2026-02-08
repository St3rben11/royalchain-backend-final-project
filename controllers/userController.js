const User = require('../models/User');
const Game = require('../models/Game');

/* ================= GET PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // VALIDATION
    if (username && username.length < 3) {
      return res.status(400).json({ message: 'Username too short' });
    }

    if (email) {
      const exists = await User.findOne({ email });
      if (exists && exists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }

    if (username) user.username = username;

    await user.save();

    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        tokens: user.tokens,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= USER STATS ================= */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('tokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const games = await Game.find({ userId });

    const totalGames = games.length;
    const wins = games.filter(g => g.result === 'win').length;
    const loses = games.filter(g => g.result === 'lose').length;

    const winRate =
      totalGames === 0
        ? 0
        : ((wins / totalGames) * 100).toFixed(2);

    res.json({
      totalGames,
      wins,
      loses,
      balance: user.tokens,
      winRate: winRate + '%'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= ADMIN BLOCK USER ================= */
exports.blockUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: 'User status updated',
      isBlocked: user.isBlocked
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};