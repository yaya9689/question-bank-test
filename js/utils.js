async function loadQuestions() {
    const files = [
        'data/criminal-procedure.json',
        'data/customs-anti-smuggling.json',
        'data/port-security.json'
    ];

    const questions = [];

    for (const file of files) {
        const response = await fetch(file);
        const data = await response.json();
        questions.push(...data.questions);
    }

    return questions;
}