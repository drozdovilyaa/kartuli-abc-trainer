// UI rendering and DOM manipulation

// DOM elements cache
let elements = null;

/**
 * Initialize DOM elements cache
 */
export function initializeElements() {
    elements = {
        questionText: document.getElementById('question-text'),
        wordContainer: document.getElementById('word-container'),
        optionsContainer: document.getElementById('options-container'),
        feedback: document.getElementById('feedback'),
        nextBtn: document.getElementById('next-btn'),
        scoreEl: document.getElementById('score'),
        totalEl: document.getElementById('total')
    };
    return elements;
}

/**
 * Get DOM elements
 */
export function getElements() {
    return elements;
}

/**
 * Update stats display
 * @param {number} score - Current score
 * @param {number} total - Total questions
 */
export function updateStats(score, total) {
    elements.scoreEl.textContent = score;
    elements.totalEl.textContent = total;
}

/**
 * Create hint button
 * @param {string} hintText - Text to show in hint
 * @returns {HTMLElement} Hint button element
 */
export function createHintButton(hintText) {
    const hintBtn = document.createElement('button');
    hintBtn.className = 'hint-btn';
    hintBtn.textContent = '?';
    hintBtn.title = 'Show hint';
    
    hintBtn.addEventListener('click', () => {
        alert(hintText);
    });
    
    return hintBtn;
}

/**
 * Clear question display
 */
export function clearQuestionDisplay() {
    elements.questionText.innerHTML = '';
    elements.wordContainer.innerHTML = '';
    elements.optionsContainer.innerHTML = '';
    elements.optionsContainer.classList.remove('word-options');
    elements.nextBtn.classList.add('hidden');
    elements.feedback.classList.add('hidden');
}

/**
 * Display question with hint
 * @param {string} letterText - Letter to display
 * @param {string} hintText - Hint text
 * @param {boolean} isGeorgianLetter - Whether the letter is Georgian (for styling)
 */
export function displayQuestionWithHint(letterText, hintText, isGeorgianLetter = false) {
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-with-hint';
    
    const letterSpan = document.createElement('span');
    letterSpan.textContent = letterText;
    
    const hintBtn = createHintButton(hintText);
    
    questionContainer.appendChild(letterSpan);
    questionContainer.appendChild(hintBtn);
    elements.questionText.appendChild(questionContainer);
}

/**
 * Display multiple choice options
 * @param {Array} options - Array of option strings
 * @param {Function} onSelect - Callback when option is selected
 */
export function displayOptions(options, onSelect) {
    elements.optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => {
            if (!btn.disabled) {
                onSelect(option);
            }
        });
        elements.optionsContainer.appendChild(btn);
    });
}

/**
 * Highlight correct/incorrect options
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 */
export function highlightOptions(userAnswer, correctAnswer) {
    const buttons = elements.optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.textContent === userAnswer && userAnswer !== correctAnswer) {
            btn.classList.add('incorrect');
        }
    });
}

/**
 * Show feedback message
 * @param {boolean} isCorrect - Whether answer was correct
 * @param {string} correctAnswer - The correct answer
 */
export function showFeedback(isCorrect, correctAnswer) {
    elements.feedback.classList.remove('hidden', 'correct', 'incorrect');
    
    if (isCorrect) {
        elements.feedback.classList.add('correct');
        elements.feedback.textContent = '✓ Correct!';
    } else {
        elements.feedback.classList.add('incorrect');
        elements.feedback.textContent = `✗ Incorrect. The correct answer is: ${correctAnswer}`;
    }
    
    elements.nextBtn.classList.remove('hidden');
}

/**
 * Display typing mode input
 * @param {Function} onSubmit - Callback when form is submitted
 */
