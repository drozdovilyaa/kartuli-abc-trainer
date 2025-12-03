/**
 * Utils Layer — Utility Functions
 * ==================================
 * Helper static methods
 */

'use strict';

/**
 * Utils — Utility class with static methods
 */
export class Utils {
    /**
     * Shuffle array (Fisher-Yates shuffle)
     * @param {Array} arr - Source array
     * @returns {Array} - New shuffled array
     */
    static shuffleArray(arr) {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * Get random number in range
     * @param {number} min - Minimum (inclusive)
     * @param {number} max - Maximum (exclusive)
     * @returns {number}
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Get N random elements from array
     * @param {Array} arr - Source array
     * @param {number} n - Number of elements
     * @returns {Array}
     */
    static getRandomElements(arr, n) {
        const shuffled = Utils.shuffleArray(arr);
        return shuffled.slice(0, n);
    }

    /**
     * Generate unique ID
     * @returns {string}
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Normalize string for comparison
     * @param {string} str - String
     * @returns {string}
     */
    static normalizeString(str) {
        return str.trim().toLowerCase();
    }
}
