# 📋 TaskFlow - Task Management App

A full-stack task management application with user authentication, task CRUD operations, filtering, search, and data visualization.

## 🚀 Live Demo

[Add your deployed URL here when done]

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **SQLite3** - Lightweight database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (with dark mode)
- **JavaScript (ES Modules)** - Functionality
- **Chart.js** - Data visualization

## ✨ Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Create, Read, Update, Delete Tasks
- ✅ Filter by Status (Todo, In Progress, Completed)
- ✅ Filter by Category
- ✅ Search Tasks
- ✅ Dark Mode
- ✅ Dashboard with Stats Cards
- ✅ Chart.js Visualization
- ✅ Toast Notifications
- ✅ Responsive Design

## 📁 Project Structure
taskflow/
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ └── taskController.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── models/
│ │ ├── userModel.js
│ │ └── taskModel.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── taskRoutes.js
│ │ └── statsRoutes.js
│ ├── utils/
│ │ └── validation.js
│ ├── server.js
│ └── package.json
└── frontend/
├── css/
│ └── style.css
├── js/
│ ├── api.js
│ ├── auth.js
│ ├── tasks.js
│ ├── toast.js
│ └── dark-mode.js
├── login.html
├── register.html
└── dashboard.html

text

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/nada-nada100/taskflow.git
cd taskflow