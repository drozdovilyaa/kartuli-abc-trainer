/**
 * App Layer — Main Application Class
 * =====================================
 * Entry point and coordination of all components
 */

'use strict';

import { Utils } from './utils.js';
import { DataRepository } from './state.js';
import { GameSession } from './game.js';
import { QuestionRendererFactory } from './questionGenerator.js';
import { UIManager } from './ui.js';
import { Logger } from './logger.js';

/**
 * App — Main Application Class
 * Coordinates all layers
 */
export class App {
    constructor() {
        /** @type {UIManager} */
        this.ui = new UIManager();
        /** @type {GameSession|null} */
        this.session = null;
        /** Timer for transitioning to next question */
        this.nextQuestionTimeout = null;
        /** Delay before next question (ms) */
        this.DELAY_NEXT_QUESTION = 1200;

        this._bindEvents();
    }

    /**
     * Bind event handlers
     * @private
     */
    _bindEvents() {
        // Event delegation via data-action
        document.addEventListener('click', (e) => {
            // Find element with data-action (could be target itself or parent)
            const actionElement = e.target.closest('[data-action]');
            if (actionElement) {
                this._handleAction(actionElement.dataset.action, actionElement);
            }

            // Handle option-btn (choice)
            const optionBtn = e.target.closest('.option-btn');
            if (optionBtn && !optionBtn.disabled) {
                this._handleChoiceAnswer(optionBtn.dataset.answer);
            }

            // Handle letter-btn (assembly)
            const letterBtn = e.target.closest('.letter-btn');
            if (letterBtn && !letterBtn.disabled) {
                const question = this.session?.getCurrentQuestion();
                const requiredLength = question?.requiredLength || null;
                this.ui.addToAssembly(letterBtn.dataset.letter, letterBtn, requiredLength);
            }

            // Handle word-btn (phrase assembly)
            const wordBtn = e.target.closest('.word-btn');
            if (wordBtn && !wordBtn.disabled) {
                const question = this.session?.getCurrentQuestion();
                const requiredLength = question?.requiredLength || null;
                this.ui.addToAssembly(wordBtn.dataset.word, wordBtn, requiredLength);
            }

            // Submit button (desktop + mobile)
            if (e.target.closest('#submit-btn') || e.target.closest('#submit-btn-mobile')) {
                this._handleSubmit();
            }

            // Clear assembly button (desktop + mobile)
            if (e.target.closest('#clear-assembly-btn') || e.target.closest('#clear-assembly-btn-mobile')) {
                this.ui.clearAssembly();
            }

            // Hint button (modal)
            const hintBtn = e.target.closest('#hint-btn');
            if (hintBtn) {
                const hintText = hintBtn.dataset.hint;
                this._showHintModal(hintText);
            }
        });

        // Handle Enter in input
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.id === 'answer-input') {
                this._handleSubmit();
            }
        });

        // Handle input change — enable/disable "Check" button
        document.addEventListener('input', (e) => {
            if (e.target.id === 'answer-input') {
                const hasValue = e.target.value.trim().length > 0;
                this.ui.updateSubmitButton(hasValue);
            }
        });

        // Track virtual keyboard on mobile
        this._setupKeyboardTracking();
    }

    /**
     * Setup keyboard tracking via visualViewport API
     * @private
     */
    _setupKeyboardTracking() {
        if (!window.visualViewport) return;

        const updateKeyboardHeight = () => {
            const keyboardHeight = window.innerHeight - window.visualViewport.height;
            
            if (keyboardHeight > 100) {
                // Keyboard is open
                document.body.classList.add('keyboard-open');
                document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
            } else {
                // Keyboard is closed
                document.body.classList.remove('keyboard-open');
                document.documentElement.style.setProperty('--keyboard-height', '0px');
            }
        };

        window.visualViewport.addEventListener('resize', updateKeyboardHeight);
        window.visualViewport.addEventListener('scroll', updateKeyboardHeight);
    }

    /**
     * Show hint modal dialog
     * @private
     */
    _showHintModal(hintText) {
        const modalBody = document.getElementById('hintModalBody');
        if (modalBody && hintText) {
            modalBody.textContent = hintText;
            const modal = new bootstrap.Modal(document.getElementById('hintModal'));
            modal.show();
        }
    }

    /**
     * Handle action
     * @param {string} action - Action name
     * @param {HTMLElement} target - Target element
     * @private
     */
    _handleAction(action, target) {
        Logger.action(`Action: ${action}`);
        
        switch (action) {
            case 'start-letters':
                this._startGame('letters');
                break;
            case 'start-words':
                this._startGame('words');
                break;
            case 'home':
                this._goHome();
                break;
            case 'next':
                this._nextQuestion();
                break;
        }
    }

    /**
     * Start game
     * @param {string} mode - Game mode
     * @private
     */
    _startGame(mode) {
        this.session = new GameSession(mode);
        Logger.sessionStarted(mode, this.session.allItems.length);
        this.ui.showScreen('game');
        Logger.screenChanged('game');
        this._nextQuestion();
    }

    /**
     * Return to home screen
     * @private
     */
    _goHome() {
        if (this.nextQuestionTimeout) {
            clearTimeout(this.nextQuestionTimeout);
            this.nextQuestionTimeout = null;
        }
        this.session = null;
        this.ui.showScreen('home');
        Logger.screenChanged('home');
    }

    /**
     * Show next question
     * @private
     */
    _nextQuestion() {
        if (!this.session) return;

        Logger.game('⏭️ Moving to next question');

        // Update progress
        const stats = this.session.getStats();
        this.ui.updateProgress(stats);
        Logger.data('Statistics', stats);

        // Check for completion
        if (this.session.isComplete()) {
            Logger.sessionEnded(stats);
            this.ui.showResults(stats);
            Logger.screenChanged('result');
            return;
        }

        // Reset assembly state
        this.ui.resetAssemblyState();

        // Get next item
        const item = this.session.getNextItem();
        if (!item) {
            Logger.sessionEnded(stats);
            this.ui.showResults(stats);
            Logger.screenChanged('result');
            return;
        }

        // Select question template
        const template = this._selectTemplate(item);
        Logger.game(`📋 Selected template: ${template}`, { itemType: item.type });
        
        // For word_assembly and translit_input templates, pick a random word
        let renderItem = item;
        if (item.type === 'letter' && (template === 'word_assembly' || template === 'translit_input')) {
            const simpleWords = DataRepository.getSimpleWords();
            renderItem = simpleWords[Utils.getRandomInt(0, simpleWords.length)];
            Logger.data('Using simple word for template', { word: renderItem });
        }
        
        const renderer = QuestionRendererFactory.getRenderer(template);

        if (renderer) {
            const questionData = renderer(renderItem, this.session.allItems, this.ui.questionContent, this.ui.answerArea);
            // Save original itemId for tracking letter progress
            questionData.itemId = item.id;
            this.session.setCurrentQuestion(questionData);
            
            Logger.questionShown(item, template, questionData);
            
            // Set action bar buttons for mobile
            if (questionData.type === 'assembly' || questionData.type === 'phrase_assembly') {
                this.ui.setActionButtons('assembly');
                this.ui.updateSubmitButton(false); // Initially disabled
            } else if (questionData.type === 'input') {
                this.ui.setActionButtons('submit');
                this.ui.updateSubmitButton(false); // Initially disabled
            } else {
                this.ui.setActionButtons(''); // choice — no buttons
            }
        }
    }

    /**
     * Select question template based on item type
     * @param {Object} item - Item for the question
     * @returns {string} - Template name
     * @private
     */
    _selectTemplate(item) {
        if (item.type === 'letter') {
            // For letters — all 6 templates per spec
            const templates = [
                'choice_geo_rus',      // Georgian → choose Russian
                'choice_rus_geo',      // Russian → choose Georgian
                'input_geo_rus',       // Georgian → input Russian
                'input_rus_geo',       // Russian → input Georgian
                'word_assembly',       // Word → assemble from Georgian letters
                'translit_input'       // Translit → input in Georgian
            ];
            return templates[Utils.getRandomInt(0, templates.length)];
        } else if (item.type === 'word') {
            // For words — choice or input translation both ways
            const templates = [
                'choice_geo_rus',      // Georgian word → choose Russian translation
                'choice_rus_geo',      // Russian word → choose Georgian translation
                'translate_input',     // Georgian word → input Russian translation
                'input_rus_geo'        // Russian word → input Georgian translation
            ];
            return templates[Utils.getRandomInt(0, templates.length)];
        } else if (item.type === 'phrase') {
            // For phrases — word assembly
            return 'phrase_assembly';
        }
        return 'choice_geo_rus';
    }

    /**
     * Handle choice answer
     * @param {string} answer - Selected answer
     * @private
     */
    _handleChoiceAnswer(answer) {
        const question = this.session?.getCurrentQuestion();
        if (!question) return;

        Logger.action('Answer option selected', { answer });

        const isCorrect = answer === question.correctAnswer;
        this.session.processAnswer(question.itemId, isCorrect);
        
        Logger.answerGiven(answer, question.correctAnswer, isCorrect);
        
        this.ui.highlightChoice(answer, question.correctAnswer, isCorrect);

        this._scheduleNextOrShowButton(isCorrect);
    }

    /**
     * Handle submit (input or assembly)
     * @private
     */
    _handleSubmit() {
        const question = this.session?.getCurrentQuestion();
        if (!question) return;

        Logger.action('"Check" button pressed', { questionType: question.type });

        let userAnswer = '';
        
        if (question.type === 'input') {
            const input = document.getElementById('answer-input');
            if (input) {
                userAnswer = input.value.trim().toLowerCase();
            }
        } else if (question.type === 'assembly') {
            userAnswer = this.ui.getAssembledAnswer('assembly');
        } else if (question.type === 'phrase_assembly') {
            userAnswer = this.ui.getAssembledAnswer('phrase_assembly');
        }

        const correctNormalized = question.correctAnswer.toLowerCase().trim();
        // For phrases, remove punctuation when comparing
        const isCorrect = question.type === 'phrase_assembly'
            ? userAnswer.replace(/[?.!,]/g, '') === correctNormalized.replace(/[?.!,]/g, '')
            : userAnswer === correctNormalized;

        Logger.answerGiven(userAnswer, question.correctAnswer, isCorrect);

        this.session.processAnswer(question.itemId, isCorrect);

        if (question.type === 'input') {
            this.ui.highlightInput(isCorrect, question.correctAnswer);
        } else {
            this.ui.highlightAssembly(isCorrect, question.correctAnswer);
        }

        this._scheduleNextOrShowButton(isCorrect);
    }

    /**
     * Auto-transition on success, show "Next" button on error
     * @param {boolean} isCorrect
     * @private
     */
    _scheduleNextOrShowButton(isCorrect) {
        if (isCorrect) {
            // On success — auto-transition after 1 sec
            Logger.game('⏱️ Auto-transition in 1.2 sec');
            this._scheduleNextQuestion();
        } else {
            // On error — show "Next" button in action bar
            Logger.game('🔘 "Next" button shown');
            this.ui.setActionButtons('next');
        }
    }

    /**
     * Schedule transition to next question
     * @private
     */
    _scheduleNextQuestion() {
        if (this.nextQuestionTimeout) {
            clearTimeout(this.nextQuestionTimeout);
        }
        this.nextQuestionTimeout = setTimeout(() => {
            this._nextQuestion();
        }, this.DELAY_NEXT_QUESTION);
    }
}
