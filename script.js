// Dictionary of Georgian-Russian letter pairs
const dictionary = [
    { georgian_letter: "ა", russian_letter: "a", comment: "" },
    { georgian_letter: "ბ", russian_letter: "b", comment: "" },
    { georgian_letter: "გ", russian_letter: "g", comment: "" },
    { georgian_letter: "დ", russian_letter: "d", comment: "" },
    { georgian_letter: "ე", russian_letter: "e", comment: "" },
    { georgian_letter: "ვ", russian_letter: "v", comment: "" },
    { georgian_letter: "ზ", russian_letter: "z", comment: "" },
    { georgian_letter: "თ", russian_letter: "t", comment: "" },
    { georgian_letter: "ი", russian_letter: "i", comment: "" },
    { georgian_letter: "კ", russian_letter: "k", comment: "" },
    { georgian_letter: "ლ", russian_letter: "l", comment: "" },
    { georgian_letter: "მ", russian_letter: "m", comment: "" },
    { georgian_letter: "ნ", russian_letter: "n", comment: "" },
    { georgian_letter: "ო", russian_letter: "o", comment: "" },
    { georgian_letter: "პ", russian_letter: "p", comment: "" },
    { georgian_letter: "ჟ", russian_letter: "zh", comment: "" },
    { georgian_letter: "რ", russian_letter: "r", comment: "" },
    { georgian_letter: "ს", russian_letter: "s", comment: "" },
    { georgian_letter: "ტ", russian_letter: "t'", comment: "" },
    { georgian_letter: "უ", russian_letter: "u", comment: "" },
    { georgian_letter: "ფ", russian_letter: "p'", comment: "" },
    { georgian_letter: "ქ", russian_letter: "k'", comment: "" },
    { georgian_letter: "ღ", russian_letter: "gh", comment: "" },
    { georgian_letter: "ყ", russian_letter: "q", comment: "" },
    { georgian_letter: "შ", russian_letter: "sh", comment: "" },
    { georgian_letter: "ჩ", russian_letter: "ch", comment: "" },
    { georgian_letter: "ც", russian_letter: "ts", comment: "" },
    { georgian_letter: "ძ", russian_letter: "dz", comment: "" },
    { georgian_letter: "წ", russian_letter: "ts'", comment: "" },
    { georgian_letter: "ჭ", russian_letter: "ch'", comment: "" },
    { georgian_letter: "ხ", russian_letter: "kh", comment: "" },
    { georgian_letter: "ჯ", russian_letter: "j", comment: "" },
    { georgian_letter: "ჰ", russian_letter: "h", comment: "" }
];

// List of Georgian words for Mode 3
const georgianWords = [
    "მამა",     // mama (father)
    "დედა",     // deda (mother)
    "სახლი",    // sakhli (house)
    "წიგნი",    // ts'igni (book)
    "ქალაქი",   // k'alak'i (city)
    "მთა",      // mta (mountain)
    "თბილისი",  // tbilisi
    "საქართველო" // sak'art'velo (Georgia)
];

// Game state
let score = 0;
let total = 0;
let currentMode = null;
let currentQuestion = null;
let currentWordTasks = [];

// DOM elements
const questionText = document.getElementById('question-text');
const wordContainer = document.getElementById('word-container');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');

