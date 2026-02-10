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
     * ✅ 修正：儲存答案並正確處理錯題陣列
     * @param {number} questionId - Question ID
     * @param {string} selectedAnswer - Selected answer (A, B, C, or D)
     * @param {boolean} isCorrect - Whether the answer is correct
     */
    saveAnswer(questionId, selectedAnswer, isCorrect) {
        const progress = this.loadProgress();
        if (progress) {
            // 儲存答案記錄
            progress.answers[questionId] = {
                selected: selectedAnswer,
                correct: isCorrect,
                timestamp: new Date().toISOString()
            };
            
            if (!isCorrect) {
                // ❌ 答錯：加入錯題陣列（如果尚未存在）
                if (!progress.mistakes.includes(questionId)) {
                    progress.mistakes.push(questionId);
                }
            } else {
                // ✅ 答對：從錯題陣列移除（如果之前答錯過）
                const index = progress.mistakes.indexOf(questionId);
                if (index > -1) {
                    progress.mistakes.splice(index, 1);
                }
            }
            
            this.saveProgress(progress);
            
            // 除錯日誌
            console.log(`💾 答案已儲存 - ID: ${questionId}, 選擇: ${selectedAnswer}, 結果: ${isCorrect ? '✅' : '❌'}`);
            console.log(`📊 錯題陣列:`, progress.mistakes);
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
                total: 254,
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
            total: 254,
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
            timestamp: new Date().toISOString()
        };
        this.saveProgress(initialProgress);
        console.log('🔄 進度已重置');
        return initialProgress;
    }

    /**
     * Clear all stored data
     */
    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('🗑️ 所有資料已清除');
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
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

    /**
     * Export progress data (for backup)
     */
    exportData() {
        const progress = this.loadProgress();
        return JSON.stringify(progress, null, 2);
    }

    /**
     * Import progress data (from backup)
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.saveProgress(data);
            console.log('✅ 資料已匯入');
            return true;
        } catch (error) {
            console.error('❌ 匯入失敗:', error);
            return false;
        }
    }
}
