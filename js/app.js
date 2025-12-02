/**
 * App Layer — Главный класс приложения
 * =====================================
 * Точка входа и координация всех компонентов
 */

'use strict';

import { Utils } from './utils.js';
import { DataRepository } from './state.js';
import { GameSession } from './game.js';
import { QuestionRendererFactory } from './questionGenerator.js';
import { UIManager } from './ui.js';
import { Logger } from './logger.js';

/**
 * App — Главный класс приложения
 * Координирует работу всех слоёв
 */
export class App {
    constructor() {
        /** @type {UIManager} */
        this.ui = new UIManager();
        /** @type {GameSession|null} */
        this.session = null;
        /** Таймер для перехода к следующему вопросу */
        this.nextQuestionTimeout = null;
        /** Задержка перед следующим вопросом (мс) */
        this.DELAY_NEXT_QUESTION = 1200;

        this._bindEvents();
    }

    /**
     * Привязать обработчики событий
     * @private
     */
    _bindEvents() {
        // Делегирование событий через data-action
        document.addEventListener('click', (e) => {
            // Ищем элемент с data-action (может быть сам target или родитель)
            const actionElement = e.target.closest('[data-action]');
            if (actionElement) {
                this._handleAction(actionElement.dataset.action, actionElement);
            }

            // Обработка option-btn (choice)
            const optionBtn = e.target.closest('.option-btn');
            if (optionBtn && !optionBtn.disabled) {
                this._handleChoiceAnswer(optionBtn.dataset.answer);
            }

            // Обработка letter-btn (assembly)
            const letterBtn = e.target.closest('.letter-btn');
            if (letterBtn && !letterBtn.disabled) {
                const question = this.session?.getCurrentQuestion();
                const requiredLength = question?.requiredLength || null;
                this.ui.addToAssembly(letterBtn.dataset.letter, letterBtn, requiredLength);
            }

            // Обработка word-btn (phrase assembly)
            const wordBtn = e.target.closest('.word-btn');
            if (wordBtn && !wordBtn.disabled) {
                const question = this.session?.getCurrentQuestion();
                const requiredLength = question?.requiredLength || null;
                this.ui.addToAssembly(wordBtn.dataset.word, wordBtn, requiredLength);
            }

            // Кнопка проверки (desktop + mobile)
            if (e.target.closest('#submit-btn') || e.target.closest('#submit-btn-mobile')) {
                this._handleSubmit();
            }

            // Кнопка очистки сборки (desktop + mobile)
            if (e.target.closest('#clear-assembly-btn') || e.target.closest('#clear-assembly-btn-mobile')) {
                this.ui.clearAssembly();
            }

            // Кнопка показа подсказки (модалка)
            const hintBtn = e.target.closest('#hint-btn');
            if (hintBtn) {
                const hintText = hintBtn.dataset.hint;
                this._showHintModal(hintText);
            }
        });

        // Обработка Enter в input
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.id === 'answer-input') {
                this._handleSubmit();
            }
        });

        // Обработка ввода в input — включение/выключение кнопки "Проверить"
        document.addEventListener('input', (e) => {
            if (e.target.id === 'answer-input') {
                const hasValue = e.target.value.trim().length > 0;
                this.ui.updateSubmitButton(hasValue);
            }
        });

        // Отслеживание виртуальной клавиатуры на мобильных
        this._setupKeyboardTracking();
    }

    /**
     * Настройка отслеживания клавиатуры через visualViewport API
     * @private
     */
    _setupKeyboardTracking() {
        if (!window.visualViewport) return;

        const updateKeyboardHeight = () => {
            const keyboardHeight = window.innerHeight - window.visualViewport.height;
            
            if (keyboardHeight > 100) {
                // Клавиатура открыта
                document.body.classList.add('keyboard-open');
                document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
            } else {
                // Клавиатура закрыта
                document.body.classList.remove('keyboard-open');
                document.documentElement.style.setProperty('--keyboard-height', '0px');
            }
        };

        window.visualViewport.addEventListener('resize', updateKeyboardHeight);
        window.visualViewport.addEventListener('scroll', updateKeyboardHeight);
    }

    /**
     * Показать модальное окно с подсказкой
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
     * Обработать действие
     * @param {string} action - Название действия
     * @param {HTMLElement} target - Целевой элемент
     * @private
     */
    _handleAction(action, target) {
        Logger.action(`Действие: ${action}`);
        
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
     * Начать игру
     * @param {string} mode - Режим игры
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
     * Вернуться на главный экран
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
     * Показать следующий вопрос
     * @private
     */
    _nextQuestion() {
        if (!this.session) return;

        Logger.game('⏭️ Переход к следующему вопросу');

        // Обновляем прогресс
        const stats = this.session.getStats();
        this.ui.updateProgress(stats);
        Logger.data('Статистика', stats);

        // Проверяем завершение
        if (this.session.isComplete()) {
            Logger.sessionEnded(stats);
            this.ui.showResults(stats);
            Logger.screenChanged('result');
            return;
        }

        // Сбрасываем состояние сборки
        this.ui.resetAssemblyState();

        // Получаем следующий элемент
        const item = this.session.getNextItem();
        if (!item) {
            Logger.sessionEnded(stats);
            this.ui.showResults(stats);
            Logger.screenChanged('result');
            return;
        }

        // Выбираем шаблон вопроса
        const template = this._selectTemplate(item);
        Logger.game(`📋 Выбран шаблон: ${template}`, { itemType: item.type });
        
        // Для шаблонов word_assembly и translit_input берём случайное слово
        let renderItem = item;
        if (item.type === 'letter' && (template === 'word_assembly' || template === 'translit_input')) {
            const simpleWords = DataRepository.getSimpleWords();
            renderItem = simpleWords[Utils.getRandomInt(0, simpleWords.length)];
            Logger.data('Использовано простое слово для шаблона', { word: renderItem });
        }
        
        const renderer = QuestionRendererFactory.getRenderer(template);

        if (renderer) {
            const questionData = renderer(renderItem, this.session.allItems, this.ui.questionContent, this.ui.answerArea);
            // Сохраняем оригинальный itemId для учёта прогресса буквы
            questionData.itemId = item.id;
            this.session.setCurrentQuestion(questionData);
            
            Logger.questionShown(item, template, questionData);
            
            // Устанавливаем кнопки в action bar для мобильных
            if (questionData.type === 'assembly' || questionData.type === 'phrase_assembly') {
                this.ui.setActionButtons('assembly');
                this.ui.updateSubmitButton(false); // Изначально выключена
            } else if (questionData.type === 'input') {
                this.ui.setActionButtons('submit');
                this.ui.updateSubmitButton(false); // Изначально выключена
            } else {
                this.ui.setActionButtons(''); // choice — без кнопок
            }
        }
    }

    /**
     * Выбрать шаблон вопроса в зависимости от типа элемента
     * @param {Object} item - Элемент для вопроса
     * @returns {string} - Название шаблона
     * @private
     */
    _selectTemplate(item) {
        if (item.type === 'letter') {
            // Для букв — все 6 шаблонов по ТЗ
            const templates = [
                'choice_geo_rus',      // Грузинская → выбор русской
                'choice_rus_geo',      // Русская → выбор грузинской
                'input_geo_rus',       // Грузинская → ввод русской
                'input_rus_geo',       // Русская → ввод грузинской
                'word_assembly',       // Слово → сборка из грузинских букв
                'translit_input'       // Транслит → ввод грузинскими
            ];
            return templates[Utils.getRandomInt(0, templates.length)];
        } else if (item.type === 'word') {
            // Для слов — только перевод
            return 'translate_input';
        } else if (item.type === 'phrase') {
            // Для фраз — сборка из слов
            return 'phrase_assembly';
        }
        return 'choice_geo_rus';
    }

    /**
     * Обработать ответ choice
     * @param {string} answer - Выбранный ответ
     * @private
     */
    _handleChoiceAnswer(answer) {
        const question = this.session?.getCurrentQuestion();
        if (!question) return;

        Logger.action('Выбран вариант ответа', { answer });

        const isCorrect = answer === question.correctAnswer;
        this.session.processAnswer(question.itemId, isCorrect);
        
        Logger.answerGiven(answer, question.correctAnswer, isCorrect);
        
        this.ui.highlightChoice(answer, question.correctAnswer, isCorrect);

        this._scheduleNextOrShowButton(isCorrect);
    }

    /**
     * Обработать submit (input или assembly)
     * @private
     */
    _handleSubmit() {
        const question = this.session?.getCurrentQuestion();
        if (!question) return;

        Logger.action('Нажата кнопка "Проверить"', { questionType: question.type });

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
        // Для фраз убираем пунктуацию при сравнении
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
     * Авто-переход при успехе, кнопка "Далее" при ошибке
     * @param {boolean} isCorrect
     * @private
     */
    _scheduleNextOrShowButton(isCorrect) {
        if (isCorrect) {
            // При успехе — авто-переход через 1 сек
            Logger.game('⏱️ Авто-переход через 1.2 сек');
            this._scheduleNextQuestion();
        } else {
            // При ошибке — показать кнопку "Далее" в action bar
            Logger.game('🔘 Показана кнопка "Далее"');
            this.ui.setActionButtons('next');
        }
    }

    /**
     * Запланировать переход к следующему вопросу
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
