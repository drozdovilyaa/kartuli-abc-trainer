// Question generation logic
import { dictionary, georgianWords, georgianPhrases } from './data.js';
import { getRandomElement, getRandomElements } from './utils.js';

/**
 * Generate Mode 1 question: Show Georgian letter, pick Russian letter
 * @param {GameState} gameState - Current game state (optional, for memory tracking)
 * @returns {Object} Question object
 */
export function generateMode1Question(gameState = null) {
    let availablePairs = dictionary;
    
    // Use memory system if gameState is provided
    if (gameState) {
        availablePairs = gameState.getAvailableItems(
            1,
            dictionary,
            (pair) => pair.georgian_letter
        );
    }
    
    // If no available pairs (all mastered), return null
    if (availablePairs.length === 0) {
        return null;
    }
    
    const correctPair = getRandomElement(availablePairs);
    const incorrectPairs = getRandomElements(dictionary, 3, [correctPair]);
    
    const options = [correctPair, ...incorrectPairs].sort(() => Math.random() - 0.5);
    
    return {
        mode: 1,
        questionLetter: correctPair.georgian_letter,
        correctAnswer: correctPair.russian_letter,
        options: options.map(pair => pair.russian_letter),
        itemKey: correctPair.georgian_letter // For memory tracking
    };
}

/**
 * Generate Mode 2 question: Show Russian letter, pick Georgian letter
 * @param {GameState} gameState - Current game state (optional, for memory tracking)
 * @returns {Object} Question object
 */
export function generateMode2Question(gameState = null) {
    let availablePairs = dictionary;
    
    // Use memory system if gameState is provided
    if (gameState) {
        availablePairs = gameState.getAvailableItems(
            2,
            dictionary,
            (pair) => pair.russian_letter
        );
    }
    
    // If no available pairs (all mastered), return null
    if (availablePairs.length === 0) {
        return null;
    }
    
    const correctPair = getRandomElement(availablePairs);
    const incorrectPairs = getRandomElements(dictionary, 3, [correctPair]);
    
    const options = [correctPair, ...incorrectPairs].sort(() => Math.random() - 0.5);
    
    return {
        mode: 2,
        questionLetter: correctPair.russian_letter,
        correctAnswer: correctPair.georgian_letter,
        options: options.map(pair => pair.georgian_letter),
        itemKey: correctPair.russian_letter // For memory tracking
    };
}

/**
 * Generate Mode 4 question: Type the letter (random direction)
 * @param {GameState} gameState - Current game state (optional, for memory tracking)
 * @returns {Object} Question object
 */
export function generateMode4Question(gameState = null) {
    let availablePairs = dictionary;
    
    // Use memory system if gameState is provided
    if (gameState) {
        availablePairs = gameState.getAvailableItems(
            4,
            dictionary,
            (pair) => pair.georgian_letter + '_' + pair.russian_letter
        );
    }
    
    // If no available pairs (all mastered), return null
    if (availablePairs.length === 0) {
        return null;
    }
    
    const correctPair = getRandomElement(availablePairs);
    const showGeorgian = Math.random() < 0.5; // 50% chance for each direction
    
    if (showGeorgian) {
        return {
            mode: 4,
            questionLetter: correctPair.georgian_letter,
            correctAnswer: correctPair.russian_letter,
            direction: 'georgian-to-russian',
            itemKey: correctPair.georgian_letter + '_' + correctPair.russian_letter // For memory tracking
        };
    } else {
        return {
            mode: 4,
            questionLetter: correctPair.russian_letter,
            correctAnswer: correctPair.georgian_letter,
            direction: 'russian-to-georgian',
            itemKey: correctPair.georgian_letter + '_' + correctPair.russian_letter // For memory tracking
        };
    }
}

/**
 * Generate Mode 3 question: Show Georgian word, select Russian letters in correct order
 * @param {GameState} gameState - Current game state (optional, for memory tracking)
 * @returns {Object} Question object
 */
