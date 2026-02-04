// Load multiple JSON files from the data folder

const fileNames = [
    'criminal-procedure.json',
    'customs-anti-smuggling.json',
    'port-security.json'
];

let questions = [];

async function loadQuestions() {
    for (const fileName of fileNames) {
        const response = await fetch(`data/${fileName}`);
        const data = await response.json();
        questions = questions.concat(data);
    }
    return questions;
}

// Make loadQuestions available globally
if (typeof window !== 'undefined') {
    window.loadQuestions = loadQuestions;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadQuestions };
}
