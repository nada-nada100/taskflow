// controllers/taskController.js - Task CRUD operations

const taskModel = require('../models/taskModel');
const { isValidTitle, sanitize } = require('../utils/validation');

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, category, dueDate } = req.body;
        const userId = req.userId;

        // Validate: Title is required
        if (!title || title.trim() === '') {
            return res.status(400).json({
                message: 'Task title is required'
            });
        }

        // Validate: Title is not too short
        const sanitizedTitle = sanitize(title);
        if (sanitizedTitle.length < 1) {
            return res.status(400).json({
                message: 'Task title cannot be empty'
            });
        }

        // Validate: Title is not too long (max 200 characters)
        if (sanitizedTitle.length > 200) {
            return res.status(400).json({
                message: 'Task title cannot exceed 200 characters'
            });
        }

        // Validate: Description max length (optional)
        const sanitizedDescription = description ? sanitize(description) : null;
        if (sanitizedDescription && sanitizedDescription.length > 500) {
            return res.status(400).json({
                message: 'Description cannot exceed 500 characters'
            });
        }

        // Create task
        const newTask = await taskModel.createTask(
            userId,
            sanitizedTitle,
            sanitizedDescription,
            category || null,
            dueDate || null
        );

        res.status(201).json({
            message: 'Task created successfully!',
            task: newTask
        });

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            message: 'Server error while creating task'
        });
    }
};

// Get all tasks for the logged-in user with filters
const getTasks = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Read filters from query string
        const { status, category, search } = req.query;
        
        // Build filters object
        const filters = {};
        if (status) filters.status = status;
        if (category) filters.category = category;
        if (search) filters.search = search;
        
        // Get tasks with filters
        const tasks = await taskModel.findAllByUser(userId, filters);

        res.json({
            message: 'Tasks fetched successfully!',
            count: tasks.length,
            filters: filters,
            tasks
        });

    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            message: 'Server error while fetching tasks'
        });
    }
};

// Get a specific task by ID
const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.userId;

        // Validate: Task ID is a number
        if (isNaN(taskId)) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        const task = await taskModel.findByIdAndUser(taskId, userId);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found or you do not have permission'
            });
        }

        res.json({
            message: 'Task fetched successfully!',
            task
        });

    } catch (error) {
        console.error('Get task by ID error:', error);
        res.status(500).json({
            message: 'Server error while fetching task'
        });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.userId;
        const { title, description, category, status, dueDate } = req.body;

        // Validate: Task ID is a number
        if (isNaN(taskId)) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        // Check if task exists and belongs to user
        const existingTask = await taskModel.findByIdAndUser(taskId, userId);
        if (!existingTask) {
            return res.status(404).json({
                message: 'Task not found or you do not have permission'
            });
        }

        // Validate: If title is provided, it cannot be empty
        if (title !== undefined && title.trim() === '') {
            return res.status(400).json({
                message: 'Task title cannot be empty'
            });
        }

        // Validate: Title max length
        if (title && title.trim().length > 200) {
            return res.status(400).json({
                message: 'Task title cannot exceed 200 characters'
            });
        }

        // Validate: Description max length
        if (description && description.length > 500) {
            return res.status(400).json({
                message: 'Description cannot exceed 500 characters'
            });
        }

        // Update task
        const result = await taskModel.updateTask(taskId, userId, {
            title: title?.trim(),
            description,
            category,
            status,
            dueDate
        });

        if (result.changes === 0) {
            return res.status(400).json({
                message: 'No changes were made to the task'
            });
        }

        // Get updated task
        const updatedTask = await taskModel.findByIdAndUser(taskId, userId);

        res.json({
            message: 'Task updated successfully!',
            task: updatedTask
        });

    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            message: 'Server error while updating task'
        });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.userId;

        // Validate: Task ID is a number
        if (isNaN(taskId)) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        // Check if task exists and belongs to user
        const existingTask = await taskModel.findByIdAndUser(taskId, userId);
        if (!existingTask) {
            return res.status(404).json({
                message: 'Task not found or you do not have permission'
            });
        }

        // Delete task
        const result = await taskModel.deleteTask(taskId, userId);

        res.json({
            message: 'Task deleted successfully!',
            deleted: result.deleted > 0
        });

    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            message: 'Server error while deleting task'
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};