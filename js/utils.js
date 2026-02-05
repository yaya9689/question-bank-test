async function loadQuestions() {
    try {
        const files = [
            'data/criminal-procedure.json',
            'data/customs-anti-smuggling.json',
            'data/port-security.json',
            'data/national-security-law.json',
            'data/animal-plant-quarantine.json',
            'data/commercial-port-security.json',
            'data/smuggling-punishment.json',
            'data/marine-oil-pollution-response.json',
            'data/maritime-rescue-operations.json',
            'data/territorial-waters-eez.json',
            'data/coastal-patrol-duties.json'
        ];
        
        let allQuestions = [];
        for (const file of files) {
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    console.warn(`無法載入 ${file}，跳過此檔案`);
                    continue;
                }
                const data = await response.json();
                allQuestions = allQuestions.concat(data);
            } catch (fileError) {
                console.warn(`載入 ${file} 時發生錯誤:`, fileError);
                continue;
            }
        }
        
        if (allQuestions.length === 0) {
            throw new Error('沒有成功載入任何題目');
        }
        
        // 隨機打亂題目順序
        allQuestions = shuffleArray(allQuestions);
        
        return allQuestions;
    } catch (error) {
        console.error('Error loading questions:', error);
        showNotification('載入題目失敗，請重新整理頁面。', 'error');
        return [];
    }
}