const express = require('express');
const cors = require('cors');
const app = express();

// Use Render's port or 5000 for local
const port = process.env.PORT || 5000;

// Import database
require('./config/db');

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'Hello from TaskFlow! 🚀',
        status: 'Server is running!',
        database: 'Connected to SQLite',
        endpoints: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            profile: 'GET /api/users/profile (Protected)',
            stats: 'GET /api/stats/summary (Protected)',
            tasks: {
                create: 'POST /api/tasks (Protected)',
                getAll: 'GET /api/tasks (Protected)',
                getOne: 'GET /api/tasks/:id (Protected)',
                update: 'PUT /api/tasks/:id (Protected)',
                delete: 'DELETE /api/tasks/:id (Protected)'
            }
        }
    });
});

app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});