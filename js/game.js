// Main game logic and event handlers
import { GameState } from './state.js';
import { getRandomMode, generateQuestionByMode } from './questionGenerator.js';
import { dictionary } from './data.js';
import * as UI from './ui.js';

export class Game {
    constructor() {
        this.state = new GameState();
        this.elements = null;
    }

    /**
     * Initialize the game
     */
    initialize() {
        this.elements = UI.initializeElements();
        this.setupEventListeners();
        this.startNewRound();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.elements.nextBtn.addEventListener('click', () => this.startNewRound());
    }

    /**
     * Build hint text for letter questions
     * @param {string} georgianLetter - Georgian letter
     * @param {string} russianLetter - Russian letter
     * @param {boolean} showingGeorgian - Whether we're showing Georgian letter
     * @returns {string} Hint text
     */
    buildLetterHint(georgianLetter, russianLetter, showingGeorgian) {
        const pair = dictionary.find(p => p.georgian_letter === georgianLetter);
        
        let hint = `Answer: ${showingGeorgian ? russianLetter : georgianLetter}`;
        
        if (pair && pair.comment) {
            hint += `\n\nPronunciation: ${pair.comment}`;
        }
        
        return hint;
    }

    /**
     * Start a new round
     */
    startNewRound() {
        let mode = getRandomMode(this.state);
        let question = generateQuestionByMode(mode, this.state);
        
        // If mode has no available items (all mastered), try other modes
        const attemptedModes = new Set([mode]);
        const allModes = [1, 2, 3, 4, 5];
        
        while (question === null && attemptedModes.size < allModes.length) {
            // Try another mode
            const remainingModes = allModes.filter(m => !attemptedModes.has(m));
            if (remainingModes.length === 0) break;
            
            mode = remainingModes[Math.floor(Math.random() * remainingModes.length)];
            attemptedModes.add(mode);
            question = generateQuestionByMode(mode, this.state);
        }
        
        // If all modes are mastered, show congratulations
        if (question === null) {
            this.showCongratulations();
            return;
        }
        
        this.state.setCurrentQuestion(question);
        this.displayQuestion(question);
    }

