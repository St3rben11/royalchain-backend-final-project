const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const userController = require('../controllers/userController');

/* ================= PROFILE ================= */

// GET /api/users/profile
router.get('/profile', auth, userController.getProfile);

// PUT /api/users/profile
router.put('/profile', auth, userController.updateProfile);

/* ================= STATS ================= */

// GET /api/users/stats
router.get('/stats', auth, userController.getStats);

/* ================= ADMIN ONLY ================= */

// PUT /api/users/admin/block/:id
router.put('/admin/block/:id', auth, roles('admin'), userController.blockUser);

module.exports = router;