/**
 * Data Layer — Data Repository
 * =================================
 * Class for accessing application data
 */

'use strict';

import { MOCK_DATA } from './data.js';

/**
 * DataRepository — Repository pattern for data access
 * Provides methods for getting letters, words, phrases and mappings
 */
export class DataRepository {
    /**
     * Get data by mode type
     * @param {string} mode - Mode: 'letters' or 'words'
     * @returns {Array} - Array of items for learning
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
     * Get all letters for assembly mode
     * @returns {Array} - Array of all letters
     */
    static getAllLetters() {
        return [...MOCK_DATA.letters];
    }

    /**
     * Get Georgian to Russian letter mapping
     * @returns {Map} - Map<geo, rus>
     */
    static getGeoToRusMap() {
        const map = new Map();
        MOCK_DATA.letters.forEach(l => map.set(l.geo, l.rus));
        return map;
    }

    /**
     * Get Russian to Georgian letter mapping
     * @returns {Map} - Map<rus, geo>
     */
    static getRusToGeoMap() {
        const map = new Map();
        MOCK_DATA.letters.forEach(l => map.set(l.rus, l.geo));
        return map;
    }

    /**
     * Get all words
     * @returns {Array} - Array of words
     */
    static getWords() {
        return [...MOCK_DATA.words];
    }

    /**
     * Get all phrases
     * @returns {Array} - Array of phrases
     */
    static getPhrases() {
        return [...MOCK_DATA.phrases];
    }

    /**
     * Get words (for letters mode - word_assembly, translit_input)
     * @returns {Array} - Array of words with transliteration
     */
    static getSimpleWords() {
        return [...MOCK_DATA.words];
    }
}
