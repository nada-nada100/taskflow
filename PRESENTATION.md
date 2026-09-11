# TaskFlow - Final Presentation

## What is TaskFlow?
TaskFlow is a full-stack task management application that helps users organize their tasks with categories, due dates, status tracking, and visual analytics.

## Tech Stack

### Backend
- Node.js - JavaScript runtime
- Express - Web framework
- SQLite3 - Lightweight database
- JWT - Authentication tokens
- bcryptjs - Password hashing

### Frontend
- HTML5 - Structure
- CSS3 - Styling (with dark mode)
- JavaScript (ES Modules) - Functionality
- Chart.js - Data visualization

### Deployment
- Render - Backend + Frontend hosting
- GitHub - Version control

## Features
- User Registration & Login with JWT
- Create, Read, Update, Delete tasks
- Filter by status and category
- Search tasks by keyword
- Dark mode toggle
- Dashboard with stats and charts
- Toast notifications
- Responsive design

## One Technical Challenge I Overcame

**The Challenge:** 
Deploying the app was difficult because the frontend couldn't connect to the backend.

**The Problem:**
- The API URL was hardcoded to `localhost:5000`
- When deployed, the frontend needed to use the Render backend URL
- Changing the URL broke local testing

**The Solution:**
I implemented auto-detection in `api.js`:

```javascript
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost
    ? 'http://localhost:5000/api'
    : 'https://taskflow-backend-z1uw.onrender.com/api';