// frontend/js/toast.js - Toast notifications

export function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast-container');
    if (existing) existing.remove();
    
    // Colors
    const colors = {
        success: { bg: '#51cf66', text: '#fff' },
        error: { bg: '#ff6b6b', text: '#fff' },
        warning: { bg: '#ffd43b', text: '#333' },
        info: { bg: '#74c0fc', text: '#fff' }
    };
    
    const color = colors[type] || colors.success;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-container';
    toast.innerHTML = `
        <div class="toast-message" style="
            background: ${color.bg};
            color: ${color.text};
            padding: 14px 24px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-size: 15px;
            font-weight: 500;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            transform: translateX(0);
            display: flex;
            align-items: center;
            gap: 12px;
        ">
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        const el = document.querySelector('.toast-container');
        if (el) {
            el.style.transition = 'opacity 0.3s';
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        }
    }, 3000);
}