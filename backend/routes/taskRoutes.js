// routes/taskRoutes.js - Task routes

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

// Apply authentication middleware to ALL routes in this file
router.use(protect);

// Task routes
router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;