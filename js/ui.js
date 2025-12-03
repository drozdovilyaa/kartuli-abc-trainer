/**
 * Presentation Layer — UI Management
 * ===================================
 * Class for managing display and interface state (Bootstrap 5.3)
 */

'use strict';

/**
 * UIManager — Application Interface Management
 * Responsible for screen switching, visual feedback, assembly
 */
export class UIManager {
    constructor() {
        /** Screen DOM elements */
        this.screens = {
            home: document.getElementById('home-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen')
        };

        /** Question container DOM element (center) */
        this.questionContent = document.getElementById('question-content');

        /** Answer area DOM element (bottom) */
        this.answerArea = document.getElementById('answer-area');

        /** Progress block DOM element */
        this.progressInfo = document.getElementById('progress-info');

        /** Action bar DOM element (mobile) */
        this.actionBar = document.getElementById('action-buttons');

        /** Current screen */
        this.currentScreen = 'home';

        /** Assembly state */
        this.assemblyState = [];
    }

    /**
     * Switch screen
     * @param {string} screenName - Screen name: 'home', 'game', 'result'
     */
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
        // Clear action bar on screen change
        if (this.actionBar) {
            this.actionBar.innerHTML = '';
        }
    }

    /**
     * Set action bar buttons
     * @param {string} type - Button type: 'submit', 'assembly', 'next', 'hidden'
     */
    setActionButtons(type) {
        if (!this.actionBar) return;
        
        switch (type) {
            case 'submit':
                this.actionBar.innerHTML = `
                    <button class="btn btn-primary btn-lg w-100" id="submit-btn-mobile">
                        Проверить
                    </button>
                `;
                break;
            case 'assembly':
                this.actionBar.innerHTML = `
                    <div class="d-flex gap-2 w-100">
                        <button class="btn btn-outline-danger btn-lg" id="clear-assembly-btn-mobile">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button class="btn btn-primary btn-lg flex-grow-1" id="submit-btn-mobile">
                            Проверить
                        </button>
                    </div>
                `;
                break;
            case 'next':
                this.actionBar.innerHTML = `
                    <button class="btn btn-primary btn-lg w-100" id="next-btn-mobile" data-action="next">
                        Далее
                    </button>
                `;
                break;
            default:
                // Invisible placeholder to maintain height
                this.actionBar.innerHTML = `
                    <button class="btn btn-lg w-100 invisible">Placeholder</button>
                `;
        }
    }

    /**
     * Update "Check" button state (disabled/enabled)
     * @param {boolean} enabled - Whether button is active
     */
    updateSubmitButton(enabled) {
        const submitBtn = document.getElementById('submit-btn');
        const submitBtnMobile = document.getElementById('submit-btn-mobile');
        
        if (submitBtn) {
            submitBtn.disabled = !enabled;
        }
        if (submitBtnMobile) {
            submitBtnMobile.disabled = !enabled;
        }
    }

    /**
     * Update progress
     * @param {Object} stats - Session statistics
     */
    updateProgress(stats) {
        if (this.progressInfo) {
            this.progressInfo.textContent = `Изучено: ${stats.learned} / ${stats.total}`;
        }
    }

    /**
     * Show results (Bootstrap)
     * @param {Object} stats - Session statistics
     */
    showResults(stats) {
        const resultContent = document.getElementById('result-content');
        if (resultContent) {
            resultContent.innerHTML = `
                <div class="row g-3 justify-content-center">
                    <div class="col-auto">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="card-title text-primary">${stats.learned}</h3>
                                <p class="card-text text-muted small mb-0">Изучено</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="card-title text-primary">${stats.accuracy}%</h3>
                                <p class="card-text text-muted small mb-0">Точность</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="card-title text-primary">${stats.totalQuestions}</h3>
                                <p class="card-text text-muted small mb-0">Вопросов</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        this.showScreen('result');
    }

    /**
     * Highlight correct/incorrect option (choice) - Bootstrap
     * @param {string} answer - Selected answer
     * @param {string} correctAnswer - Correct answer
     * @param {boolean} isCorrect - Whether correct
     */
    highlightChoice(answer, correctAnswer, isCorrect) {
        const buttons = this.answerArea.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('btn-outline-secondary');
            if (btn.dataset.answer === correctAnswer) {
                btn.classList.add('btn-success');
            } else if (btn.dataset.answer === answer && !isCorrect) {
                btn.classList.add('btn-danger');
            } else {
                btn.classList.add('btn-secondary');
            }
        });
    }

    /**
     * Highlight input - Bootstrap
     * @param {boolean} isCorrect
     * @param {string} correctAnswer
     */
    highlightInput(isCorrect, correctAnswer) {
        const input = document.getElementById('answer-input');
        const submitBtn = document.getElementById('submit-btn');
        
        if (input) {
            input.disabled = true;
            input.classList.remove('form-control');
            input.classList.add(isCorrect ? 'form-control' : 'form-control', 'is-' + (isCorrect ? 'valid' : 'invalid'));
            
            if (!isCorrect) {
                const hint = document.createElement('div');
                hint.className = 'invalid-feedback d-block text-center fs-4 fw-bold';
                hint.textContent = `Правильный ответ: ${correctAnswer}`;
                input.parentNode.appendChild(hint);
            }
        }
        
        if (submitBtn) {
            submitBtn.classList.add('d-none');
        }
    }

    /**
     * Highlight assembly - Bootstrap
     * @param {boolean} isCorrect
     * @param {string} correctAnswer
     */
    highlightAssembly(isCorrect, correctAnswer) {
        const zone = document.getElementById('assembly-zone');
        const controls = document.getElementById('assembly-controls');
        const pool = document.getElementById('pool-container');
        
        if (zone) {
            zone.classList.remove('bg-light');
            zone.classList.add(isCorrect ? 'bg-success-subtle' : 'bg-danger-subtle');
            
            if (!isCorrect) {
                const hint = document.createElement('div');
                hint.className = 'text-danger text-center mt-2 fs-4 fw-bold';
                hint.textContent = `Правильный ответ: ${correctAnswer}`;
                zone.parentNode.appendChild(hint);
            }
        }
        
        // Hide controls and pool on answer
        if (controls) {
            controls.classList.add('d-none');
        }
        if (pool) {
            pool.classList.add('d-none');
        }
    }

    /**
     * Add element to assembly zone - Bootstrap
     * @param {string} value - Letter or word
     * @param {HTMLElement} sourceBtn - Source button
     * @param {number|null} requiredLength - Required length (optional)
     */
    addToAssembly(value, sourceBtn, requiredLength = null) {
        // Check limit if required length is specified
        if (requiredLength !== null && this.assemblyState.length >= requiredLength) {
            return; // Don't add if limit reached
        }
        
        const zone = document.getElementById('assembly-zone');
        if (!zone) return;

        // Remove placeholder
        const placeholder = zone.querySelector('.assembly-placeholder');
        if (placeholder) {
            placeholder.classList.add('d-none');
        }

        // Add element
        this.assemblyState.push(value);

        const span = document.createElement('span');
        span.className = 'badge bg-primary fs-5 assembled-item';
        span.textContent = value;
        span.dataset.index = this.assemblyState.length - 1;
        span.style.cursor = 'pointer';
        
        // Click to remove
        span.addEventListener('click', () => {
            this.removeFromAssembly(span, sourceBtn);
        });

        zone.appendChild(span);
        sourceBtn.disabled = true;
        
        // Enable "Check" button if there are elements
        this.updateSubmitButton(this.assemblyState.length > 0);
    }

    /**
     * Remove element from assembly
     * @param {HTMLElement} span - Element in assembly zone
     * @param {HTMLElement} sourceBtn - Source button
     */
    removeFromAssembly(span, sourceBtn) {
        const zone = document.getElementById('assembly-zone');
        const index = parseInt(span.dataset.index);
        
        // Remove from state
        this.assemblyState.splice(index, 1);
        
        // Remove from DOM
        span.remove();
        
        // Restore button
        if (sourceBtn) {
            sourceBtn.disabled = false;
        }

        // Update indices
        const items = zone.querySelectorAll('.assembled-item');
        items.forEach((item, i) => {
            item.dataset.index = i;
        });

        // Show placeholder if empty
        if (this.assemblyState.length === 0) {
            const placeholder = zone.querySelector('.assembly-placeholder');
            if (placeholder) {
                placeholder.classList.remove('d-none');
            }
        }
        
        // Update "Check" button state
        this.updateSubmitButton(this.assemblyState.length > 0);
    }

    /**
     * Clear assembly zone
     */
    clearAssembly() {
        const zone = document.getElementById('assembly-zone');
        const pool = document.getElementById('pool-container');
        
        if (zone) {
            const items = zone.querySelectorAll('.assembled-item');
            items.forEach(item => item.remove());
            
            const placeholder = zone.querySelector('.assembly-placeholder');
            if (placeholder) {
                placeholder.classList.remove('d-none');
            }
        }

        if (pool) {
            const buttons = pool.querySelectorAll('button');
            buttons.forEach(btn => btn.disabled = false);
        }

        this.assemblyState = [];
        
        // Disable "Check" button
        this.updateSubmitButton(false);
    }

    /**
     * Get assembled answer
     * @param {string} type - Type: 'assembly' or 'phrase_assembly'
     * @returns {string}
     */
    getAssembledAnswer(type) {
        if (type === 'phrase_assembly') {
            return this.assemblyState.join(' ');
        }
        return this.assemblyState.join('');
    }

    /**
     * Reset assembly state
     */
    resetAssemblyState() {
        this.assemblyState = [];
    }
}
