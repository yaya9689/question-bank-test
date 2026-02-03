/**
 * ProgressManager - Manages quiz progress using LocalStorage
 */
class ProgressManager {
    constructor() {
        this.storageKey = 'coastGuardQuizProgress';
        this.init();
    }

    /**
     * Initialize storage structure
     */
    init() {
        if (!this.loadProgress()) {
            this.resetProgress();
        }
    }

    /**
     * Load progress from LocalStorage
     */
    loadProgress() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading progress:', error);
            return null;
        }
    }

    /**
     * Save progress to LocalStorage
     */
    saveProgress(progress) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(progress));
            return true;
        } catch (error) {
            console.error('Error saving progress:', error);
            return false;
        }
    }

    /**
     * Get current question index
     */
    getCurrentQuestion() {
        const progress = this.loadProgress();
        return progress ? progress.currentQuestion : 0;
    }

    /**
     * Set current question index
     */
    setCurrentQuestion(index) {
        const progress = this.loadProgress();
        if (progress) {
            progress.currentQuestion = index;
            this.saveProgress(progress);
        }
    }

    /**
     * Save answer for a question
     * @param {number} questionId - Question ID
     * @param {string} selectedAnswer - Selected answer (A, B, C, or D)
     * @param {boolean} isCorrect - Whether the answer is correct
     */
    saveAnswer(questionId, selectedAnswer, isCorrect) {
        const progress = this.loadProgress();
        if (progress) {
            progress.answers[questionId] = {
                selected: selectedAnswer,
                correct: isCorrect,
                timestamp: new Date().toISOString()
            };
            
            if (!isCorrect && !progress.mistakes.includes(questionId)) {
                progress.mistakes.push(questionId);
            }
            
            this.saveProgress(progress);
        }
    }

    /**
     * Get answer for a specific question
     */
    getAnswer(questionId) {
        const progress = this.loadProgress();
        if (progress && progress.answers[questionId]) {
            return progress.answers[questionId].selected;
        }
        return null;
    }

    /**
     * Check if a question has been answered
     */
    isAnswered(questionId) {
        const progress = this.loadProgress();
        return progress && progress.answers.hasOwnProperty(questionId);
    }

    /**
     * Get list of mistake question IDs
     */
    getMistakes() {
        const progress = this.loadProgress();
        return progress ? progress.mistakes : [];
    }

    /**
     * Get statistics
     */
    getStatistics() {
        const progress = this.loadProgress();
        if (!progress) {
            return {
                total: 119,
                completed: 0,
                correct: 0,
                incorrect: 0,
                accuracy: 0
            };
        }

        const answersArray = Object.values(progress.answers);
        const completed = answersArray.length;
        const correct = answersArray.filter(a => a.correct).length;
        const incorrect = answersArray.filter(a => !a.correct).length;
        const accuracy = completed > 0 ? Math.round((correct / completed) * 100) : 0;

        return {
            total: 119,
            completed,
            correct,
            incorrect,
            accuracy
        };
    }

    /**
     * Reset all progress
     */
    resetProgress() {
        const initialProgress = {
            currentQuestion: 0,
            answers: {},
            mistakes: [],
            startedAt: new Date().toISOString()
        };
        this.saveProgress(initialProgress);
    }

    /**
     * Check if LocalStorage is available
     */
    static isAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
}

// Make ProgressManager available globally
if (typeof window !== 'undefined') {
    window.ProgressManager = ProgressManager;
}
