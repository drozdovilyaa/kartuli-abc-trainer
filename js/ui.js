/**
 * Presentation Layer — Управление UI
 * ===================================
 * Класс для управления отображением и состоянием интерфейса (Bootstrap 5.3)
 */

'use strict';

/**
 * UIManager — Управление интерфейсом приложения
 * Отвечает за переключение экранов, визуальную обратную связь, сборку
 */
export class UIManager {
    constructor() {
        /** DOM-элементы экранов */
        this.screens = {
            home: document.getElementById('home-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen')
        };

        /** DOM-элемент контейнера вопроса (центр) */
        this.questionContent = document.getElementById('question-content');

        /** DOM-элемент контейнера ответов (низ) */
        this.answerArea = document.getElementById('answer-area');

        /** DOM-элемент блока прогресса */
        this.progressInfo = document.getElementById('progress-info');

        /** DOM-элемент панели действий (мобильная) */
        this.actionBar = document.getElementById('action-buttons');

        /** Текущий экран */
        this.currentScreen = 'home';

        /** Состояние сборки (assembly) */
        this.assemblyState = [];
    }

    /**
     * Переключить экран
     * @param {string} screenName - Имя экрана: 'home', 'game', 'result'
     */
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
        // Очищаем action bar при смене экрана
        if (this.actionBar) {
            this.actionBar.innerHTML = '';
        }
    }

    /**
     * Установить кнопки в action bar
     * @param {string} type - Тип кнопок: 'submit', 'assembly', 'next', 'hidden'
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
     * Обновить прогресс
     * @param {Object} stats - Статистика сессии
     */
    updateProgress(stats) {
        if (this.progressInfo) {
            this.progressInfo.textContent = `Изучено: ${stats.learned} / ${stats.total}`;
        }
    }

    /**
     * Показать результаты (Bootstrap)
     * @param {Object} stats - Статистика сессии
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
     * Подсветить правильный/неправильный вариант (choice) - Bootstrap
     * @param {string} answer - Выбранный ответ
     * @param {string} correctAnswer - Правильный ответ
     * @param {boolean} isCorrect - Правильно ли
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
     * Подсветить input - Bootstrap
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
     * Подсветить assembly - Bootstrap
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
        
        // Скрываем управление и пул при ответе
        if (controls) {
            controls.classList.add('d-none');
        }
        if (pool) {
            pool.classList.add('d-none');
        }
    }

    /**
     * Добавить элемент в зону сборки - Bootstrap
     * @param {string} value - Буква или слово
     * @param {HTMLElement} sourceBtn - Исходная кнопка
     * @param {number|null} requiredLength - Требуемая длина (опционально)
     */
    addToAssembly(value, sourceBtn, requiredLength = null) {
        // Проверяем лимит, если указана требуемая длина
        if (requiredLength !== null && this.assemblyState.length >= requiredLength) {
            return; // Не добавляем, если достигнут лимит
        }
        
        const zone = document.getElementById('assembly-zone');
        if (!zone) return;

        // Убираем placeholder
        const placeholder = zone.querySelector('.assembly-placeholder');
        if (placeholder) {
            placeholder.classList.add('d-none');
        }

        // Добавляем элемент
        this.assemblyState.push(value);

        const span = document.createElement('span');
        span.className = 'badge bg-primary fs-5 assembled-item';
        span.textContent = value;
        span.dataset.index = this.assemblyState.length - 1;
        span.style.cursor = 'pointer';
        
        // Клик для удаления
        span.addEventListener('click', () => {
            this.removeFromAssembly(span, sourceBtn);
        });

        zone.appendChild(span);
        sourceBtn.disabled = true;
    }

    /**
     * Удалить элемент из сборки
     * @param {HTMLElement} span - Элемент в зоне сборки
     * @param {HTMLElement} sourceBtn - Исходная кнопка
     */
    removeFromAssembly(span, sourceBtn) {
        const zone = document.getElementById('assembly-zone');
        const index = parseInt(span.dataset.index);
        
        // Удаляем из состояния
        this.assemblyState.splice(index, 1);
        
        // Удаляем из DOM
        span.remove();
        
        // Возвращаем кнопку
        if (sourceBtn) {
            sourceBtn.disabled = false;
        }

        // Обновляем индексы
        const items = zone.querySelectorAll('.assembled-item');
        items.forEach((item, i) => {
            item.dataset.index = i;
        });

        // Показываем placeholder если пусто
        if (this.assemblyState.length === 0) {
            const placeholder = zone.querySelector('.assembly-placeholder');
            if (placeholder) {
                placeholder.classList.remove('d-none');
            }
        }
    }

    /**
     * Очистить зону сборки
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
    }

    /**
     * Получить собранный ответ
     * @param {string} type - Тип: 'assembly' или 'phrase_assembly'
     * @returns {string}
     */
    getAssembledAnswer(type) {
        if (type === 'phrase_assembly') {
            return this.assemblyState.join(' ');
        }
        return this.assemblyState.join('');
    }

    /**
     * Сбросить состояние сборки
     */
    resetAssemblyState() {
        this.assemblyState = [];
    }
}