export function displayTypingMode(onSubmit) {
    elements.wordContainer.innerHTML = '';
    
    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'typing-container';
    
    const inputLabel = document.createElement('div');
    inputLabel.className = 'typing-label';
    inputLabel.textContent = 'Type the answer:';
    
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.className = 'typing-input';
    inputField.id = 'typing-input';
    inputField.placeholder = 'Enter letter(s)...';
    inputField.autocomplete = 'off';
    
    // Submit on Enter key
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    });
    
    inputContainer.appendChild(inputLabel);
    inputContainer.appendChild(inputField);
    elements.wordContainer.appendChild(inputContainer);
    
    // Add submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'control-btn submit-btn';
    submitBtn.textContent = 'Submit';
    submitBtn.addEventListener('click', onSubmit);
    elements.wordContainer.appendChild(submitBtn);
    
    // Move feedback and next button to word container
    elements.wordContainer.appendChild(elements.feedback);
    elements.wordContainer.appendChild(elements.nextBtn);
    
    // Focus the input field
    setTimeout(() => inputField.focus(), 100);
}

/**
 * Get typing input value and disable input
 * @returns {string|null} Input value or null
 */
export function getTypingInputValue() {
    const inputField = document.getElementById('typing-input');
    if (!inputField) return null;
    
    const value = inputField.value.trim().toLowerCase();
    
    // Don't proceed if empty
    if (!value) return null;
    
    // Disable input and button
    inputField.disabled = true;
    const submitBtn = elements.wordContainer.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.display = 'none';
    }
    
    return value;
}

/**
 * Display Mode 3 word interface
 * @param {Object} question - Question object
 * @param {Function} onLetterClick - Callback when letter is clicked
 * @param {Function} onClear - Callback when clear is clicked
 * @param {Function} onSubmit - Callback when submit is clicked
 */
export function displayWordMode3(question, onLetterClick, onClear, onSubmit) {
    elements.wordContainer.innerHTML = '';
    
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
    
    answerArea.appendChild(answerLabel);
    answerArea.appendChild(answerDisplay);
    elements.wordContainer.appendChild(answerArea);
    
    // Move feedback to word container
    elements.wordContainer.appendChild(elements.feedback);
    
    // Create letter pool
    const poolLabel = document.createElement('div');
    poolLabel.className = 'pool-label';
    poolLabel.textContent = 'Select letters in order:';
    elements.wordContainer.appendChild(poolLabel);
    
    elements.optionsContainer.innerHTML = '';
    question.letterPool.forEach((letter, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn letter-pool-btn';
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.dataset.index = index;
        
        btn.addEventListener('click', () => {
            if (!question.submitted && !btn.classList.contains('used')) {
                onLetterClick(letter, btn);
            }
        });
        
        elements.optionsContainer.appendChild(btn);
    });
    
    // Create control buttons
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'word-controls';
    controlsDiv.id = 'word-controls';
    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'control-btn clear-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', onClear);
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'control-btn submit-btn';
    submitBtn.id = 'submit-btn';
    submitBtn.textContent = 'Submit';
    submitBtn.addEventListener('click', onSubmit);
    
    controlsDiv.appendChild(clearBtn);
    controlsDiv.appendChild(submitBtn);
    elements.wordContainer.appendChild(controlsDiv);
    
    // Add next button to word container
    elements.wordContainer.appendChild(elements.nextBtn);
}

/**
 * Update answer display for Mode 3
 * @param {Array} userAnswer - User's current answer
 * @param {Array} correctAnswer - Correct answer
 * @param {boolean} submitted - Whether answer has been submitted
 */
export function updateAnswerDisplay(userAnswer, correctAnswer, submitted) {
    const answerDisplay = document.getElementById('answer-display');
    if (!answerDisplay) return;
    
    answerDisplay.innerHTML = '';
    
    if (userAnswer.length === 0) {
        answerDisplay.textContent = '(click letters below)';
        answerDisplay.style.opacity = '0.5';
    } else {
        answerDisplay.style.opacity = '1';
        userAnswer.forEach((letter, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'answer-letter';
            letterSpan.textContent = letter;
            
            if (submitted) {
                if (letter === correctAnswer[index]) {
                    letterSpan.classList.add('correct');
                } else {
                    letterSpan.classList.add('incorrect');
                }
            }
            
            answerDisplay.appendChild(letterSpan);
        });
    }
}

/**
 * Clear letter selection in Mode 3
 */
export function clearLetterSelection() {
    const buttons = elements.optionsContainer.querySelectorAll('.letter-pool-btn');
    buttons.forEach(btn => {
        btn.classList.remove('used');
        btn.disabled = false;
    });
}

/**
 * Hide word controls
 */
