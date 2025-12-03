/**
 * Logger — Система логирования для отладки
 * ==========================================
 * Логирует все действия приложения в консоль
 */

'use strict';

export class Logger {
    /** Включить/выключить логирование */
    static ENABLED = true;
    
    /** Уровни логирования */
    static LEVELS = {
        INFO: 'INFO',
        ACTION: 'ACTION',
        GAME: 'GAME',
        UI: 'UI',
        DATA: 'DATA',
        ERROR: 'ERROR'
    };

    /** Цвета для разных уровней */
    static COLORS = {
        INFO: '#2196F3',
        ACTION: '#4CAF50',
        GAME: '#FF9800',
        UI: '#9C27B0',
        DATA: '#607D8B',
        ERROR: '#F44336'
    };

    /**
     * Основной метод логирования
     * @param {string} level - Уровень лога
     * @param {string} message - Сообщение
     * @param {Object} data - Дополнительные данные
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

    // ===== Удобные методы для разных типов логов =====

    /** Информационное сообщение */
    static info(message, data = null) {
        Logger.log(Logger.LEVELS.INFO, message, data);
    }

    /** Действие пользователя */
    static action(message, data = null) {
        Logger.log(Logger.LEVELS.ACTION, message, data);
    }

    /** Игровая логика */
    static game(message, data = null) {
        Logger.log(Logger.LEVELS.GAME, message, data);
    }

    /** UI события */
    static ui(message, data = null) {
        Logger.log(Logger.LEVELS.UI, message, data);
    }

    /** Данные */
    static data(message, data = null) {
        Logger.log(Logger.LEVELS.DATA, message, data);
    }

    /** Ошибка */
    static error(message, data = null) {
        Logger.log(Logger.LEVELS.ERROR, message, data);
    }

    // ===== Специальные методы для игровых событий =====

    /**
     * Лог показа вопроса
     */
    static questionShown(item, template, questionData) {
        Logger.game('📝 Показан вопрос', {
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
     * Лог ответа пользователя
     */
    static answerGiven(userAnswer, correctAnswer, isCorrect) {
        const emoji = isCorrect ? '✅' : '❌';
        const result = isCorrect ? 'ВЕРНО' : 'НЕВЕРНО';
        Logger.action(`${emoji} ${result}: "${userAnswer}" ${isCorrect ? '=' : '≠'} "${correctAnswer}"`);
    }

    /**
     * Лог обновления прогресса элемента
     */
    static progressUpdated(itemId, oldCount, newCount, isLearned) {
        const emoji = isLearned ? '🎓' : '📊';
        const status = isLearned ? ' ВЫУЧЕН!' : '';
        Logger.game(`${emoji} Прогресс: ${oldCount} → ${newCount}/3${status}`, { itemId });
    }

    /**
     * Лог выбора следующего элемента
     */
    static nextItemSelected(item, candidates, recentIds) {
        // Показываем ID выбранного элемента и историю
        Logger.game(`🎯 Выбран [${item.id}] "${item.geo}" | Кандидатов: ${candidates.length} | История: [${recentIds.join(', ')}]`);
    }

    /**
     * Лог начала сессии
     */
    static sessionStarted(mode, itemsCount) {
        Logger.info('🚀 Сессия начата', {
            mode,
            totalItems: itemsCount
        });
    }

    /**
     * Лог завершения сессии
     */
    static sessionEnded(stats) {
        Logger.info('🏁 Сессия завершена', stats);
    }

    /**
     * Лог смены экрана
     */
    static screenChanged(screenName) {
        Logger.ui(`📱 Экран: ${screenName}`);
    }
}

// Делаем Logger доступным глобально для отладки в консоли
window.Logger = Logger;