// Utility function to get random element from array
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Utility function to get random elements from array (excluding specific items)
function getRandomElements(array, count, exclude = []) {
    const filtered = array.filter(item => !exclude.includes(item));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Generate random mode (1, 2, or 3)
function getRandomMode() {
    return Math.floor(Math.random() * 3) + 1;
}

// Mode 1: Show Georgian letter, pick Russian letter
function generateMode1Question() {
    const correctPair = getRandomElement(dictionary);
    const incorrectPairs = getRandomElements(
        dictionary,
        3,
        [correctPair]
    );
    
    const options = [correctPair, ...incorrectPairs].sort(() => Math.random() - 0.5);
    
    return {
        mode: 1,
        questionLetter: correctPair.georgian_letter,
        correctAnswer: correctPair.russian_letter,
        options: options.map(pair => pair.russian_letter)
    };
}

// Mode 2: Show Russian letter, pick Georgian letter
function generateMode2Question() {
    const correctPair = getRandomElement(dictionary);
    const incorrectPairs = getRandomElements(
        dictionary,
        3,
        [correctPair]
    );
    
    const options = [correctPair, ...incorrectPairs].sort(() => Math.random() - 0.5);
    
    return {
        mode: 2,
        questionLetter: correctPair.russian_letter,
        correctAnswer: correctPair.georgian_letter,
        options: options.map(pair => pair.georgian_letter)
    };
}

// Mode 3: Show Georgian word, select Russian letters in correct order
function generateMode3Question() {
    const word = getRandomElement(georgianWords);
    const correctAnswer = [];
    
    // Build the correct answer
    for (let georgianLetter of word) {
        const correctPair = dictionary.find(pair => pair.georgian_letter === georgianLetter);
        if (correctPair) {
            correctAnswer.push(correctPair.russian_letter);
        }
    }
    
    // Create pool of letters: correct ones + some random ones
    const letterPool = [...correctAnswer];
    const numRandomLetters = Math.min(8, dictionary.length - correctAnswer.length);
    const usedPairs = correctAnswer.map(letter => 
        dictionary.find(pair => pair.russian_letter === letter)
    );
    const randomPairs = getRandomElements(dictionary, numRandomLetters, usedPairs);
    randomPairs.forEach(pair => letterPool.push(pair.russian_letter));
    
    // Shuffle the pool
    const shuffledPool = [...letterPool].sort(() => Math.random() - 0.5);
    
    return {
        mode: 3,
        word: word,
        correctAnswer: correctAnswer,
        letterPool: shuffledPool,
        userAnswer: [],
        submitted: false
    };
}

// Generate new question based on random mode
function generateNewQuestion() {
    const mode = getRandomMode();
    
    if (mode === 1) {
        return generateMode1Question();
    } else if (mode === 2) {
        return generateMode2Question();
    } else {
        return generateMode3Question();
    }
}

// Display question based on mode
function displayQuestion(question) {
    currentQuestion = question;
    questionText.innerHTML = '';
    wordContainer.innerHTML = '';
    optionsContainer.innerHTML = '';
    nextBtn.classList.add('hidden');
    feedback.classList.add('hidden');
    
    if (question.mode === 1 || question.mode === 2) {
        questionText.textContent = question.questionLetter;
        // Move feedback and next button to word container for Mode 1 and 2
        wordContainer.appendChild(feedback);
        wordContainer.appendChild(nextBtn);
        displayOptions(question.options, (answer) => handleAnswer(answer, question.correctAnswer));
    } else if (question.mode === 3) {
        questionText.textContent = `Translate the word: ${question.word}`;
        displayWordMode3();
    }
}

// Display options for Mode 1 and 2
function displayOptions(options, onSelect) {
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => {
            if (!btn.disabled) {
                onSelect(option);
            }
        });
        optionsContainer.appendChild(btn);
    });
}

// Display Mode 3: Word translation with letter pool
function displayWordMode3() {
    wordContainer.innerHTML = '';
    
    // Create user answer display area
    const answerArea = document.createElement('div');
    answerArea.className = 'word-answer-area';
    answerArea.id = 'answer-area';
    
    const answerLabel = document.createElement('div');
    answerLabel.className = 'answer-label';
    answerLabel.textContent = 'Your answer:';
    
    const answerDisplay = document.createElement('div');
    answerDisplay.className = 'answer-display';
    answerDisplay.id = 'answer-display';
    updateAnswerDisplay();
    
    answerArea.appendChild(answerLabel);
    answerArea.appendChild(answerDisplay);
    wordContainer.appendChild(answerArea);
    
    // Move feedback to word container (will be hidden initially)
    wordContainer.appendChild(feedback);
    
    // Create letter pool
    const poolLabel = document.createElement('div');
    poolLabel.className = 'pool-label';
    poolLabel.textContent = 'Select letters in order:';
    wordContainer.appendChild(poolLabel);
    
    optionsContainer.innerHTML = '';
    currentQuestion.letterPool.forEach((letter, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn letter-pool-btn';
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.dataset.index = index;
        
        btn.addEventListener('click', () => {
            if (!currentQuestion.submitted && !btn.classList.contains('used')) {
                currentQuestion.userAnswer.push(letter);
                btn.classList.add('used');
                btn.disabled = true;
                updateAnswerDisplay();
            }
        });
        
        optionsContainer.appendChild(btn);
    });
    
    // Create control buttons
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'word-controls';
    controlsDiv.id = 'word-controls';
    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'control-btn clear-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => {
        currentQuestion.userAnswer = [];
        const buttons = optionsContainer.querySelectorAll('.letter-pool-btn');
        buttons.forEach(btn => {
            btn.classList.remove('used');
            btn.disabled = false;
        });
        updateAnswerDisplay();
    });
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'control-btn submit-btn';
    submitBtn.id = 'submit-btn';
    submitBtn.textContent = 'Submit';
    submitBtn.addEventListener('click', handleMode3Submit);
    
    controlsDiv.appendChild(clearBtn);
    controlsDiv.appendChild(submitBtn);
    wordContainer.appendChild(controlsDiv);
    
    // Add next button to word container (hidden initially)
    wordContainer.appendChild(nextBtn);
}

