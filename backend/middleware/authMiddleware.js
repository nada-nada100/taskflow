// middleware/authMiddleware.js - Verify JWT tokens

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-super-secret-key-change-this-in-production';

// Middleware to protect routes
const protect = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Access denied. No token provided.'
        });
    }

    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user ID to request
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        
        // Continue to the next middleware/route handler
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token has expired. Please login again.'
            });
        }
        
        return res.status(403).json({
            error: 'Invalid token. Access denied.'
        });
    }
};

module.exports = { protect };