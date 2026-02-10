/**
 * Utility functions for the Coast Guard Exam application
 */

/**
 * Navigate to home page
 */
function goHome() {
    if (window.location.pathname.includes('quiz.html')) {
        if (confirm('確定要返回首頁嗎？未完成的進度將會保存。')) {
            window.location.href = 'index.html';
        }
    } else {
        window.location.href = 'index.html';
    }
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
 * @param {string} type - Type of notification (success, error, info, warning)
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
 * Load questions from multiple JSON files
 * @returns {Promise<Array>} - Array of all questions
 */
async function loadQuestions() {
    try {
        const files = [
            'data/criminal-procedure.json',
            'data/port-security.json',
            'data/commercial-port-security.json',
            'data/coast-guard-duties.json',
            'data/marine-pollution-response.json',
            'data/maritime-rescue-operations.json',
            'data/coastal-patrol-regulations.json',
            'data/territorial-waters-eez.json',
            'data/customs-anti-smuggling.json',
            'data/animal-plant-quarantine.json',
            'data/national-security-law.json',
            'data/smuggling-punishment.json'
        ];
        
        let allQuestions = [];
        
        for (const file of files) {
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    console.warn(`⚠️ 無法載入 ${file}，跳過此檔案`);
                    continue;
                }
                const data = await response.json();
                allQuestions = allQuestions.concat(data);
                console.log(`✅ 載入 ${file}: ${data.length} 題`);
            } catch (fileError) {
                console.warn(`❌ 載入 ${file} 時發生錯誤:`, fileError);
                continue;
            }
        }
        
        if (allQuestions.length === 0) {
            throw new Error('沒有成功載入任何題目');
        }
        
        console.log(`🎯 總共載入 ${allQuestions.length} 題`);
        
        // 隨機打亂題目順序
        allQuestions = shuffleArray(allQuestions);
        
        return allQuestions;
    } catch (error) {
        console.error('❌ 載入題目失敗:', error);
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
    return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Check if device is mobile
 * @returns {boolean}
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
 * @param {number|Array} pattern - Vibration pattern
 */
function vibrate(pattern = 100) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }
}

/**
 * Initialize dark mode from localStorage
 */
function initDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.theme-icon');
        if (icon) icon.textContent = '☀️';
    }
}

/**
 * Add toast notification styles
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
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            color: white;
            font-weight: 500;
            font-size: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 10000;
            max-width: 350px;
        }
        
        .toast.show {
            opacity: 1;
            animation: slideIn 0.3s ease;
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
        
        @media (max-width: 768px) {
            .toast {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
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
