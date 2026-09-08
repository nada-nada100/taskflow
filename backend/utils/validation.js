// utils/validation.js - Validation helpers

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password strength (min 6 characters)
const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// Validate task title (not empty)
const isValidTitle = (title) => {
    return title && title.trim().length > 0;
};

// Sanitize input (trim whitespace)
const sanitize = (input) => {
    return input ? input.trim() : '';
};

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidTitle,
    sanitize
};