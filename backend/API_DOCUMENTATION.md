# TaskFlow API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token. Include it in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🔐 Auth Endpoints

### Register a New User
**POST** `/auth/register`

**Required Fields:**
- `name` (string) - User's full name
- `email` (string) - Valid email address
- `password` (string) - Minimum 6 characters

**Example Request:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Successful Response (201 Created):**
```json
{
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

**Error Responses:**
- `400` - Missing fields, invalid email, weak password
- `400` - User already exists with this email
- `500` - Server error

---

### Login User
**POST** `/auth/login`

**Required Fields:**
- `email` (string) - Registered email
- `password` (string) - User's password

**Example Request:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Successful Response (200 OK):**
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

**Error Responses:**
- `400` - Missing email or password
- `400` - Invalid email format
- `401` - Invalid email or password
- `500` - Server error

---

## 👤 User Endpoints

### Get User Profile
**GET** `/users/profile`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Successful Response (200 OK):**
```json
{
    "message": "This is a protected route!",
    "userId": 1,
    "userEmail": "john@example.com",
    "timestamp": "2026-09-03T10:42:14.383Z"
}
```

**Error Responses:**
- `401` - No token provided
- `403` - Invalid token

---

## 📋 Task Endpoints

### Create a Task
**POST** `/tasks`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Required Fields:**
- `title` (string) - Task title (required)
- `description` (string) - Task description (optional)
- `category` (string) - Task category (optional)
- `dueDate` (string) - Due date (optional)

**Example Request:**
```json
{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread, and vegetables",
    "category": "Personal",
    "dueDate": "2026-09-10"
}
```

**Successful Response (201 Created):**
```json
{
    "message": "Task created successfully!",
    "task": {
        "id": 1,
        "user_id": 1,
        "title": "Buy groceries",
        "description": "Milk, eggs, bread, and vegetables",
        "category": "Personal",
        "dueDate": "2026-09-10"
    }
}
```

**Error Responses:**
- `400` - Task title is required
- `400` - Title too long (max 200 characters)
- `400` - Description too long (max 500 characters)
- `401` - No token provided
- `500` - Server error

---

### Get All Tasks
**GET** `/tasks`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Query Parameters (Optional):**
- `status` - Filter by status (todo, in-progress, completed)
- `category` - Filter by category (Personal, Work, etc.)
- `search` - Search by keyword in title

**Examples:**
```
GET /tasks?status=todo
GET /tasks?category=Personal
GET /tasks?search=report
GET /tasks?status=todo&search=report
```

**Successful Response (200 OK):**
```json
{
    "message": "Tasks fetched successfully!",
    "count": 2,
    "filters": {
        "status": "todo"
    },
    "tasks": [
        {
            "id": 1,
            "user_id": 1,
            "title": "Buy groceries",
            "description": "Milk, eggs, bread",
            "category": "Personal",
            "status": "todo",
            "due_date": "2026-09-10",
            "created_at": "2026-09-03T10:42:14.383Z"
        }
    ]
}
```

---

### Get a Single Task
**GET** `/tasks/:id`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Successful Response (200 OK):**
```json
{
    "message": "Task fetched successfully!",
    "task": {
        "id": 1,
        "user_id": 1,
        "title": "Buy groceries",
        "description": "Milk, eggs, bread",
        "category": "Personal",
        "status": "todo",
        "due_date": "2026-09-10",
        "created_at": "2026-09-03T10:42:14.383Z"
    }
}
```

**Error Responses:**
- `400` - Invalid task ID
- `404` - Task not found or no permission

---

### Update a Task
**PUT** `/tasks/:id`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Fields (All Optional):**
- `title` (string) - Updated title
- `description` (string) - Updated description
- `category` (string) - Updated category
- `status` (string) - todo, in-progress, completed
- `dueDate` (string) - Updated due date

**Example Request:**
```json
{
    "title": "Buy groceries (Updated!)",
    "status": "completed"
}
```

**Successful Response (200 OK):**
```json
{
    "message": "Task updated successfully!",
    "task": {
        "id": 1,
        "user_id": 1,
        "title": "Buy groceries (Updated!)",
        "description": "Milk, eggs, bread",
        "category": "Personal",
        "status": "completed",
        "due_date": "2026-09-10",
        "created_at": "2026-09-03T10:42:14.383Z"
    }
}
```

**Error Responses:**
- `400` - Invalid task ID
- `400` - Task title cannot be empty
- `400` - Title too long (max 200 characters)
- `400` - Description too long (max 500 characters)
- `404` - Task not found or no permission
- `400` - No changes were made

---

### Delete a Task
**DELETE** `/tasks/:id`

**Headers:** `Authorization: Bearer YOUR_TOKEN`

**Successful Response (200 OK):**
```json
{
    "message": "Task deleted successfully!",
    "deleted": true
}
```

**Error Responses:**
- `400` - Invalid task ID
- `404` - Task not found or no permission
- `500` - Server error

---

## 📊 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token) |
| 403 | Forbidden (invalid token) |
| 404 | Not Found |
| 500 | Server Error |

---

## 🧪 Testing Guide

### 1. Register a User
```
POST /auth/register
Body: { "name": "John Doe", "email": "john@example.com", "password": "password123" }
```

### 2. Login
```
POST /auth/login
Body: { "email": "john@example.com", "password": "password123" }
```

### 3. Save the Token
Copy the token from the login response.

### 4. Create a Task
```
POST /tasks
Headers: Authorization: Bearer YOUR_TOKEN
Body: { "title": "My first task" }
```

### 5. Get All Tasks
```
GET /tasks
Headers: Authorization: Bearer YOUR_TOKEN
```

### 6. Update a Task
```
PUT /tasks/1
Headers: Authorization: Bearer YOUR_TOKEN
Body: { "status": "completed" }
```

### 7. Delete a Task
```
DELETE /tasks/2
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## 🔧 Filters and Validation

### Available Filters
- `status` - todo, in-progress, completed
- `category` - Personal, Work, Study, etc.
- `search` - Keyword search in title

### Validation Rules
- **Name**: Cannot be empty
- **Email**: Must be valid format
- **Password**: Minimum 6 characters
- **Task Title**: Required, max 200 characters
- **Task Description**: Max 500 characters

---

## 📦 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: SQLite3
- **Authentication**: JWT with bcrypt
- **Validation**: Custom validators