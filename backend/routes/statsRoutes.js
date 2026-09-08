// routes/statsRoutes.js - Stats routes

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Get task statistics for logged-in user
router.get('/summary', protect, (req, res) => {
    const userId = req.userId;
    
    const query = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
            SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as inProgress,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
        FROM tasks
        WHERE user_id = ?
    `;
    
    db.get(query, [userId], (err, row) => {
        if (err) {
            console.error('Stats error:', err);
            return res.status(500).json({
                message: 'Error fetching stats'
            });
        }
        
        res.json({
            message: 'Stats fetched successfully!',
            stats: {
                total: row.total || 0,
                todo: row.todo || 0,
                inProgress: row.inProgress || 0,
                completed: row.completed || 0
            }
        });
    });
});

module.exports = router;