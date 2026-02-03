# Coast Guard Exam Preparation - 海巡署測驗題庫

A comprehensive web application for practicing Coast Guard exam questions with instant feedback, progress tracking, and performance statistics.

## Features

### 📖 Official Questions
- Complete database of 119 authentic Coast Guard exam questions
- Covers law, maritime regulations, and practical case analyses
- Questions in Traditional Chinese

### 🏆 Instant Feedback System
- Immediate visual feedback on answer selection
- Green highlight with ✓ for correct answers
- Red highlight with ✗ for incorrect answers, showing the correct answer
- Other options become dimmed after selection

### 📊 Progress Tracking
- LocalStorage-based progress saving
- Automatic resume from last question
- Real-time progress percentage display
- Question counter (e.g., "Question 5 of 119")

### 📈 Statistics Dashboard
- Total questions completed
- Correct/incorrect answer counts
- Accuracy rate percentage
- Visual progress bar
- Option to reset progress

### ❌ Mistakes Review
- Review all incorrectly answered questions
- Shows user's answer vs. correct answer
- Helps focus on weak areas

### 📱 Responsive Design
- Mobile-first approach
- Optimized for phones, tablets, and desktops
- Clean and modern UI with smooth animations
- Touch-friendly interface

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Flexbox/Grid layouts, CSS Variables, animations
- **Vanilla JavaScript (ES6+)**: Modular code organization
- **LocalStorage API**: Progress persistence
- **No external dependencies**: Pure HTML/CSS/JS

## Project Structure

```
/
├── index.html          # Homepage with feature showcase
├── quiz.html           # Main quiz interface
├── stats.html          # Statistics page
├── mistakes.html       # Mistakes review page
├── css/
│   ├── style.css       # Global styles
│   ├── quiz.css        # Quiz-specific styles
│   └── responsive.css  # Responsive design rules
├── js/
│   ├── app.js          # Homepage logic
│   ├── quiz.js         # Quiz manager and UI control
│   ├── storage.js      # LocalStorage management
│   └── utils.js        # Utility functions
└── data/
    └── questions.json  # 119 exam questions
```

## Usage

### Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yaya9689/question-bank-test.git
   cd question-bank-test
   ```

2. **Start a local server**:
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Or using Node.js
   npx http-server -p 8080
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8080`

### Deployment

This application can be deployed to:
- **GitHub Pages**: Just enable GitHub Pages in repository settings
- **Netlify/Vercel**: Zero-configuration deployment
- **Any static hosting**: Upload all files to your hosting provider

No build process or server-side code required!

## How to Use

1. **Start**: Click "Start Practice Quiz" on the homepage
2. **Answer**: Click on any option (A, B, C, or D) to select your answer
3. **Feedback**: Instant visual feedback shows if you're correct or incorrect
4. **Next**: Click "Next Question →" to proceed
5. **Track**: View your statistics anytime via "View Statistics"
6. **Review**: Check mistakes via "Review Mistakes"

## Question Format

Questions are stored in `data/questions.json`:

```json
{
  "id": 1,
  "question": "海巡署之主要任務為何？",
  "options": {
    "A": "海域執法",
    "B": "海洋保育",
    "C": "海岸巡防",
    "D": "以上皆是"
  },
  "correctAnswer": "D"
}
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera
- Requires LocalStorage support

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to:
- Add more questions
- Improve UI/UX
- Add new features
- Fix bugs
- Improve documentation
