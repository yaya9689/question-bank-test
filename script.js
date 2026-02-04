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
        questions = questions.concat(data.questions);
    }
    // Initialize the quiz with the combined questions
    initializeQuiz(questions);
}

function initializeQuiz(questions) {
    // Existing functionality to handle quiz with the questions
}

loadQuestions();