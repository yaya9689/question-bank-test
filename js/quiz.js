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
        // Load all questions
        const allQuestions = await loadQuestions();
        
        if (allQuestions.length === 0) {
            this.showError('無法載入題目');
            return;
        }

        // Get question count from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const count = parseInt(urlParams.get('count')) || 254;

        // Randomly select questions if count is less than total
        if (count < allQuestions.length) {
            this.questions = this.shuffleArray([...allQuestions]).slice(0, count);
        } else {
            this.questions = allQuestions;
        }

        // Load saved progress
        this.currentIndex = this.storage.getCurrentQuestion();

        // Render first/current question
        this.renderQuestion();
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
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
                <h2>🎉 測驗完成！</h2>
                <p>恭喜你完成所有 ${stats.total} 道題目！</p>
                
                <div class="stats-summary">
                    <div class="stat-item">
                        <div class="stat-number">${stats.correct}</div>
                        <div class="stat-label">答對</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.incorrect}</div>
                        <div class="stat-label">答錯</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.accuracy}%</div>
                        <div class="stat-label">正確率</div>
                    </div>
                </div>

                <div class="action-buttons" style="margin-top: 30px;">
                    <button class="btn btn-primary" onclick="window.location.href='stats.html'">查看統計</button>
                    <button class="btn btn-secondary" onclick="window.location.href='mistakes.html'">錯題回顧</button>
                    <button class="btn btn-secondary" onclick="window.location.href='index.html'">返回首頁</button>
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
                <h2>⚠️ 錯誤</h2>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="window.location.href='index.html'">返回首頁</button>
            </div>
        `;
    }
}

// Initialize quiz when page loads
let quizManager;

document.addEventListener('DOMContentLoaded', function() {
    // Check if LocalStorage is available
    if (!ProgressManager.isAvailable()) {
        alert('瀏覽器不支援本地儲存功能，無法儲存進度。');
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
    if (confirm('確定要離開嗎？你的進度將會被儲存。')) {
        window.location.href = 'index.html';
    }
}
