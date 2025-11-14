// Game state management
export class GameState {
    constructor() {
        this.score = 0;
        this.total = 0;
        this.currentQuestion = null;
        this.letterQuestionsCount = 0;
        this.nextWordAfter = this.getRandomWordDelay();
        
        // Memory system for tracking recent questions and mastery
        // Structure: { mode: { itemKey: { history: [...], correctCount: 0 } } }
        this.memory = {
            1: {}, // Mode 1: Georgian -> Russian letter
            2: {}, // Mode 2: Russian -> Georgian letter
            3: {}, // Mode 3: Words
            4: {}, // Mode 4: Typing
            5: {}  // Mode 5: Phrases (Russian -> Georgian)
        };
        
        // Recent history per mode (last 5 items asked)
        this.recentHistory = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        };
    }

    incrementScore() {
        this.score++;
        this.total++;
    }

    incrementTotal() {
        this.total++;
    }

    setCurrentQuestion(question) {
        this.currentQuestion = question;
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    incrementLetterQuestions() {
        this.letterQuestionsCount++;
    }

    resetLetterQuestions() {
        this.letterQuestionsCount = 0;
        this.nextWordAfter = this.getRandomWordDelay();
    }

    shouldShowWordQuestion() {
        return this.letterQuestionsCount >= this.nextWordAfter;
    }

    getRandomWordDelay() {
        return Math.floor(Math.random() * 8) + 3; // Random number between 3 and 10
    }

    getScore() {
        return this.score;
    }

    getTotal() {
        return this.total;
    }

    /**
     * Log memory state summary for debugging
     */
    logMemoryState() {
        console.log('═══════════════════════════════════════════');
        console.log('📊 MEMORY STATE SUMMARY');
        console.log('═══════════════════════════════════════════');
        
        [1, 2, 3, 4, 5].forEach(mode => {
            const modeNames = {
                1: 'Georgian → Russian',
                2: 'Russian → Georgian',
                3: 'Word Translation',
                4: 'Typing',
                5: 'Phrase Translation'
            };
            
            // Different mastery thresholds for different modes
            let masteryThreshold;
            if (mode === 1 || mode === 2) {
                masteryThreshold = 1;
            } else if (mode === 4) {
                masteryThreshold = 2;
            } else {
                masteryThreshold = 3;
            }
            
            console.log(`\n🎯 Mode ${mode}: ${modeNames[mode]} (mastery: ${masteryThreshold} correct)`);
            console.log('───────────────────────────────────────────');
            
            const modeMemory = this.memory[mode];
            const items = Object.keys(modeMemory);
            
            if (items.length === 0) {
                console.log('  No items practiced yet');
            } else {
                const mastered = items.filter(key => modeMemory[key].correctCount >= masteryThreshold);
                const inProgress = items.filter(key => modeMemory[key].correctCount > 0 && modeMemory[key].correctCount < masteryThreshold);
                const needsWork = items.filter(key => modeMemory[key].correctCount === 0);
                
                console.log(`  Total practiced: ${items.length}`);
                console.log(`  🎓 Mastered: ${mastered.length}`);
                console.log(`  📈 In Progress: ${inProgress.length}`);
                console.log(`  ⚠ Needs Work: ${needsWork.length}`);
                
                if (mastered.length > 0) {
                    console.log(`  Mastered items: ${mastered.join(', ')}`);
                }
                
                console.log(`  Recent history: [${this.recentHistory[mode].join(', ')}]`);
            }
        });
        
        console.log('\n═══════════════════════════════════════════');
    }

    /**
     * Add item to recent history for a mode
     * @param {number} mode - Question mode
     * @param {string} itemKey - Unique identifier for the item
     */
    addToRecentHistory(mode, itemKey) {
        if (!this.recentHistory[mode]) {
            this.recentHistory[mode] = [];
        }
        
        this.recentHistory[mode].push(itemKey);
        
        // Keep only last 5 items
        if (this.recentHistory[mode].length > 5) {
            this.recentHistory[mode].shift();
        }
    }

    /**
     * Check if item is in recent history for a mode
     * @param {number} mode - Question mode
     * @param {string} itemKey - Unique identifier for the item
     * @returns {boolean} True if item is in recent history
     */
    isInRecentHistory(mode, itemKey) {
        if (!this.recentHistory[mode]) {
            return false;
        }
        return this.recentHistory[mode].includes(itemKey);
    }

    /**
     * Record answer for an item in a specific mode
     * @param {number} mode - Question mode
     * @param {string} itemKey - Unique identifier for the item
     * @param {boolean} isCorrect - Whether the answer was correct
     */
    recordAnswer(mode, itemKey, isCorrect) {
        if (!this.memory[mode]) {
            this.memory[mode] = {};
        }
        
        if (!this.memory[mode][itemKey]) {
            this.memory[mode][itemKey] = {
                correctCount: 0,
                totalAttempts: 0
            };
        }
        
        this.memory[mode][itemKey].totalAttempts++;
        
        if (isCorrect) {
            this.memory[mode][itemKey].correctCount++;
        } else {
            // Reset correct count on incorrect answer
            this.memory[mode][itemKey].correctCount = 0;
        }
        
        // Add to recent history
        this.addToRecentHistory(mode, itemKey);
    }

    /**
     * Check if item is mastered for a mode
     * For modes 1 and 2: 1 correct answer is enough
     * For mode 4: 2 correct answers in a row required
     * For modes 3 and 5: 3 correct answers in a row required
     * @param {number} mode - Question mode
     * @param {string} itemKey - Unique identifier for the item
     * @returns {boolean} True if item is mastered
     */
    isMastered(mode, itemKey) {
        if (!this.memory[mode] || !this.memory[mode][itemKey]) {
            return false;
        }
        
        // Different mastery thresholds for different modes
        let requiredCorrect;
        if (mode === 1 || mode === 2) {
            requiredCorrect = 1; // Letter recognition modes
        } else if (mode === 4) {
            requiredCorrect = 2; // Typing mode
        } else {
            requiredCorrect = 3; // Word and phrase modes
        }
        
        return this.memory[mode][itemKey].correctCount >= requiredCorrect;
    }

    /**
     * Check if item should be excluded (recently asked or mastered)
     * @param {number} mode - Question mode
     * @param {string} itemKey - Unique identifier for the item
     * @returns {boolean} True if item should be excluded
     */
    shouldExcludeItem(mode, itemKey) {
        return this.isInRecentHistory(mode, itemKey) || this.isMastered(mode, itemKey);
    }

    /**
     * Get available items (not mastered and not in recent history)
     * @param {number} mode - Question mode
     * @param {Array} allItems - All possible items
     * @param {Function} getKeyFn - Function to extract key from item
     * @returns {Array} Available items
     */
    getAvailableItems(mode, allItems, getKeyFn) {
        const available = allItems.filter(item => {
            const key = getKeyFn(item);
            return !this.shouldExcludeItem(mode, key);
        });
        
        // If all items are excluded, reset recent history and return non-mastered items
        if (available.length === 0) {
            this.recentHistory[mode] = [];
            return allItems.filter(item => {
                const key = getKeyFn(item);
                return !this.isMastered(mode, key);
            });
        }
        
        return available;
    }
}
