// models/taskModel.js - Database operations for tasks

const db = require('../config/db');

// Create a new task
const createTask = (userId, title, description, category, dueDate) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO tasks (user_id, title, description, category, due_date)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.run(query, [userId, title, description, category, dueDate], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, user_id: userId, title, description, category, dueDate });
            }
        });
    });
};

// Get all tasks for a specific user with optional filters
const findAllByUser = (userId, filters = {}) => {
    return new Promise((resolve, reject) => {
        // Start with base query
        let query = `
            SELECT id, user_id, title, description, category, status, due_date, created_at
            FROM tasks
            WHERE user_id = ?
        `;
        
        // Array to hold parameter values
        const params = [userId];
        
        // Build dynamic filters
        if (filters.status) {
            query += ` AND status = ?`;
            params.push(filters.status);
        }
        
        if (filters.category) {
            query += ` AND category = ?`;
            params.push(filters.category);
        }
        
        if (filters.search) {
            query += ` AND title LIKE ?`;
            params.push(`%${filters.search}%`);
        }
        
        // Order by creation date (newest first)
        query += ` ORDER BY created_at DESC`;
        
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Get a single task by ID (and verify it belongs to the user)
const findByIdAndUser = (taskId, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT id, user_id, title, description, category, status, due_date, created_at
            FROM tasks
            WHERE id = ? AND user_id = ?
        `;
        db.get(query, [taskId, userId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// Update a task
const updateTask = (taskId, userId, updates) => {
    return new Promise((resolve, reject) => {
        const { title, description, category, status, dueDate } = updates;
        const query = `
            UPDATE tasks
            SET title = COALESCE(?, title),
                description = COALESCE(?, description),
                category = COALESCE(?, category),
                status = COALESCE(?, status),
                due_date = COALESCE(?, due_date)
            WHERE id = ? AND user_id = ?
        `;
        db.run(query, [title, description, category, status, dueDate, taskId, userId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
};

// Delete a task
const deleteTask = (taskId, userId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM tasks WHERE id = ? AND user_id = ?`;
        db.run(query, [taskId, userId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ deleted: this.changes });
            }
        });
    });
};

module.exports = {
    createTask,
    findAllByUser,
    findByIdAndUser,
    updateTask,
    deleteTask
};