export function hideWordControls() {
    const controlsDiv = document.getElementById('word-controls');
    if (controlsDiv) {
        controlsDiv.style.display = 'none';
    }
}

/**
 * Display Mode 5 phrase interface (Russian phrase -> Select Georgian words)
 * @param {Object} question - Question object
 * @param {Function} onWordClick - Callback when word is clicked
 * @param {Function} onClear - Callback when clear is clicked
 * @param {Function} onSubmit - Callback when submit is clicked
 */
export function displayPhraseMode5(question, onWordClick, onClear, onSubmit) {
    elements.wordContainer.innerHTML = '';
    
    // Create user answer display area
    const answerArea = document.createElement('div');
    answerArea.className = 'word-answer-area phrase-answer-area';
    answerArea.id = 'answer-area';
    
    const answerLabel = document.createElement('div');
    answerLabel.className = 'answer-label';
    answerLabel.textContent = 'Your translation:';
    
    const answerDisplay = document.createElement('div');
    answerDisplay.className = 'answer-display phrase-answer-display';
    answerDisplay.id = 'answer-display';
    
    answerArea.appendChild(answerLabel);
    answerArea.appendChild(answerDisplay);
    elements.wordContainer.appendChild(answerArea);
    
    // Move feedback to word container
    elements.wordContainer.appendChild(elements.feedback);
    
    // Create word pool
    const poolLabel = document.createElement('div');
    poolLabel.className = 'pool-label';
    poolLabel.textContent = 'Select Georgian words in order:';
    elements.wordContainer.appendChild(poolLabel);
    
    elements.optionsContainer.innerHTML = '';
    elements.optionsContainer.classList.add('word-options');
    question.wordPool.forEach((word, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn word-pool-btn';
        btn.textContent = word;
        btn.dataset.word = word;
        btn.dataset.index = index;
        
        btn.addEventListener('click', () => {
            if (!question.submitted && !btn.classList.contains('used')) {
                onWordClick(word, btn);
            }
        });
        
        elements.optionsContainer.appendChild(btn);
    });
    
    // Create control buttons
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'word-controls';
    controlsDiv.id = 'word-controls';
    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'control-btn clear-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', onClear);
    
    const submitBtn = document.createElement('button');
    submitBtn.className = 'control-btn submit-btn';
    submitBtn.id = 'submit-btn';
    submitBtn.textContent = 'Submit';
    submitBtn.addEventListener('click', onSubmit);
    
    controlsDiv.appendChild(clearBtn);
    controlsDiv.appendChild(submitBtn);
    elements.wordContainer.appendChild(controlsDiv);
    
    // Add next button to word container
    elements.wordContainer.appendChild(elements.nextBtn);
}

/**
 * Update phrase answer display for Mode 5
 * @param {Array} userAnswer - User's current answer (array of words)
 * @param {Array} correctAnswer - Correct answer (array of words)
 * @param {boolean} submitted - Whether answer has been submitted
 */
export function updatePhraseAnswerDisplay(userAnswer, correctAnswer, submitted) {
    const answerDisplay = document.getElementById('answer-display');
    if (!answerDisplay) return;
    
    answerDisplay.innerHTML = '';
    
    if (userAnswer.length === 0) {
        answerDisplay.textContent = '(click words below)';
        answerDisplay.style.opacity = '0.5';
    } else {
        answerDisplay.style.opacity = '1';
        userAnswer.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'answer-word';
            wordSpan.textContent = word;
            
            if (submitted) {
                if (word === correctAnswer[index]) {
                    wordSpan.classList.add('correct');
                } else {
                    wordSpan.classList.add('incorrect');
                }
            }
            
            answerDisplay.appendChild(wordSpan);
            
            // Add space between words (except after last word)
            if (index < userAnswer.length - 1) {
                const space = document.createElement('span');
                space.className = 'word-space';
                space.textContent = ' ';
                answerDisplay.appendChild(space);
            }
        });
    }
}

/**
 * Clear word selection in Mode 5
 */
export function clearWordSelection() {
    const buttons = elements.optionsContainer.querySelectorAll('.word-pool-btn');
    buttons.forEach(btn => {
        btn.classList.remove('used');
        btn.disabled = false;
    });
}
