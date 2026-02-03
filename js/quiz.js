/**
 * QuizManager - Main quiz logic and UI control
 */
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

        // Update progress bar
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
        document.getElementById('progressPercentage').textContent = Math.round(progress) + '%';

        // Update question text
        document.getElementById('questionText').textContent = question.question;

        // Render options
        this.renderOptions(question);

        // Disable next button initially
        document.getElementById('nextBtn').disabled = true;

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Render answer options
     */
    renderOptions(question) {
        const optionsSection = document.getElementById('optionsSection');
        optionsSection.innerHTML = '';

        const optionKeys = Object.keys(question.options);
        
        optionKeys.forEach(key => {
            const optionCard = this.createOptionCard(key, question.options[key], question.correctAnswer);
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
                this.selectOption(key, correctAnswer);
            }
        });

        return card;
    }

    /**
     * Handle option selection
     */
    selectOption(selectedKey, correctAnswer) {
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
                background: var(--background-color);
                padding: 20px;
                border-radius: 12px;
            }
            .stat-item .stat-number {
                font-size: 36px;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 5px;
            }
            .stat-item .stat-label {
                font-size: 14px;
                color: var(--text-gray);
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
