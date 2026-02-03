// Question Bank Management System

class QuestionBank {
    constructor() {
        this.questions = this.loadQuestions();
    }

    // Load questions from localStorage
    loadQuestions() {
        const storedQuestions = localStorage.getItem('questions');
        return storedQuestions ? JSON.parse(storedQuestions) : [];
    }

    // Add a question
    addQuestion(question) {
        this.questions.push(question);
        this.saveQuestions();
    }

    // Edit a question
    editQuestion(index, updatedQuestion) {
        if (index >= 0 && index < this.questions.length) {
            this.questions[index] = updatedQuestion;
            this.saveQuestions();
        }
    }

    // Delete a question
    deleteQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.questions.splice(index, 1);
            this.saveQuestions();
        }
    }

    // Save questions to localStorage
    saveQuestions() {
        localStorage.setItem('questions', JSON.stringify(this.questions));
    }

    // Practice mode: Random question
    getRandomQuestion() {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        return this.questions[randomIndex];
    }

    // Import questions from a file
    importQuestions(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const importedQuestions = JSON.parse(reader.result);
            this.questions = [...this.questions, ...importedQuestions];
            this.saveQuestions();
        };
        reader.readAsText(file);
    }

    // Export questions to a file
    exportQuestions() {
        const dataStr = JSON.stringify(this.questions);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Example usage:
const qb = new QuestionBank();

// Adding a question
qb.addQuestion({ question: 'What is the capital of France?', answer: 'Paris' });

// Edit a question
qb.editQuestion(0, { question: 'What is the capital of France?', answer: 'Paris, France' });

// Delete a question
qb.deleteQuestion(0);