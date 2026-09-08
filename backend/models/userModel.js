// models/userModel.js - Database operations for users

const db = require('../config/db');

// Create a new user
const createUser = (name, email, hashedPassword) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;
        db.run(query, [name, email, hashedPassword], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, name, email });
            }
        });
    });
};

// Find user by email
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        db.get(query, [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// Find user by ID
const findUserById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT id, name, email, created_at FROM users WHERE id = ?`;
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};