export function generateMode3Question(gameState = null) {
    let availableWords = georgianWords;
    
    // Use memory system if gameState is provided
    if (gameState) {
        availableWords = gameState.getAvailableItems(
            3,
            georgianWords,
            (wordObj) => wordObj.word
        );
    }
    
    // If no available words (all mastered), return null
    if (availableWords.length === 0) {
        return null;
    }
    
    const wordObj = getRandomElement(availableWords);
    const word = wordObj.word;
    const correctAnswer = [];
    
    // Build the correct answer
    for (let georgianLetter of word) {
        const correctPair = dictionary.find(pair => pair.georgian_letter === georgianLetter);
        if (correctPair) {
            correctAnswer.push(correctPair.russian_letter);
        }
    }
    
    // Create pool of letters: correct ones + some random ones
    const letterPool = [...correctAnswer];
    const numRandomLetters = Math.min(8, dictionary.length - correctAnswer.length);
    const usedPairs = correctAnswer.map(letter => 
        dictionary.find(pair => pair.russian_letter === letter)
    );
    const randomPairs = getRandomElements(dictionary, numRandomLetters, usedPairs);
    randomPairs.forEach(pair => letterPool.push(pair.russian_letter));
    
    // Shuffle the pool
    const shuffledPool = [...letterPool].sort(() => Math.random() - 0.5);
    
    return {
        mode: 3,
        word: word,
        translation: wordObj.translation,
        correctAnswer: correctAnswer,
        letterPool: shuffledPool,
        userAnswer: [],
        submitted: false,
        itemKey: wordObj.word // For memory tracking
    };
}

/**
 * Generate Mode 5 question: Show Russian phrase, select Georgian words in correct order
 * @param {GameState} gameState - Current game state (optional, for memory tracking)
 * @returns {Object} Question object
 */
export function generateMode5Question(gameState = null) {
    let availablePhrases = georgianPhrases;
    
    // Use memory system if gameState is provided
    if (gameState) {
        availablePhrases = gameState.getAvailableItems(
            5,
            georgianPhrases,
            (phraseObj) => phraseObj.russianPhrase
        );
    }
    
    // If no available phrases (all mastered), return null
    if (availablePhrases.length === 0) {
        return null;
    }
    
    const phraseObj = getRandomElement(availablePhrases);
    const correctAnswer = phraseObj.words; // Array of Georgian words in correct order
    
    // Create pool of words: correct ones + some random ones from other phrases
    const wordPool = [...correctAnswer];
    
    // Get random words from other phrases
    const otherPhrases = georgianPhrases.filter(p => p.russianPhrase !== phraseObj.russianPhrase);
    const numRandomWords = Math.min(6, otherPhrases.length * 2);
    
    // Collect random words from other phrases
    const randomWords = [];
    for (let i = 0; i < numRandomWords && randomWords.length < numRandomWords; i++) {
        const randomPhrase = getRandomElement(otherPhrases);
        const randomWord = getRandomElement(randomPhrase.words);
        if (!wordPool.includes(randomWord) && !randomWords.includes(randomWord)) {
            randomWords.push(randomWord);
        }
    }
    
    wordPool.push(...randomWords);
    
    // Shuffle the pool
    const shuffledPool = [...wordPool].sort(() => Math.random() - 0.5);
    
    return {
        mode: 5,
        russianPhrase: phraseObj.russianPhrase,
        georgianPhrase: phraseObj.phrase,
        correctAnswer: correctAnswer,
        wordPool: shuffledPool,
        userAnswer: [],
        submitted: false,
        itemKey: phraseObj.russianPhrase // For memory tracking
    };
}

/**
 * Generate random mode based on game state
 * @param {GameState} gameState - Current game state
 * @returns {number} Mode number (1, 2, 3, 4, or 5)
 */
export function getRandomMode(gameState) {
    // Check if it's time for a word/phrase question
    if (gameState.shouldShowWordQuestion()) {
        gameState.resetLetterQuestions();
        // 50% chance for word mode (3) or phrase mode (5)
        return Math.random() < 0.5 ? 3 : 5;
    }
    
    // Otherwise, random letter mode (1, 2, or 4)
    gameState.incrementLetterQuestions();
    const modes = [1, 2, 4]; // Letter modes
    return modes[Math.floor(Math.random() * modes.length)];
}

/**
 * Generate new question based on mode
 * @param {number} mode - Question mode
 * @param {GameState} gameState - Current game state (optional, for memory tracking)
 * @returns {Object} Question object
 */
export function generateQuestionByMode(mode, gameState = null) {
    switch (mode) {
        case 1:
            return generateMode1Question(gameState);
        case 2:
            return generateMode2Question(gameState);
        case 3:
            return generateMode3Question(gameState);
        case 4:
            return generateMode4Question(gameState);
        case 5:
            return generateMode5Question(gameState);
        default:
            throw new Error(`Unknown mode: ${mode}`);
    }
}
