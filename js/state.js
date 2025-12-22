/**
 * Data Layer — Data Repository
 * =================================
 * Class for accessing application data
 */

'use strict';

import { LETTERS } from './data/letters.js';
import { WORDS } from './data/words.js';
import { PHRASES } from './data/phrases.js';

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
            return [...LETTERS];
        } else if (mode === 'words') {
            return [
                ...WORDS,
                ...PHRASES
            ];
        }
        return [];
    }

    /**
     * Get all letters for assembly mode
     * @returns {Array} - Array of all letters
     */
    static getAllLetters() {
        return [...LETTERS];
    }

    /**
     * Get Georgian to Russian letter mapping
     * @returns {Map} - Map<geo, rus>
     */
    static getGeoToRusMap() {
        const map = new Map();
        LETTERS.forEach(l => map.set(l.geo, l.rus));
        return map;
    }

    /**
     * Get Russian to Georgian letter mapping
     * @returns {Map} - Map<rus, geo>
     */
    static getRusToGeoMap() {
        const map = new Map();
        LETTERS.forEach(l => map.set(l.rus, l.geo));
        return map;
    }

    /**
     * Get all words
     * @returns {Array} - Array of words
     */
    static getWords() {
        return [...WORDS];
    }

    /**
     * Get all phrases
     * @returns {Array} - Array of phrases
     */
    static getPhrases() {
        return [...PHRASES];
    }

    /**
     * Get words (for letters mode - word_assembly, translit_input)
     * @returns {Array} - Array of words with transliteration
     */
    static getSimpleWords() {
        return [...WORDS];
    }
}
