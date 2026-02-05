// Load multiple JSON files from the data folder

const fileNames = [
    'criminal-procedure.json',
    'commercial-port-security.json',
    'coastal-patrol-duties.json',
    'coastal-patrol-regulations.json',
    'marine-oil-pollution-response.json',
    'national-security-law.json',
    'port-security.json',
    'smuggling-punishment.json',
    'territorial-waters-eez.json'
];

let questions = [];

async function loadQuestions() {
    for (const fileName of fileNames) {
        try {
            const response = await fetch(`data/${fileName}`);
            if (!response.ok) {
                console.error(`Failed to load ${fileName}: ${response.status}`);
                continue;
            }
            const data = await response.json();
            questions = questions.concat(data);
        } catch (error) {
            console.error(`Error loading ${fileName}:`, error);
        }
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
