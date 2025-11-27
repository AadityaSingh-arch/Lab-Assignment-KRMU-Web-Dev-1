const quizQuestions = [
    {
        question: "What is the capital of France?",
        type: "multiple-choice",
        options: ["London", "Paris", "Berlin", "Madrid"],
        answer: "Paris",
        hint: "Think of the city known as the City of Light."
    },
    {
        question: "Which planet is known as the Red Planet?",
        type: "multiple-choice",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
        hint: "It's named after the Roman god of war."
    },
    {
        question: "What is the largest ocean on Earth?",
        type: "multiple-choice",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: "Pacific Ocean",
        hint: "It's the biggest and covers more area than all land combined."
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        type: "multiple-choice",
        options: ["Jane Austen", "William Shakespeare", "Mark Twain", "Charles Dickens"],
        answer: "William Shakespeare",
        hint: "This famous English playwright lived in the 16th century."
    },
    {
        question: "What is the smallest prime number?",
        type: "multiple-choice",
        options: ["1", "2", "3", "5"],
        answer: "2",
        hint: "A prime number is only divisible by 1 and itself."
    },
    {
        question: "In what year did the Titanic sink?",
        type: "multiple-choice",
        options: ["1905", "1912", "1920", "1898"],
        answer: "1912",
        hint: "It was early in the 20th century, after hitting an iceberg."
    },
    {
        question: "What is the chemical symbol for gold?",
        type: "multiple-choice",
        options: ["Go", "Gd", "Au", "Ag"],
        answer: "Au",
        hint: "The symbol comes from its Latin name 'Aurum'."
    },
    {
        question: "How many continents are there?",
        type: "multiple-choice",
        options: ["5", "6", "7", "8"],
        answer: "7",
        hint: "Asia, Africa, Europe, North America, South America, Antarctica, and Australia."
    },
    {
        question: "What is the largest mammal in the world?",
        type: "multiple-choice",
        options: ["African Elephant", "Giraffe", "Blue Whale", "Hippopotamus"],
        answer: "Blue Whale",
        hint: "This marine mammal is much larger than any land animal."
    },
    {
        question: "What year did World War II end?",
        type: "multiple-choice",
        options: ["1943", "1944", "1945", "1946"],
        answer: "1945",
        hint: "It ended with Japan's surrender in the Pacific."
    },
    {
        question: "What is the smallest country in the world?",
        type: "multiple-choice",
        options: ["Monaco", "Liechtenstein", "Vatican City", "San Marino"],
        answer: "Vatican City",
        hint: "It's an independent city-state within another country."
    },
    {
        question: "How many strings does a violin have?",
        type: "multiple-choice",
        options: ["3", "4", "5", "6"],
        answer: "4",
        hint: "The main strings are E, A, D, and G."
    },
    {
        question: "What is the speed of light?",
        type: "multiple-choice",
        options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
        answer: "300,000 km/s",
        hint: "It's approximately 3 × 10^8 meters per second."
    },
    {
        question: "Who invented the telephone?",
        type: "multiple-choice",
        options: ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell", "Benjamin Franklin"],
        answer: "Alexander Graham Bell",
        hint: "This Scottish-born inventor patented it in 1876."
    },
    {
        question: "What is the highest mountain in the world?",
        type: "multiple-choice",
        options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
        answer: "Mount Everest",
        hint: "It's located in the Himalayas between Nepal and Tibet."
    }
];


function checkAnswer(userAnswer, correctAnswer) {
    if (typeof userAnswer !== 'string' || typeof correctAnswer !== 'string') return false;
    const processedAnswer = userAnswer.toLowerCase().trim();
    const processedCorrect = correctAnswer.toLowerCase().trim();
    return processedAnswer === processedCorrect;
}

function buildOptionsText(options) {
    let text = '\n';
    for (let i = 0; i < options.length; i++) {
        text += (i + 1) + ". " + options[i] + "\n";
    }
    return text;
}

function askQuestionWithTimer(currentQuestion, timeLimitSeconds) {
    const optionsText = currentQuestion.options ? buildOptionsText(currentQuestion.options) : '';
    const promptText = "Q: " + currentQuestion.question + optionsText +
        "\nEnter the option number or type the answer (Time limit: " + timeLimitSeconds + "s)";

    const start = Date.now();
    const response = prompt(promptText);
    const elapsed = (Date.now() - start) / 1000;

    if (response === null) return { cancelled: true };
    if (elapsed > timeLimitSeconds) return { timedOut: true };

    const trimmed = response.toString().trim();

    if (currentQuestion.options) {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && num >= 1 && num <= currentQuestion.options.length) {
            return { answer: currentQuestion.options[num - 1], elapsed };
        }
    }

    return { answer: trimmed, elapsed };
}

