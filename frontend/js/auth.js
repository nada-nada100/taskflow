// frontend/js/auth.js - Authentication with toasts

import { apiRequest, setToken, removeToken } from './api.js';
import { showToast } from './toast.js';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.querySelector('.logout-btn');

const showError = (formId, message) => {
    const form = document.getElementById(formId);
    const existing = form.querySelector('.error-message');
    if (existing) existing.remove();
    
    const div = document.createElement('div');
    div.className = 'error-message';
    div.style.cssText = `
        background: #fee;
        color: #c00;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        border: 1px solid #fcc;
    `;
    div.textContent = message;
    form.insertBefore(div, form.firstChild);
};

const removeError = (formId) => {
    const form = document.getElementById(formId);
    const error = form.querySelector('.error-message');
    if (error) error.remove();
};

// Register
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        removeError('registerForm');
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!name) return showError('registerForm', 'Please enter your name');
        if (!email) return showError('registerForm', 'Please enter your email');
        if (!password) return showError('registerForm', 'Please enter a password');
        if (password.length < 6) return showError('registerForm', 'Password must be at least 6 characters');
        
        try {
            const result = await apiRequest('/auth/register', 'POST', { name, email, password });
            if (result.ok) {
                setToken(result.data.token);
                showToast('🎉 Registration successful! Welcome ' + name, 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 500);
            } else {
                showError('registerForm', result.data.message || 'Registration failed');
            }
        } catch (error) {
            showError('registerForm', 'Network error. Please try again.');
        }
    });
}

// Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        removeError('loginForm');
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (!email) return showError('loginForm', 'Please enter your email');
        if (!password) return showError('loginForm', 'Please enter your password');
        
        try {
            const result = await apiRequest('/auth/login', 'POST', { email, password });
            if (result.ok) {
                setToken(result.data.token);
                showToast('🔐 Welcome back!', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 500);
            } else {
                showError('loginForm', result.data.message || 'Login failed');
            }
        } catch (error) {
            showError('loginForm', 'Network error. Please try again.');
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        removeToken();
        showToast('👋 See you soon!', 'info');
        setTimeout(() => window.location.href = 'login.html', 500);
    });
}