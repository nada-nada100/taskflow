// controllers/authController.js - Registration and Login logic

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { isValidEmail, isValidPassword, sanitize } = require('../utils/validation');

// Secret key for JWT
const JWT_SECRET = 'your-super-secret-key-change-this-in-production';

// Register function
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate: Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide name, email and password'
            });
        }

        // Validate: Name is not empty
        const sanitizedName = sanitize(name);
        if (sanitizedName.length === 0) {
            return res.status(400).json({
                message: 'Name cannot be empty'
            });
        }

        // Validate: Email format
        const sanitizedEmail = sanitize(email);
        if (!isValidEmail(sanitizedEmail)) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        // Validate: Password strength
        if (!isValidPassword(password)) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Validate: Check if user already exists
        const existingUser = await userModel.findUserByEmail(sanitizedEmail);
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await userModel.createUser(sanitizedName, sanitizedEmail, hashedPassword);

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Server error during registration'
        });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate: Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password'
            });
        }

        // Validate: Email format
        const sanitizedEmail = sanitize(email);
        if (!isValidEmail(sanitizedEmail)) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        // Validate: Password strength
        if (!isValidPassword(password)) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Find user by email
        const user = await userModel.findUserByEmail(sanitizedEmail);
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login'
        });
    }
};

module.exports = {
    register,
    login
};