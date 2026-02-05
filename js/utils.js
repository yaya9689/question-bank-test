/**
 * Utility functions for the Coast Guard Exam application
 */

/**
 * Navigate to home page
 */
function goHome() {
    window.location.href = 'index.html';
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} total - Total value
 * @returns {string} - Formatted percentage
 */
function formatPercentage(value, total) {
    if (total === 0) return '0%';
    return Math.round((value / total) * 100) + '%';
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show notification/toast message with glassmorphism design
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Enhanced toast notification system
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info, warning)
 */
function showToast(message, type = 'info') {
    showNotification(message, type);
}

/**
 * Add slide in/out animations and toast styles
 */
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        /* Toast Notification Styles */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            min-width: 250px;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast-success {
            border-left: 4px solid #34A853;
        }
        
        .toast-error {
            border-left: 4px solid #EA4335;
        }
        
        .toast-warning {
            border-left: 4px solid #FBBC04;
        }
        
        .toast-info {
            border-left: 4px solid #4285F4;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Load questions from multiple JSON files
 * @returns {Promise<Array>} - Array of all questions
 */
async function loadQuestions() {
    try {
        const files = [
    'data/criminal-procedure.json',
    'data/customs-anti-smuggling.json',
    'data/port-security.json',
    'data/national-security-law.json',
    'data/animal-plant-quarantine.json',
    'data/commercial-port-security.json',
    'data/smuggling-punishment.json',
    'data/marine-oil-pollution-response.json',
    'data/maritime-rescue-operations.json',
    'data/criminal-procedure-extended.json',
    'data/territorial-waters-eez.json'
];
        
        let allQuestions = [];
        for (const file of files) {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`Failed to load ${file}`);
            }
            const data = await response.json();
            allQuestions = allQuestions.concat(data);
        }
        
        return allQuestions;
    } catch (error) {
        console.error('Error loading questions:', error);
        showNotification('載入題目失敗，請重新整理頁面。', 'error');
        return [];
    }
}

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Check if device is mobile
 * @returns {boolean}
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Vibrate device (if supported)
 * @param {number} duration - Vibration duration in milliseconds
 */
function vibrate(duration = 100) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    
    // Update icon
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }
    
    showNotification(isDark ? '已切換至深色模式' : '已切換至淺色模式', 'info');
}

/**
 * Initialize dark mode from localStorage
 */
function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.theme-icon');
        if (icon) icon.textContent = '☀️';
    }
}

// Auto-initialize dark mode on page load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDarkMode);
    } else {
        initDarkMode();
    }
}

// Make utilities available globally
if (typeof window !== 'undefined') {
    window.utils = {
        goHome,
        shuffleArray,
        formatPercentage,
        debounce,
        showNotification,
        showToast,
        loadQuestions,
        formatDate,
        isMobile,
        smoothScrollTo,
        vibrate,
        toggleDarkMode,
        initDarkMode
    };
}
