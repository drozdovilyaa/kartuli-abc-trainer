/**
 * Logger — Logging System for Debugging
 * ==========================================
 * Logs all application actions to console
 */

'use strict';

export class Logger {
    /** Enable/disable logging */
    static ENABLED = false;
    
    /** Logging levels */
    static LEVELS = {
        INFO: 'INFO',
        ACTION: 'ACTION',
        GAME: 'GAME',
        UI: 'UI',
        DATA: 'DATA',
        ERROR: 'ERROR'
    };

    /** Colors for different levels */
    static COLORS = {
        INFO: '#2196F3',
        ACTION: '#4CAF50',
        GAME: '#FF9800',
        UI: '#9C27B0',
        DATA: '#607D8B',
        ERROR: '#F44336'
    };

    /**
     * Main logging method
     * @param {string} level - Log level
     * @param {string} message - Message
     * @param {Object} data - Additional data
     */
    static log(level, message, data = null) {
        if (!Logger.ENABLED) return;

        const timestamp = new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            fractionalSecondDigits: 3
        });

        const color = Logger.COLORS[level] || '#000';
        const prefix = `%c[${timestamp}] [${level}]`;
        const style = `color: ${color}; font-weight: bold;`;

        if (data !== null) {
            console.groupCollapsed(prefix + ` ${message}`, style);
            console.log(data);
            console.groupEnd();
        } else {
            console.log(prefix + ` ${message}`, style);
        }
    }

    // ===== Convenience methods for different log types =====

    /** Informational message */
    static info(message, data = null) {
        Logger.log(Logger.LEVELS.INFO, message, data);
    }

    /** User action */
    static action(message, data = null) {
        Logger.log(Logger.LEVELS.ACTION, message, data);
    }

    /** Game logic */
    static game(message, data = null) {
        Logger.log(Logger.LEVELS.GAME, message, data);
    }

    /** UI events */
    static ui(message, data = null) {
        Logger.log(Logger.LEVELS.UI, message, data);
    }

    /** Data */
    static data(message, data = null) {
        Logger.log(Logger.LEVELS.DATA, message, data);
    }

    /** Error */
    static error(message, data = null) {
        Logger.log(Logger.LEVELS.ERROR, message, data);
    }

    // ===== Special methods for game events =====

    /**
     * Log question shown
     */
    static questionShown(item, template, questionData) {
        Logger.game('📝 Question shown', {
            item: {
                id: item.id,
                type: item.type,
                geo: item.geo,
                rus: item.rus
            },
            template,
            questionType: questionData.type,
            correctAnswer: questionData.correctAnswer
        });
    }

    /**
     * Log user answer
     */
    static answerGiven(userAnswer, correctAnswer, isCorrect) {
        const emoji = isCorrect ? '✅' : '❌';
        const result = isCorrect ? 'CORRECT' : 'INCORRECT';
        Logger.action(`${emoji} ${result}: "${userAnswer}" ${isCorrect ? '=' : '≠'} "${correctAnswer}"`);
    }

    /**
     * Log item progress update
     */
    static progressUpdated(itemId, oldCount, newCount, isLearned) {
        const emoji = isLearned ? '🎓' : '📊';
        const status = isLearned ? ' LEARNED!' : '';
        Logger.game(`${emoji} Progress: ${oldCount} → ${newCount}/3${status}`, { itemId });
    }

    /**
     * Log next item selection
     */
    static nextItemSelected(item, candidates, recentIds) {
        // Show selected item ID and history
        Logger.game(`🎯 Selected [${item.id}] "${item.geo}" | Candidates: ${candidates.length} | History: [${recentIds.join(', ')}]`);
    }

    /**
     * Log session start
     */
    static sessionStarted(mode, itemsCount) {
        Logger.info('🚀 Session started', {
            mode,
            totalItems: itemsCount
        });
    }

    /**
     * Log session end
     */
    static sessionEnded(stats) {
        Logger.info('🏁 Session ended', stats);
    }

    /**
     * Log screen change
     */
    static screenChanged(screenName) {
        Logger.ui(`📱 Screen: ${screenName}`);
    }
}

// Make Logger available globally for console debugging
window.Logger = Logger;
