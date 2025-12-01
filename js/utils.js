/**
 * Utils Layer — Утилитарные функции
 * ==================================
 * Вспомогательные статические методы
 */

'use strict';

/**
 * Utils — Утилитарный класс со статическими методами
 */
export class Utils {
    /**
     * Перемешать массив (Fisher-Yates shuffle)
     * @param {Array} arr - Исходный массив
     * @returns {Array} - Новый перемешанный массив
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
     * Получить случайное число в диапазоне
     * @param {number} min - Минимум (включительно)
     * @param {number} max - Максимум (не включительно)
     * @returns {number}
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Получить N случайных элементов из массива
     * @param {Array} arr - Исходный массив
     * @param {number} n - Количество элементов
     * @returns {Array}
     */
    static getRandomElements(arr, n) {
        const shuffled = Utils.shuffleArray(arr);
        return shuffled.slice(0, n);
    }

    /**
     * Генерировать уникальный ID
     * @returns {string}
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Нормализация строки для сравнения
     * @param {string} str - Строка
     * @returns {string}
     */
    static normalizeString(str) {
        return str.trim().toLowerCase();
    }
}
