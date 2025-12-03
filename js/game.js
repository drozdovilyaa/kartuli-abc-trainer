/**
 * Game Core Layer — Game Session Logic
 * ========================================
 * Class for managing game state and spaced repetition
 */

'use strict';

import { Utils } from './utils.js';
import { DataRepository } from './state.js';
import { Logger } from './logger.js';

/**
 * GameSession — Learning Session Management
 * Implements spaced repetition algorithm with buffer
 */
export class GameSession {
    /** Number of successes to exclude an item */
    static SUCCESS_LIMIT = 3;
    /** Size of active items buffer */
    static BUFFER_SIZE = 10;
    /** Minimum interval between repeats (how many other items to show) */
    static MIN_REPEAT_INTERVAL = 5;

    /**
     * @param {string} mode - Mode: 'letters' or 'words'
     */
    constructor(mode) {
        this.mode = mode;
        /** All items for learning (shuffled) */
        this.allItems = Utils.shuffleArray(DataRepository.getData(mode));
        /** Map<id, {item, successCount, lastSeen}> */
        this.itemState = new Map();
        /** Current buffer of active items */
        this.activeBuffer = [];
        /** Question history for analysis */
        this.questionHistory = [];
        /** Current question */
        this.currentQuestion = null;
        /** History of recently shown IDs (for repeat interval) */
        this.recentItemIds = [];

        this._initializeItems();
        this._fillBuffer();
        
        Logger.data('Session initialized', {
            mode,
            totalItems: this.allItems.length,
            bufferSize: this.activeBuffer.length
        });
    }

    /**
     * Initialize state for all items
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
     * Get items that are not yet learned
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
     * Fill buffer up to BUFFER_SIZE
     * @private
     */
    _fillBuffer() {
        const unlearned = this._getUnlearnedItems();
        const notInBuffer = unlearned.filter(
            item => !this.activeBuffer.some(b => b.id === item.id)
        );

        while (this.activeBuffer.length < GameSession.BUFFER_SIZE && notInBuffer.length > 0) {
            // Select item with lowest lastSeen
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
     * Get random item from buffer (with repeat interval)
     * @returns {Object|null}
     */
    getNextItem() {
        if (this.activeBuffer.length === 0) {
            return null;
        }

        // Filter buffer, excluding recently shown items
        let candidates = this.activeBuffer;
        if (this.recentItemIds.length > 0 && this.activeBuffer.length > 1) {
            candidates = this.activeBuffer.filter(item => !this.recentItemIds.includes(item.id));
        }

        // If no candidates after filtering, use entire buffer
        if (candidates.length === 0) {
            candidates = this.activeBuffer;
        }

        const idx = Utils.getRandomInt(0, candidates.length);
        const item = candidates[idx];
        const state = this.itemState.get(item.id);
        state.lastSeen = Date.now();
        
        // Add ID to history and limit its size
        this.recentItemIds.push(item.id);
        if (this.recentItemIds.length > GameSession.MIN_REPEAT_INTERVAL) {
            this.recentItemIds.shift();
        }
        
        Logger.nextItemSelected(item, candidates, [...this.recentItemIds]);
        
        return item;
    }

    /**
     * Process answer result
     * @param {string} itemId - Item ID
     * @param {boolean} isCorrect - Whether answer is correct
     */
    processAnswer(itemId, isCorrect) {
        const state = this.itemState.get(itemId);
        if (!state) return;

        const oldCount = state.successCount;

        if (isCorrect) {
            state.successCount++;
            // If learned — remove from buffer
            if (state.successCount >= GameSession.SUCCESS_LIMIT) {
                Logger.game('🎓 Item learned!', { 
                    itemId, 
                    geo: state.item.geo, 
                    rus: state.item.rus 
                });
                this.activeBuffer = this.activeBuffer.filter(b => b.id !== itemId);
                this._fillBuffer();
                Logger.data('Buffer updated', { 
                    bufferSize: this.activeBuffer.length,
                    bufferItems: this.activeBuffer.map(i => i.geo)
                });
            }
        } else {
            // On error reset counter
            state.successCount = 0;
        }

        Logger.progressUpdated(
            itemId, 
            oldCount, 
            state.successCount, 
            state.successCount >= GameSession.SUCCESS_LIMIT
        );

        this.questionHistory.push({
            itemId,
            isCorrect,
            timestamp: Date.now()
        });
    }

    /**
     * Check if session is complete
     * @returns {boolean}
     */
    isComplete() {
        return this._getUnlearnedItems().length === 0;
    }

    /**
     * Get session statistics
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
     * Set current question
     * @param {Object} question
     */
    setCurrentQuestion(question) {
        this.currentQuestion = question;
    }

    /**
     * Get current question
     * @returns {Object|null}
     */
    getCurrentQuestion() {
        return this.currentQuestion;
    }
}
