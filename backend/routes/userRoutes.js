// routes/userRoutes.js - Protected user routes

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Protected test route
router.get('/profile', protect, (req, res) => {
    res.json({
        message: 'This is a protected route!',
        userId: req.userId,
        userEmail: req.userEmail,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;