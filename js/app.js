/**
 * Main application logic for homepage
 */

// Start quiz function
function startQuiz(random = false) {
    window.location.href = random ? 'quiz.html?random=true' : 'quiz.html';
}

// Initialize homepage
document.addEventListener('DOMContentLoaded', function() {
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
            119 道題目 <span style="color: var(--success-color);">(已完成 ${stats.completed} 題)</span>
        `;
    }

    // Initialize dark mode
    if (typeof initDarkMode === 'function') {
        initDarkMode();
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
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
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