// Utility functions

/**
 * Get random element from array
 * @param {Array} array - Source array
 * @returns {*} Random element
 */
export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random elements from array (excluding specific items)
 * @param {Array} array - Source array
 * @param {number} count - Number of elements to return
 * @param {Array} exclude - Elements to exclude
 * @returns {Array} Random elements
 */
export function getRandomElements(array, count, exclude = []) {
    const filtered = array.filter(item => !exclude.includes(item));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Shuffle array
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}
