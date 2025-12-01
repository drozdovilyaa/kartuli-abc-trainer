/**
 * Data Layer — Репозиторий данных
 * =================================
 * Класс для доступа к данным приложения
 */

'use strict';

import { MOCK_DATA } from './data.js';

/**
 * DataRepository — Паттерн репозитория для доступа к данным
 * Предоставляет методы для получения букв, слов, фраз и маппингов
 */
export class DataRepository {
    /**
     * Получить данные по типу режима
     * @param {string} mode - Режим: 'letters' или 'words'
     * @returns {Array} - Массив элементов для изучения
     */
    static getData(mode) {
        if (mode === 'letters') {
            return [...MOCK_DATA.letters];
        } else if (mode === 'words') {
            return [
                ...MOCK_DATA.words,
                ...MOCK_DATA.phrases
            ];
        }
        return [];
    }

    /**
     * Получить все буквы для режима сборки
     * @returns {Array} - Массив всех букв
     */
    static getAllLetters() {
        return [...MOCK_DATA.letters];
    }

    /**
     * Получить маппинг грузинских букв в русские
     * @returns {Map} - Map<geo, rus>
     */
    static getGeoToRusMap() {
        const map = new Map();
        MOCK_DATA.letters.forEach(l => map.set(l.geo, l.rus));
        return map;
    }

    /**
     * Получить маппинг русских букв в грузинские
     * @returns {Map} - Map<rus, geo>
     */
    static getRusToGeoMap() {
        const map = new Map();
        MOCK_DATA.letters.forEach(l => map.set(l.rus, l.geo));
        return map;
    }

    /**
     * Получить все слова
     * @returns {Array} - Массив слов
     */
    static getWords() {
        return [...MOCK_DATA.words];
    }

    /**
     * Получить все фразы
     * @returns {Array} - Массив фраз
     */
    static getPhrases() {
        return [...MOCK_DATA.phrases];
    }

    /**
     * Получить простые слова (для режима букв)
     * @returns {Array} - Массив простых слов с транслитерацией
     */
    static getSimpleWords() {
        return [...MOCK_DATA.simpleWords];
    }
}
