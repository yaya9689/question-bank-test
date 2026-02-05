// Load multiple JSON files from the data folder

const fileNames = [
    'criminal-procedure.json',              // 刑事訴訟法 (20題)
    'port-security.json',                   // 漁港及遊艇港安全檢查 (20題)
    'commercial-port-security.json',        // 商港安全檢查 (20題)
    'coast-guard-duties.json',              // 海巡勤務 (30題)
    'marine-pollution-response.json',       // 海洋污染應變 (15題)
    'maritime-rescue-operations.json',      // 海上救難作業 (16題)
    'coastal-patrol-regulations.json',      // 海岸巡防勤務實施要點 (25題)
    'territorial-waters-eez.json',          // 領海及專屬經濟海域法 (19題)
    'customs-anti-smuggling.json',          // 海關緝私條例 (20題)
    'animal-plant-quarantine.json',         // 動植物檢疫相關規定 (20題)
    'national-security-law.json',           // 國家安全法暨其施行細則 (30題)
    'smuggling-punishment.json'             // 懲治走私條例 (19題)
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
    console.log(`✅ 成功載入 ${questions.length} 題`);
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
