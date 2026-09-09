// frontend/js/api.js - API helper functions

// Base URL for your backend (Updated for Render deployment)
const API_BASE_URL = 'https://taskflow-backend-zluw.onrender.com/api';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Save token to localStorage
const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
    localStorage.removeItem('token');
};

// Check if user is logged in
const isLoggedIn = () => {
    return !!getToken();
};

// Reusable API request function
const apiRequest = async (endpoint, method = 'GET', data = null) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add token if it exists
    const token = getToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add body if data exists
    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const responseData = await response.json();
        
        return {
            ok: response.ok,
            status: response.status,
            data: responseData
        };
    } catch (error) {
        console.error('API Request Error:', error);
        return {
            ok: false,
            status: 500,
            data: { message: 'Network error. Please try again.' }
        };
    }
};

export { 
    API_BASE_URL, 
    getToken, 
    setToken, 
    removeToken, 
    isLoggedIn, 
    apiRequest 
};