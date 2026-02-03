/**
 * Main application logic for homepage
 */

// Start quiz function
function startQuiz() {
    window.location.href = 'quiz.html';
}

// Theme toggle function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = document.getElementById('themeIcon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Icon rotation animation
    const toggleBtn = document.querySelector('.theme-toggle');
    toggleBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        toggleBtn.style.transform = '';
    }, 300);
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Initialize homepage
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Hide loader after a short delay
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 500);
    
    // Check LocalStorage availability
    if (!ProgressManager || !ProgressManager.isAvailable()) {
        console.warn('LocalStorage is not available');
        return;
    }

    // Load progress and show statistics if available
    const storage = new ProgressManager();
    const stats = storage.getStatistics();

    // Update question count display if needed
    const questionCountEl = document.querySelector('.question-count');
    if (questionCountEl && stats.completed > 0) {
        questionCountEl.innerHTML = `
            ${stats.total} Questions <span style="color: rgba(52, 168, 83, 1);">(${stats.completed} completed)</span>
        `;
    }

    // Add animations
    animateFeatureCards();
});

/**
 * Animate feature cards on scroll/load
 */
function animateFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach((card, index) => {
        // Cards already have fade-in-up class, just ensure they're visible
        setTimeout(() => {
            card.style.opacity = '1';
        }, 100 + (index * 100));
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press Enter or Space to start quiz
    if (e.key === 'Enter' || e.key === ' ') {
        const startBtn = document.querySelector('.btn-start');
        if (startBtn && document.activeElement !== startBtn) {
            e.preventDefault();
            startBtn.click();
        }
    }
});

// Service Worker registration (for future PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Commented out for now - can be enabled when SW is implemented
        // navigator.serviceWorker.register('/sw.js');
    });
}
