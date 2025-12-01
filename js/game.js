/**
 * Game Core Layer — Логика игровой сессии
 * ========================================
 * Класс для управления состоянием игры и spaced repetition
 */

'use strict';

import { Utils } from './utils.js';
import { DataRepository } from './state.js';

/**
 * GameSession — Управление сессией обучения
 * Реализует алгоритм spaced repetition с буфером
 */
export class GameSession {
    /** Количество успехов для исключения элемента */
    static SUCCESS_LIMIT = 3;
    /** Размер буфера активных элементов */
    static BUFFER_SIZE = 5;
    /** Минимальный интервал между повторами (сколько других элементов показать) */
    static MIN_REPEAT_INTERVAL = 3;

    /**
     * @param {string} mode - Режим: 'letters' или 'words'
     */
    constructor(mode) {
        this.mode = mode;
        /** Все элементы для изучения (перемешанные) */
        this.allItems = Utils.shuffleArray(DataRepository.getData(mode));
        /** Map<id, {item, successCount, lastSeen}> */
        this.itemState = new Map();
        /** Текущий буфер активных элементов */
        this.activeBuffer = [];
        /** История вопросов для анализа */
        this.questionHistory = [];
        /** Текущий вопрос */
        this.currentQuestion = null;
        /** История последних показанных ID (для интервала между повторами) */
        this.recentItemIds = [];

        this._initializeItems();
        this._fillBuffer();
    }

    /**
     * Инициализировать состояние всех элементов
     * @private
     */
    _initializeItems() {
        this.allItems.forEach(item => {
            this.itemState.set(item.id, {
                item,
                successCount: 0,
                lastSeen: 0
            });
        });
    }

    /**
     * Получить элементы, которые ещё не выучены
     * @private
     * @returns {Array}
     */
    _getUnlearnedItems() {
        return this.allItems.filter(item => {
            const state = this.itemState.get(item.id);
            return state.successCount < GameSession.SUCCESS_LIMIT;
        });
    }

    /**
     * Заполнить буфер до размера BUFFER_SIZE
     * @private
     */
    _fillBuffer() {
        const unlearned = this._getUnlearnedItems();
        const notInBuffer = unlearned.filter(
            item => !this.activeBuffer.some(b => b.id === item.id)
        );

        while (this.activeBuffer.length < GameSession.BUFFER_SIZE && notInBuffer.length > 0) {
            // Выбираем элемент с наименьшим lastSeen
            notInBuffer.sort((a, b) => {
                const stateA = this.itemState.get(a.id);
                const stateB = this.itemState.get(b.id);
                return stateA.lastSeen - stateB.lastSeen;
            });
            const next = notInBuffer.shift();
            if (next) {
                this.activeBuffer.push(next);
            }
        }
    }

    /**
     * Получить случайный элемент из буфера (с интервалом между повторами)
     * @returns {Object|null}
     */
    getNextItem() {
        if (this.activeBuffer.length === 0) {
            return null;
        }

        // Фильтруем буфер, исключая недавно показанные элементы
        let candidates = this.activeBuffer;
        if (this.recentItemIds.length > 0 && this.activeBuffer.length > 1) {
            candidates = this.activeBuffer.filter(item => !this.recentItemIds.includes(item.id));
        }

        // Если после фильтрации не осталось кандидатов, берём весь буфер
        if (candidates.length === 0) {
            candidates = this.activeBuffer;
        }

        const idx = Utils.getRandomInt(0, candidates.length);
        const item = candidates[idx];
        const state = this.itemState.get(item.id);
        state.lastSeen = Date.now();
        
        // Добавляем ID в историю и ограничиваем её размер
        this.recentItemIds.push(item.id);
        if (this.recentItemIds.length > GameSession.MIN_REPEAT_INTERVAL) {
            this.recentItemIds.shift();
        }
        
        return item;
    }

    /**
     * Обработать результат ответа
     * @param {string} itemId - ID элемента
     * @param {boolean} isCorrect - Правильный ли ответ
     */
    processAnswer(itemId, isCorrect) {
        const state = this.itemState.get(itemId);
        if (!state) return;

        if (isCorrect) {
            state.successCount++;
            // Если выучен — убираем из буфера
            if (state.successCount >= GameSession.SUCCESS_LIMIT) {
                this.activeBuffer = this.activeBuffer.filter(b => b.id !== itemId);
                this._fillBuffer();
            }
        } else {
            // При ошибке сбрасываем счётчик
            state.successCount = 0;
        }

        this.questionHistory.push({
            itemId,
            isCorrect,
            timestamp: Date.now()
        });
    }

    /**
     * Проверить, завершена ли сессия
     * @returns {boolean}
     */
    isComplete() {
        return this._getUnlearnedItems().length === 0;
    }

    /**
     * Получить статистику сессии
     * @returns {Object}
     */
    getStats() {
        const total = this.allItems.length;
        const learned = this.allItems.filter(item => {
            const state = this.itemState.get(item.id);
            return state.successCount >= GameSession.SUCCESS_LIMIT;
        }).length;
        const totalQuestions = this.questionHistory.length;
        const correctAnswers = this.questionHistory.filter(q => q.isCorrect).length;

        return {
            total,
            learned,
            remaining: total - learned,
            accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
            totalQuestions
        };
    }

    /**
     * Установить текущий вопрос
     * @param {Object} question
     */
    setCurrentQuestion(question) {
        this.currentQuestion = question;
    }

    /**
     * Получить текущий вопрос
     * @returns {Object|null}
     */
    getCurrentQuestion() {
        return this.currentQuestion;
    }
}
