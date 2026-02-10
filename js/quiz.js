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
        try {
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

            console.log(`📚 載入 ${this.questions.length} 題`);

            // Load saved progress
            this.currentIndex = this.storage.getCurrentQuestion();

            // Render first/current question
            this.renderQuestion();
        } catch (error) {
            console.error('❌ 初始化失敗:', error);
            this.showError('初始化失敗，請重新整理頁面');
        }
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
                const feedback = card.querySelector('.option-feedback');
                feedback.textContent = isCorrect ? '✅ 正確！' : '❌ 錯誤';
            }
            
            if (optionKey === correctAnswer && !isCorrect) {
                // Show correct answer if user was wrong
                card.classList.add('correct');
                const feedback = card.querySelector('.option-feedback');
                feedback.textContent = '✅ 正確答案';
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
        if (navigator.vibrate) {
            if (isCorrect) {
                navigator.vibrate(50);
            } else {
                navigator.vibrate([100, 50, 100]);
            }
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
     * ✅ 修正：顯示測驗完成畫面（使用實際題目數量）
     */
    showComplete() {
        const stats = this.storage.getStatistics();
        
        // ✅ 使用實際完成的題目數量，而非固定 254
        const actualTotal = this.questions.length;
        
        const container = document.querySelector('.quiz-container');
        container.innerHTML = `
            <div class="quiz-complete" style="animation: fadeIn 0.6s ease-out;">
                <div class="completion-icon" style="font-size: 80px; margin-bottom: 20px;">🎉</div>
                <h2 style="color: var(--primary-color); margin-bottom: 10px;">測驗完成！</h2>
                <p style="font-size: 18px; color: var(--text-gray); margin-bottom: 30px;">
                    恭喜你完成所有 <strong style="color: var(--primary-color);">${actualTotal}</strong> 道題目！
                </p>
                
                <div class="stats-summary">
                    <div class="stat-item stat-correct">
                        <div class="stat-icon">✅</div>
                        <div class="stat-number">${stats.correct}</div>
                        <div class="stat-label">答對</div>
                    </div>
                    <div class="stat-item stat-incorrect">
                        <div class="stat-icon">❌</div>
                        <div class="stat-number">${stats.incorrect}</div>
                        <div class="stat-label">答錯</div>
                    </div>
                    <div class="stat-item stat-accuracy">
                        <div class="stat-icon">📊</div>
                        <div class="stat-number">${stats.accuracy}%</div>
                        <div class="stat-label">正確率</div>
                    </div>
                </div>

                <div class="action-buttons" style="margin-top: 40px;">
                    <button class="btn btn-primary" onclick="window.location.href='stats.html'">
                        📊 查看統計
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.href='mistakes.html'" ${stats.incorrect === 0 ? 'disabled' : ''}>
                        ❌ 錯題回顧 ${stats.incorrect > 0 ? `(${stats.incorrect})` : ''}
                    </button>
                    <button class="btn btn-secondary" onclick="window.location.href='index.html'">
                        🏠 返回首頁
                    </button>
                </div>

                ${stats.accuracy >= 90 ? `
                    <div style="margin-top: 30px; padding: 20px; background: var(--success-glow); border-radius: 12px;">
                        <p style="font-size: 20px; color: var(--success-color); font-weight: 600;">
                            🏆 太棒了！你的表現非常優異！
                        </p>
                    </div>
                ` : stats.accuracy >= 70 ? `
                    <div style="margin-top: 30px; padding: 20px; background: var(--glass-bg); border-radius: 12px;">
                        <p style="font-size: 18px; color: var(--primary-color); font-weight: 600;">
                            👍 表現不錯！繼續努力！
                        </p>
                    </div>
                ` : `
                    <div style="margin-top: 30px; padding: 20px; background: var(--error-glow); border-radius: 12px;">
                        <p style="font-size: 18px; color: var(--error-color); font-weight: 600;">
                            💪 加油！建議複習錯題以提升成績！
                        </p>
                    </div>
                `}
            </div>
        `;

        // Add styles for completion screen
        const style = document.createElement('style');
        style.textContent = `
            .quiz-complete {
                text-align: center;
                padding: 40px 20px;
            }

            .completion-icon {
                animation: bounce 1s ease infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }

            .stats-summary {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin: 30px 0;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }

            .stat-item {
                background: var(--glass-bg);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid var(--glass-border);
                padding: 25px 15px;
                border-radius: 16px;
                transition: all 0.3s ease;
            }

            .stat-item:hover {
                transform: translateY(-5px);
                box-shadow: var(--glass-shadow-hover);
            }

            .stat-item .stat-icon {
                font-size: 32px;
                margin-bottom: 10px;
            }

            .stat-item .stat-number {
                font-size: 42px;
                font-weight: 700;
                margin-bottom: 5px;
            }

            .stat-correct .stat-number {
                color: var(--success-color);
            }

            .stat-incorrect .stat-number {
                color: var(--error-color);
            }

            .stat-accuracy .stat-number {
                color: var(--primary-color);
            }

            .stat-item .stat-label {
                font-size: 14px;
                color: var(--text-gray);
                font-weight: 500;
            }

            .action-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }

            @media (max-width: 768px) {
                .stats-summary {
                    grid-template-columns: 1fr;
                }

                .action-buttons {
                    flex-direction: column;
                }

                .action-buttons .btn {
                    width: 100%;
                    max-width: 300px;
                }
            }
        `;
        document.head.appendChild(style);

        console.log('🎉 測驗完成！統計:', stats);
    }

    /**
     * Show error message
     */
    showError(message) {
        const container = document.querySelector('.quiz-container');
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                <h2 style="color: var(--error-color);">發生錯誤</h2>
                <p style="margin: 20px 0;">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">重新整理</button>
                <button class="btn btn-secondary" onclick="window.location.href='index.html'">返回首頁</button>
            </div>
        `;
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quizManager = new QuizManager();
});

// Helper function for vibration (moved to global scope)
function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}