function saveHighScore(score, total) {
    const percentage = Math.round((score / total) * 1000) / 10; 
    const now = new Date().toLocaleString();
    const entry = { score, total, percentage, timestamp: now };

    const key = 'quiz_high_scores_v1';
    const raw = localStorage.getItem(key);
    const scores = raw ? JSON.parse(raw) : [];
    scores.push(entry);
    scores.sort((a, b) => b.percentage - a.percentage || b.score - a.score);
    const top = scores.slice(0, 10);
    localStorage.setItem(key, JSON.stringify(top));
    return top;
}

function viewHighScores() {
    const key = 'quiz_high_scores_v1';
    const raw = localStorage.getItem(key);
    const scores = raw ? JSON.parse(raw) : [];
    if (scores.length === 0) {
        console.log('No high scores yet. Play a game to set a record!');
        return;
    }
    console.log('===== TOP HIGH SCORES =====');
    scores.forEach((s, i) => {
        console.log((i + 1) + '. ' + s.score + '/' + s.total + ' (' + s.percentage + '%) - ' + s.timestamp);
    });
    console.log('===========================');
}

function startQuiz(options = {}) {
    const timeLimit = options.timeLimitSeconds || 15; 
    let score = 0;
    const totalQuestions = quizQuestions.length;

    alert('Welcome to the JavaScript Quiz Game!\n\nYou will be asked ' + totalQuestions + ' questions.\nYou have ' + timeLimit + ' seconds for each question.\n\nClick OK to start.');

    for (let i = 0; i < quizQuestions.length; i++) {
        const q = quizQuestions[i];
        const questionNumber = i + 1;

        const result = askQuestionWithTimer(q, timeLimit);

        if (result.cancelled) {
            alert('You cancelled the quiz. Quiz ended.\nYour score: ' + score + ' / ' + totalQuestions);
            return;
        }

        if (result.timedOut) {
            alert('Time\'s up for question ' + questionNumber + '! The correct answer was: ' + q.answer + '\nHint: ' + q.hint);
            continue;
        }

        const userAnswer = result.answer;
        const isCorrect = checkAnswer(String(userAnswer), String(q.answer));

        if (isCorrect) {
            score++;
            alert('Correct! ✓');
        } else {
            alert('Wrong! ✗\nCorrect answer: ' + q.answer + '\nHint: ' + q.hint + '\nYou answered: ' + userAnswer);
        }
    }

    const percentage = Math.round((score / totalQuestions) * 1000) / 10;
    let message = '';
    if (percentage === 100) message = 'Perfect score! You\'re a quiz master!';
    else if (percentage >= 90) message = 'Amazing! Near perfect.';
    else if (percentage >= 75) message = 'Great job!';
    else if (percentage >= 50) message = 'Not bad — keep practicing.';
    else message = 'Keep learning and try again.';

    alert('Quiz Complete!\nYour Score: ' + score + ' / ' + totalQuestions + '\nPercentage: ' + percentage + '%\n' + message);

    console.log('===== QUIZ RESULTS =====');
    console.log('Score: ' + score + ' / ' + totalQuestions);
    console.log('Percentage: ' + percentage + '%');
    console.log(message);
    console.log('========================');

    const high = saveHighScore(score, totalQuestions);
    console.log('Saved high scores (top ' + high.length + '):');
    high.forEach((h, idx) => console.log((idx + 1) + '. ' + h.score + '/' + h.total + ' (' + h.percentage + '%) - ' + h.timestamp));

    const playAgain = confirm('Would you like to play again?');
    if (playAgain) {
        startQuiz(options);
    }
}


function viewQuestions() {
    console.log("========== QUIZ QUESTIONS & ANSWERS ==========");
    for (let i = 0; i < quizQuestions.length; i++) {
        console.log((i + 1) + ". Q: " + quizQuestions[i].question);
        console.log("   A: " + quizQuestions[i].answer);
    }
    console.log("==============================================");
}


console.log("========== JAVASCRIPT QUIZ GAME ==========");
console.log("Welcome to the Browser Console Quiz Game!");
console.log("\nTo start the quiz, type: startQuiz()");
console.log("To view all questions, type: viewQuestions()");
console.log("\nThe quiz includes:");
console.log("- " + quizQuestions.length + " multiple choice/short answer questions");
console.log("- Immediate feedback after each answer");
console.log("- Score tracking throughout the game");
console.log("- Final performance evaluation");
console.log("==========================================\n");

startQuiz();
