// frontend/js/dark-mode.js - Dark mode toggle

const toggleBtn = document.getElementById('darkModeToggle');

// Check saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateButtonText(savedTheme);
}

// Toggle on click
toggleBtn?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateButtonText(newTheme);
});

function updateButtonText(theme) {
    if (!toggleBtn) return;
    toggleBtn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}