// Update the answer display for Mode 3
function updateAnswerDisplay() {
    const answerDisplay = document.getElementById('answer-display');
    if (!answerDisplay) return;
    
    answerDisplay.innerHTML = '';
    
    if (currentQuestion.userAnswer.length === 0) {
        answerDisplay.textContent = '(click letters below)';
        answerDisplay.style.opacity = '0.5';
    } else {
        answerDisplay.style.opacity = '1';
        currentQuestion.userAnswer.forEach((letter, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'answer-letter';
            letterSpan.textContent = letter;
            
            if (currentQuestion.submitted) {
                if (letter === currentQuestion.correctAnswer[index]) {
                    letterSpan.classList.add('correct');
                } else {
                    letterSpan.classList.add('incorrect');
                }
            }
            
            answerDisplay.appendChild(letterSpan);
        });
    }
}

// Handle Mode 3 submission
function handleMode3Submit() {
    if (currentQuestion.submitted) return;
    if (currentQuestion.userAnswer.length === 0) return;
    
    currentQuestion.submitted = true;
    
    // Check if answer is correct
    const isCorrect = currentQuestion.userAnswer.length === currentQuestion.correctAnswer.length &&
                      currentQuestion.userAnswer.every((letter, index) => letter === currentQuestion.correctAnswer[index]);
    
    // Update score
    total++;
    if (isCorrect) {
        score++;
    }
    updateStats();
    
    // Hide Clear and Submit buttons
    const controlsDiv = document.getElementById('word-controls');
    if (controlsDiv) {
        controlsDiv.style.display = 'none';
    }
    
    // Update answer display to show correct/incorrect
    updateAnswerDisplay();
    
    // Show feedback
    const correctWord = currentQuestion.correctAnswer.join('');
    showFeedback(isCorrect, correctWord);
}

// Handle answer for Mode 1 and 2
function handleAnswer(userAnswer, correctAnswer) {
    const isCorrect = userAnswer === correctAnswer;
    
    // Disable all buttons
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.textContent === userAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Update score
    total++;
    if (isCorrect) {
        score++;
    }
    updateStats();
    
    // Show feedback
    showFeedback(isCorrect, correctAnswer);
}

// Show feedback message
function showFeedback(isCorrect, correctAnswer) {
    feedback.classList.remove('hidden', 'correct', 'incorrect');
    
    if (isCorrect) {
        feedback.classList.add('correct');
        feedback.textContent = '✓ Correct!';
    } else {
        feedback.classList.add('incorrect');
        feedback.textContent = `✗ Incorrect. The correct answer is: ${correctAnswer}`;
    }
    
    nextBtn.classList.remove('hidden');
}

// Update stats display
function updateStats() {
    scoreEl.textContent = score;
    totalEl.textContent = total;
}

// Start new round
function startNewRound() {
    const question = generateNewQuestion();
    displayQuestion(question);
}

// Event listeners
nextBtn.addEventListener('click', startNewRound);

// Initialize game
startNewRound();