    /**
     * Show congratulations message when all items are mastered
     */
    showCongratulations() {
        const questionText = this.elements.questionText;
        questionText.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="font-size: 3em; margin-bottom: 20px;">🎉 🎓 🎉</h2>
                <h3 style="color: #4CAF50; margin-bottom: 10px;">Congratulations!</h3>
                <p style="font-size: 1.2em; margin-bottom: 20px;">
                    You've mastered all available items in all modes!
                </p>
                <p style="color: #666;">
                    Final Score: ${this.state.getScore()} / ${this.state.getTotal()}
                </p>
            </div>
        `;
        
        // Hide all other UI elements
        this.elements.wordContainer.innerHTML = '';
        this.elements.optionsContainer.innerHTML = '';
        this.elements.feedback.classList.add('hidden');
        this.elements.nextBtn.classList.add('hidden');
    }

    /**
     * Display question based on mode
     * @param {Object} question - Question object
     */
    displayQuestion(question) {
        UI.clearQuestionDisplay();
        
        switch (question.mode) {
            case 1:
                this.displayMode1(question);
                break;
            case 2:
                this.displayMode2(question);
                break;
            case 3:
                this.displayMode3(question);
                break;
            case 4:
                this.displayMode4(question);
                break;
            case 5:
                this.displayMode5(question);
                break;
        }
    }

    /**
     * Display Mode 1: Georgian letter -> Russian letter
     * @param {Object} question - Question object
     */
    displayMode1(question) {
        // Get additional info from dictionary
        const hintText = this.buildLetterHint(question.questionLetter, question.correctAnswer, true);
        UI.displayQuestionWithHint(question.questionLetter, hintText, true);
        
        // Move feedback and next button to word container
        this.elements.wordContainer.appendChild(this.elements.feedback);
        this.elements.wordContainer.appendChild(this.elements.nextBtn);
        
        UI.displayOptions(question.options, (answer) => {
            this.handleMultipleChoiceAnswer(answer, question.correctAnswer);
        });
    }

    /**
     * Display Mode 2: Russian letter -> Georgian letter
     * @param {Object} question - Question object
     */
    displayMode2(question) {
        // Get additional info from dictionary
        const hintText = this.buildLetterHint(question.correctAnswer, question.questionLetter, false);
        UI.displayQuestionWithHint(question.questionLetter, hintText, true);
        
        // Move feedback and next button to word container
        this.elements.wordContainer.appendChild(this.elements.feedback);
        this.elements.wordContainer.appendChild(this.elements.nextBtn);
        
        UI.displayOptions(question.options, (answer) => {
            this.handleMultipleChoiceAnswer(answer, question.correctAnswer);
        });
    }

    /**
     * Display Mode 3: Word translation
     * @param {Object} question - Question object
     */
    displayMode3(question) {
        const questionText = `${question.word}`;
        UI.displayQuestionWithHint(questionText, `Hint: ${question.translation}`, false);
        
        UI.displayWordMode3(
            question,
            (letter, btn) => this.handleLetterClick(letter, btn),
            () => this.handleClear(),
            () => this.handleMode3Submit()
        );
        
        UI.updateAnswerDisplay(question.userAnswer, question.correctAnswer, question.submitted);
    }

    /**
     * Display Mode 4: Type the answer
     * @param {Object} question - Question object
     */
    displayMode4(question) {
        // Get additional info from dictionary
        const isGeorgianLetter = question.direction === 'georgian-to-russian';
        let hintText;
        if (isGeorgianLetter) {
            hintText = this.buildLetterHint(question.questionLetter, question.correctAnswer, true);
        } else {
            hintText = this.buildLetterHint(question.correctAnswer, question.questionLetter, false);
        }
        // In typing mode, don't use large letter styling
        UI.displayQuestionWithHint(question.questionLetter, hintText, false);
        UI.displayTypingMode(() => this.handleTypingSubmit());
    }

    /**
     * Display Mode 5: Phrase translation (Russian -> Georgian words)
     * @param {Object} question - Question object
     */
    displayMode5(question) {
        const questionText = `${question.russianPhrase}`;
        UI.displayQuestionWithHint(questionText, `Hint: ${question.georgianPhrase}`, false);
        
        UI.displayPhraseMode5(
            question,
            (word, btn) => this.handleWordClick(word, btn),
            () => this.handleClearPhrase(),
            () => this.handleMode5Submit()
        );
        
        UI.updatePhraseAnswerDisplay(question.userAnswer, question.correctAnswer, question.submitted);
    }

    /**
     * Handle multiple choice answer (Mode 1 & 2)
     * @param {string} userAnswer - User's answer
     * @param {string} correctAnswer - Correct answer
     */
    handleMultipleChoiceAnswer(userAnswer, correctAnswer) {
        const isCorrect = userAnswer === correctAnswer;
        
        UI.highlightOptions(userAnswer, correctAnswer);
        
        // Update score
        if (isCorrect) {
            this.state.incrementScore();
        } else {
            this.state.incrementTotal();
        }
        UI.updateStats(this.state.getScore(), this.state.getTotal());
        
        // Record answer in memory system
        const question = this.state.getCurrentQuestion();
        if (question && question.itemKey) {
            this.state.recordAnswer(question.mode, question.itemKey, isCorrect);
        }
        
        UI.showFeedback(isCorrect, correctAnswer);
    }

    /**
     * Handle typing submission (Mode 4)
     */
    handleTypingSubmit() {
        const userAnswer = UI.getTypingInputValue();
        if (!userAnswer) return;
        
        const question = this.state.getCurrentQuestion();
        const correctAnswer = question.correctAnswer.toLowerCase();
        const isCorrect = userAnswer === correctAnswer;
        
        // Update score
        if (isCorrect) {
            this.state.incrementScore();
        } else {
            this.state.incrementTotal();
        }
        UI.updateStats(this.state.getScore(), this.state.getTotal());
        
        // Record answer in memory system
        if (question && question.itemKey) {
            this.state.recordAnswer(question.mode, question.itemKey, isCorrect);
        }
        
        UI.showFeedback(isCorrect, question.correctAnswer);
    }

    /**
     * Handle letter click in Mode 3
     * @param {string} letter - Clicked letter
     * @param {HTMLElement} btn - Button element
     */
    handleLetterClick(letter, btn) {
        const question = this.state.getCurrentQuestion();
        question.userAnswer.push(letter);
        btn.classList.add('used');
        btn.disabled = true;
        UI.updateAnswerDisplay(question.userAnswer, question.correctAnswer, question.submitted);
    }

    /**
     * Handle clear button in Mode 3
     */
    handleClear() {
        const question = this.state.getCurrentQuestion();
        question.userAnswer = [];
        UI.clearLetterSelection();
        UI.updateAnswerDisplay(question.userAnswer, question.correctAnswer, question.submitted);
    }

    /**
     * Handle Mode 3 submission
     */
    handleMode3Submit() {
        const question = this.state.getCurrentQuestion();
        
        if (question.submitted) return;
        if (question.userAnswer.length === 0) return;
        
        question.submitted = true;
        
        // Check if answer is correct
        const isCorrect = question.userAnswer.length === question.correctAnswer.length &&
                          question.userAnswer.every((letter, index) => letter === question.correctAnswer[index]);
        
        // Update score
        if (isCorrect) {
            this.state.incrementScore();
        } else {
            this.state.incrementTotal();
        }
        UI.updateStats(this.state.getScore(), this.state.getTotal());
        
        // Record answer in memory system
        if (question && question.itemKey) {
            this.state.recordAnswer(question.mode, question.itemKey, isCorrect);
        }
        
        // Hide controls
        UI.hideWordControls();
        
        // Update answer display
        UI.updateAnswerDisplay(question.userAnswer, question.correctAnswer, question.submitted);
        
        // Show feedback
        const correctWord = question.correctAnswer.join('');
        UI.showFeedback(isCorrect, correctWord);
    }

    /**
     * Handle word click in Mode 5
     * @param {string} word - Clicked word
     * @param {HTMLElement} btn - Button element
     */
    handleWordClick(word, btn) {
        const question = this.state.getCurrentQuestion();
        question.userAnswer.push(word);
        btn.classList.add('used');
        btn.disabled = true;
        UI.updatePhraseAnswerDisplay(question.userAnswer, question.correctAnswer, question.submitted);
    }

    /**
     * Handle clear button in Mode 5
     */
    handleClearPhrase() {
        const question = this.state.getCurrentQuestion();
        question.userAnswer = [];
        UI.clearWordSelection();
        UI.updatePhraseAnswerDisplay(question.userAnswer, question.correctAnswer, question.submitted);
    }

    /**
     * Handle Mode 5 submission
     */
    handleMode5Submit() {
        const question = this.state.getCurrentQuestion();
        
        if (question.submitted) return;
        if (question.userAnswer.length === 0) return;
        
        question.submitted = true;
        
        // Check if answer is correct
        const isCorrect = question.userAnswer.length === question.correctAnswer.length &&
                          question.userAnswer.every((word, index) => word === question.correctAnswer[index]);
        
        // Update score
        if (isCorrect) {
            this.state.incrementScore();
        } else {
            this.state.incrementTotal();
        }
        UI.updateStats(this.state.getScore(), this.state.getTotal());
        
        // Record answer in memory system
        if (question && question.itemKey) {
            this.state.recordAnswer(question.mode, question.itemKey, isCorrect);
        }
        
        // Hide controls
        UI.hideWordControls();
        
        // Update answer display
        UI.updatePhraseAnswerDisplay(question.userAnswer, question.correctAnswer, question.submitted);
        
        // Show feedback
        const correctPhrase = question.correctAnswer.join(' ');
        UI.showFeedback(isCorrect, correctPhrase);
    }
}
