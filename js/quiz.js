/**
 * QuizManager - Main quiz logic and UI control
 */

// Theme toggle function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Icon rotation animation
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
        toggleBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            toggleBtn.style.transform = '';
        }, 300);
    }
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

class QuizManager {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.storage = new ProgressManager();
        this.selectedAnswer = null;
        this.answered = false;
        this.init();
    }

    /**
     * Initialize quiz
     */
    async init() {
        // Initialize theme
        initTheme();
        
        // Load questions
        this.questions = await loadQuestions();
        
        if (this.questions.length === 0) {
            this.showError('No questions available');
            return;
        }

        // Load saved progress
        this.currentIndex = this.storage.getCurrentQuestion();

        // Render first/current question
        this.renderQuestion();
    }

    /**
     * Render current question
     */
    renderQuestion() {
        const question = this.questions[this.currentIndex];
        
        if (!question) {
            this.showComplete();
            return;
        }

        // Reset state
        this.selectedAnswer = null;
        this.answered = false;

        // Update question counter
        document.getElementById('currentQuestion').textContent = this.currentIndex + 1;
        document.getElementById('totalQuestions').textContent = this.questions.length;

        // Update progress bar with animation
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressPercentage');
        
        progressBar.style.width = progress + '%';
        this.animateNumber(progressText, parseInt(progressText.textContent), Math.round(progress), 500);

        // Update question text with fade-in
        const questionEl = document.getElementById('questionText');
        questionEl.style.opacity = '0';
        setTimeout(() => {
            questionEl.textContent = question.question;
            questionEl.style.transition = 'opacity 0.3s ease';
            questionEl.style.opacity = '1';
        }, 100);

        // Render options
        this.renderOptions(question);

        // Disable next button initially
        document.getElementById('nextBtn').disabled = true;

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Animate number counter
     */
    animateNumber(element, from, to, duration) {
        const range = to - from;
        const increment = range / (duration / 16);
        let current = from;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= to) || (increment < 0 && current <= to)) {
                current = to;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + '%';
        }, 16);
    }

    /**
     * Render answer options
     */
    renderOptions(question) {
        const optionsSection = document.getElementById('optionsSection');
        optionsSection.innerHTML = '';

        const optionKeys = Object.keys(question.options);
        
        optionKeys.forEach((key, index) => {
            const optionCard = this.createOptionCard(key, question.options[key], question.correctAnswer);
            // Stagger animation
            optionCard.style.opacity = '0';
            optionCard.style.transform = 'translateY(20px)';
            setTimeout(() => {
                optionCard.style.transition = 'all 0.3s ease';
                optionCard.style.opacity = '1';
                optionCard.style.transform = 'translateY(0)';
            }, 100 + (index * 50));
            optionsSection.appendChild(optionCard);
        });
    }

    /**
     * Create option card element
     */
    createOptionCard(key, text, correctAnswer) {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.dataset.option = key;

        card.innerHTML = `
            <div class="option-label">${key}</div>
            <div class="option-text">${text}</div>
            <div class="option-feedback"></div>
        `;

        card.addEventListener('click', () => {
            if (!this.answered) {
                this.selectOption(key, correctAnswer, card);
            }
        });

        return card;
    }

    /**
     * Handle option selection
     */
    selectOption(selectedKey, correctAnswer, selectedCard) {
        if (this.answered) return;

        this.selectedAnswer = selectedKey;
        this.answered = true;

        const isCorrect = selectedKey === correctAnswer;

        // Update UI
        const allOptions = document.querySelectorAll('.option-card');
        
        allOptions.forEach(card => {
            const optionKey = card.dataset.option;
            
            if (optionKey === selectedKey) {
                // User's selection
                card.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
            
            if (optionKey === correctAnswer && !isCorrect) {
                // Show correct answer if user was wrong
                card.classList.add('correct');
            }
            
            if (optionKey !== selectedKey && optionKey !== correctAnswer) {
                // Disable other options
                card.classList.add('disabled');
            }
        });

        // Save answer
        const question = this.questions[this.currentIndex];
        this.storage.saveAnswer(question.id, selectedKey, isCorrect);

        // Enable next button
        document.getElementById('nextBtn').disabled = false;

        // Vibrate on mobile
        if (isCorrect) {
            vibrate(50);
        } else {
            vibrate([100, 50, 100]);
        }
    }

    /**
     * Move to next question
     */
    nextQuestion() {
        if (!this.answered) return;

        this.currentIndex++;
        
        // Save progress
        this.storage.setCurrentQuestion(this.currentIndex);

        // Check if quiz is complete
        if (this.currentIndex >= this.questions.length) {
            this.showComplete();
        } else {
            this.renderQuestion();
        }
    }

    /**
     * Show quiz completion screen
     */
    showComplete() {
        const stats = this.storage.getStatistics();
        
        const container = document.querySelector('.quiz-container');
        container.innerHTML = `
            <div class="quiz-complete">
                <h2>🎉 Quiz Complete!</h2>
                <p>Congratulations on completing all ${stats.total} questions!</p>
                
                <div class="stats-summary">
                    <div class="stat-item">
                        <div class="stat-number">${stats.correct}</div>
                        <div class="stat-label">Correct</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.incorrect}</div>
                        <div class="stat-label">Incorrect</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.accuracy}%</div>
                        <div class="stat-label">Accuracy</div>
                    </div>
                </div>

                <div class="action-buttons" style="margin-top: 30px;">
                    <button class="btn btn-primary" onclick="window.location.href='stats.html'">View Statistics</button>
                    <button class="btn btn-secondary" onclick="window.location.href='mistakes.html'">Review Mistakes</button>
                    <button class="btn btn-secondary" onclick="window.location.href='index.html'">Back to Home</button>
                </div>
            </div>
        `;

        // Add styles for completion screen
        const style = document.createElement('style');
        style.textContent = `
            .stats-summary {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin: 30px 0;
            }
            .stat-item {
                background: rgba(0, 0, 0, 0.05);
                padding: 20px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            .stat-item .stat-number {
                font-size: 36px;
                font-weight: 700;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 5px;
            }
            .stat-item .stat-label {
                font-size: 14px;
                color: var(--text-secondary);
            }
            @media (max-width: 375px) {
                .stats-summary {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show error message
     */
    showError(message) {
        const container = document.querySelector('.quiz-container');
        container.innerHTML = `
            <div class="quiz-complete">
                <h2>⚠️ Error</h2>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="window.location.href='index.html'">Back to Home</button>
            </div>
        `;
    }
}

// Initialize quiz when page loads
let quizManager;

document.addEventListener('DOMContentLoaded', function() {
    // Check if LocalStorage is available
    if (!ProgressManager.isAvailable()) {
        alert('LocalStorage is not available. Progress cannot be saved.');
    }

    quizManager = new QuizManager();
});

// Global functions for HTML onclick handlers
function nextQuestion() {
    if (quizManager) {
        quizManager.nextQuestion();
    }
}

function goHome() {
    if (confirm('Are you sure you want to leave? Your progress will be saved.')) {
        window.location.href = 'index.html';
    }
}
