/**
 * Georgian Language Trainer — SPA Application
 * ============================================
 * Архитектура:
 *   A. Data Layer — MOCK_DATA, DataRepository
 *   B. Game Core Layer — GameSession, Utils
 *   C. Presentation Layer — QuestionRendererFactory, UIManager
 *   D. App Layer — App (точка входа)
 */

'use strict';

// ============================================
// A. СЛОЙ ДАННЫХ (DATA LAYER)
// ============================================

/**
 * Константа с тестовыми данными
 * Содержит буквы, слова и фразы для изучения
 */
const MOCK_DATA = {
    // Грузинские буквы с русскими аналогами
    letters: [
        { id: "l1", geo: "ა", rus: "а", type: "letter" },
        { id: "l2", geo: "ბ", rus: "б", type: "letter" },
        { id: "l3", geo: "გ", rus: "г", type: "letter" },
        { id: "l4", geo: "დ", rus: "д", type: "letter" },
        { id: "l5", geo: "ე", rus: "э", type: "letter" },
        { id: "l6", geo: "ვ", rus: "в", type: "letter" },
        { id: "l7", geo: "ზ", rus: "з", type: "letter" },
        { id: "l8", geo: "თ", rus: "тх", type: "letter", comment: "С придыханием" },
        { id: "l9", geo: "ი", rus: "и", type: "letter" },
        { id: "l10", geo: "კ", rus: "к", type: "letter", comment: "Резкое, без выдоха" },
        { id: "l11", geo: "ლ", rus: "л", type: "letter" },
        { id: "l12", geo: "მ", rus: "м", type: "letter" },
        { id: "l13", geo: "ნ", rus: "н", type: "letter" },
        { id: "l14", geo: "ო", rus: "о", type: "letter" },
        { id: "l15", geo: "პ", rus: "п", type: "letter", comment: "Лёгкое, на выдохе" },
        { id: "l16", geo: "ჟ", rus: "ж", type: "letter" },
        { id: "l17", geo: "რ", rus: "р", type: "letter" },
        { id: "l18", geo: "ს", rus: "с", type: "letter" },
        { id: "l19", geo: "ტ", rus: "т", type: "letter" },
        { id: "l20", geo: "უ", rus: "у", type: "letter" },
        { id: "l21", geo: "ფ", rus: "пф", type: "letter" },
        { id: "l22", geo: "ქ", rus: "кх", type: "letter", comment: "Лёгкое, на выдохе" },
        { id: "l23", geo: "ღ", rus: "гх", type: "letter" },
        { id: "l24", geo: "ყ", rus: "кх!", type: "letter", comment: "Глубокое, без выдоха" },
        { id: "l25", geo: "შ", rus: "ш", type: "letter", comment: "Мягкое" },
        { id: "l26", geo: "ჩ", rus: "ч", type: "letter" },
        { id: "l27", geo: "ც", rus: "ц", type: "letter" },
        { id: "l28", geo: "ძ", rus: "дз", type: "letter" },
        { id: "l29", geo: "წ", rus: "ц!", type: "letter", comment: "Резкое, без выдоха" },
        { id: "l30", geo: "ჭ", rus: "ч!", type: "letter", comment: "Резкое, без выдоха" },
        { id: "l31", geo: "ხ", rus: "х", type: "letter", comment: "Глубокое" },
        { id: "l32", geo: "ჯ", rus: "дж", type: "letter", comment: "Совмещённое" },
        { id: "l33", geo: "ჰ", rus: "хх", type: "letter", comment: "Лёгкое, на выдохе" }
    ],

    // Слова для изучения
    words: [
        { id: "w1", geo: "მამა", rus: "отец", type: "word" },
        { id: "w2", geo: "დედა", rus: "мать", type: "word" },
        { id: "w3", geo: "სახლი", rus: "дом", type: "word" },
        { id: "w4", geo: "წიგნი", rus: "книга", type: "word" },
        { id: "w5", geo: "ქალაქი", rus: "город", type: "word" },
        { id: "w6", geo: "მთა", rus: "гора", type: "word" },
        { id: "w7", geo: "წყალი", rus: "вода", type: "word" },
        { id: "w8", geo: "ძმა", rus: "брат", type: "word" },
        { id: "w9", geo: "და", rus: "сестра", type: "word" },
        { id: "w10", geo: "ბავშვი", rus: "ребенок", type: "word" },
        { id: "w11", geo: "კაცი", rus: "мужчина", type: "word" },
        { id: "w12", geo: "ქალი", rus: "женщина", type: "word" },
        { id: "w13", geo: "ძაღლი", rus: "собака", type: "word" },
        { id: "w14", geo: "კატა", rus: "кошка", type: "word" },
        { id: "w15", geo: "ხე", rus: "дерево", type: "word" },
        { id: "w16", geo: "მზე", rus: "солнце", type: "word" },
        { id: "w17", geo: "ღამე", rus: "ночь", type: "word" },
        { id: "w18", geo: "დღე", rus: "день", type: "word" },
        { id: "w19", geo: "პური", rus: "хлеб", type: "word" },
        { id: "w20", geo: "ღვინო", rus: "вино", type: "word" },
        { id: "w21", geo: "გზა", rus: "дорога", type: "word" },
        { id: "w22", geo: "ენა", rus: "язык", type: "word" },
        { id: "w23", geo: "სიყვარული", rus: "любовь", type: "word" },
        { id: "w24", geo: "მეგობარი", rus: "друг", type: "word" },
        { id: "w25", geo: "კარგი", rus: "хороший", type: "word" },
        { id: "w26", geo: "ცუდი", rus: "плохой", type: "word" },
        { id: "w27", geo: "დიდი", rus: "большой", type: "word" },
        { id: "w28", geo: "პატარა", rus: "маленький", type: "word" },
        { id: "w29", geo: "ახალი", rus: "новый", type: "word" },
        { id: "w30", geo: "ლამაზი", rus: "красивый", type: "word" }
    ],

    // Фразы для изучения
    phrases: [
        {
            id: "p1",
            rus_phrase: "Это мой дом.",
            geo_phrase: "ეს ჩემი სახლია.",
            geo_words_shuffled: ["სახლია", "ჩემი", "ეს"],
            type: "phrase"
        },
        {
            id: "p2",
            rus_phrase: "Как тебя зовут?",
            geo_phrase: "რა გქვია?",
            geo_words_shuffled: ["გქვია", "რა"],
            type: "phrase"
        },
        {
            id: "p3",
            rus_phrase: "Где твоя книга?",
            geo_phrase: "სად არის შენი წიგნი?",
            geo_words_shuffled: ["წიგნი", "შენი", "არის", "სად"],
            type: "phrase"
        },
        {
            id: "p4",
            rus_phrase: "Я тебя люблю.",
            geo_phrase: "მე შენ მიყვარხარ.",
            geo_words_shuffled: ["მიყვარხარ", "შენ", "მე"],
            type: "phrase"
        },
        {
            id: "p5",
            rus_phrase: "Это твоя книга?",
            geo_phrase: "ეს შენი წიგნია?",
            geo_words_shuffled: ["წიგნია", "შენი", "ეს"],
            type: "phrase"
        },
        {
            id: "p6",
            rus_phrase: "Он их друг.",
            geo_phrase: "ის მათი მეგობარია.",
            geo_words_shuffled: ["მეგობარია", "მათი", "ის"],
            type: "phrase"
        },
        {
            id: "p7",
            rus_phrase: "Где ваша машина?",
            geo_phrase: "სად არის თქვენი მანქანა?",
            geo_words_shuffled: ["მანქანა", "თქვენი", "არის", "სად"],
            type: "phrase"
        },
        {
            id: "p8",
            rus_phrase: "Это наша школа.",
            geo_phrase: "ეს ჩვენი სკოლაა.",
            geo_words_shuffled: ["სკოლაა", "ჩვენი", "ეს"],
            type: "phrase"
        }
    ],

    // Простые слова для режима сборки (translit)
    simpleWords: [
        { id: "sw1", geo: "მამა", translit: "мама", type: "simple_word" },
        { id: "sw2", geo: "დედა", translit: "дэда", type: "simple_word" },
        { id: "sw3", geo: "კატა", translit: "ката", type: "simple_word" },
        { id: "sw4", geo: "სახლი", translit: "сахли", type: "simple_word" },
        { id: "sw5", geo: "წიგნი", translit: "цигни", type: "simple_word" },
        { id: "sw6", geo: "ვარ", translit: "вар", type: "simple_word" },
        { id: "sw7", geo: "და", translit: "да", type: "simple_word" },
        { id: "sw8", geo: "არის", translit: "арис", type: "simple_word" }
    ]
};

/**
 * Класс DataRepository
 * Отвечает за выборку данных из MOCK_DATA
 */
class DataRepository {
    /**
     * Получить данные для выбранного режима
     * @param {string} mode - 'letters' или 'words'
     * @returns {Array} Массив элементов для изучения
     */
    getData(mode) {
        if (mode === 'letters') {
            return [...MOCK_DATA.letters];
        } else if (mode === 'words') {
            // Для режима слов объединяем слова и фразы
            return [...MOCK_DATA.words, ...MOCK_DATA.phrases];
        }
        return [];
    }

    /**
     * Получить все буквы (для генерации вариантов ответа)
     * @returns {Array}
     */
    getAllLetters() {
        return [...MOCK_DATA.letters];
    }

    /**
     * Получить все слова
     * @returns {Array}
     */
    getAllWords() {
        return [...MOCK_DATA.words];
    }

    /**
     * Получить простые слова для транслитерации
     * @returns {Array}
     */
    getSimpleWords() {
        return [...MOCK_DATA.simpleWords];
    }

    /**
     * Создать маппинг грузинских букв на русские
     * @returns {Map}
     */
    getGeoToRusMap() {
        const map = new Map();
        MOCK_DATA.letters.forEach(letter => {
            map.set(letter.geo, letter.rus);
        });
        return map;
    }

    /**
     * Создать маппинг русских букв на грузинские
     * @returns {Map}
     */
    getRusToGeoMap() {
        const map = new Map();
        MOCK_DATA.letters.forEach(letter => {
            map.set(letter.rus, letter.geo);
        });
        return map;
    }
}


// ============================================
// B. ЯДРО ИГРЫ (GAME CORE LAYER)
// ============================================

/**
 * Класс Utils
 * Статические вспомогательные методы
 */
class Utils {
    /**
     * Перемешать массив (Fisher-Yates shuffle)
     * @param {Array} array
     * @returns {Array} Новый перемешанный массив
     */
    static shuffleArray(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * Получить случайное целое число в диапазоне [min, max]
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Выбрать N случайных элементов из массива
     * @param {Array} array
     * @param {number} n
     * @param {*} exclude - Элемент, который нужно исключить
     * @returns {Array}
     */
    static getRandomElements(array, n, exclude = null) {
        let filtered = exclude ? array.filter(item => item !== exclude && item.id !== exclude?.id) : array;
        return Utils.shuffleArray(filtered).slice(0, n);
    }

    /**
     * Выбрать случайный элемент из массива
     * @param {Array} array
     * @returns {*}
     */
    static getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

/**
 * Класс GameSession
 * Управляет состоянием текущей игровой сессии
 */
class GameSession {
    /**
     * @param {string} mode - Режим игры ('letters' или 'words')
     * @param {Array} items - Массив элементов для изучения
     */
    constructor(mode, items) {
        this.mode = mode;
        this.items = items;
        this.score = 0;
        this.totalAnswered = 0;
        
        // Прогресс каждого элемента: id -> successCount
        this.progress = new Map();
        items.forEach(item => this.progress.set(item.id, 0));
        
        // Лимит успешных ответов для считания элемента выученным
        this.SUCCESS_LIMIT = 3;
        
        // Буфер последних вопросов (для spaced repetition)
        this.BUFFER_SIZE = 3;
        this.recentQuestions = [];
        
        // Последний заданный вопрос (чтобы не повторялся подряд)
        this.lastQuestionId = null;
        
        // Текущий вопрос
        this.currentQuestion = null;
        
        // Шаблоны вопросов для каждого режима
        this.letterTemplates = [
            'choice_geo_rus',
            'choice_rus_geo',
            'input_geo_rus',
            'input_rus_geo',
            'word_assembly',
            'translit_input'
        ];
        
        this.wordTemplates = [
            'translate_input',
            'phrase_assembly'
        ];
    }

    /**
     * Получить активные (невыученные) элементы
     * @returns {Array}
     */
    getActiveItems() {
        return this.items.filter(item => this.progress.get(item.id) < this.SUCCESS_LIMIT);
    }

    /**
     * Проверить, завершена ли игра
     * @returns {boolean}
     */
    isGameComplete() {
        return this.getActiveItems().length === 0;
    }

    /**
     * Получить количество выученных элементов
     * @returns {number}
     */
    getLearnedCount() {
        return this.items.filter(item => this.progress.get(item.id) >= this.SUCCESS_LIMIT).length;
    }

    /**
     * Получить процент прогресса
     * @returns {number}
     */
    getProgressPercent() {
        const totalSuccess = Array.from(this.progress.values())
            .reduce((sum, count) => sum + Math.min(count, this.SUCCESS_LIMIT), 0);
        const maxSuccess = this.items.length * this.SUCCESS_LIMIT;
        return Math.round((totalSuccess / maxSuccess) * 100);
    }

    /**
     * Выбрать следующий элемент с учетом spaced repetition
     * @returns {Object|null}
     */
    selectNextItem() {
        const activeItems = this.getActiveItems();
        if (activeItems.length === 0) return null;

        // Фильтруем элементы, которые были недавно
        let candidates = activeItems.filter(item => !this.recentQuestions.includes(item.id));
        
        // Если все активные элементы в буфере, берем все активные кроме последнего
        if (candidates.length === 0) {
            candidates = activeItems.filter(item => item.id !== this.lastQuestionId);
        }
        
        // Если остался только один активный элемент
        if (candidates.length === 0) {
            candidates = activeItems;
        }

        // Приоритет элементам с меньшим прогрессом
        candidates.sort((a, b) => this.progress.get(a.id) - this.progress.get(b.id));
        
        // Выбираем из первой трети кандидатов
        const topCandidates = candidates.slice(0, Math.max(1, Math.ceil(candidates.length / 3)));
        return Utils.getRandomElement(topCandidates);
    }

    /**
     * Выбрать случайный шаблон вопроса
     * @param {Object} item - Элемент для вопроса
     * @returns {string}
     */
    selectTemplate(item) {
        if (this.mode === 'letters') {
            return Utils.getRandomElement(this.letterTemplates);
        } else {
            // Для слов — translate_input, для фраз — phrase_assembly
            if (item.type === 'phrase') {
                return 'phrase_assembly';
            }
            return 'translate_input';
        }
    }

    /**
     * Сгенерировать следующий вопрос
     * @returns {Object|null}
     */
    generateNextQuestion() {
        const item = this.selectNextItem();
        if (!item) return null;

        const template = this.selectTemplate(item);
        
        this.currentQuestion = {
            item: item,
            template: template,
            answered: false
        };

        return this.currentQuestion;
    }

    /**
     * Обработать ответ пользователя
     * @param {boolean} isCorrect
     */
    processAnswer(isCorrect) {
        if (!this.currentQuestion || this.currentQuestion.answered) return;
        
        this.currentQuestion.answered = true;
        this.totalAnswered++;
        
        const itemId = this.currentQuestion.item.id;
        
        if (isCorrect) {
            this.score++;
            const currentProgress = this.progress.get(itemId);
            this.progress.set(itemId, currentProgress + 1);
        }
        
        // Обновляем буфер последних вопросов
        this.recentQuestions.push(itemId);
        if (this.recentQuestions.length > this.BUFFER_SIZE) {
            this.recentQuestions.shift();
        }
        
        this.lastQuestionId = itemId;
    }

    /**
     * Получить статистику сессии
     * @returns {Object}
     */
    getStats() {
        return {
            score: this.score,
            total: this.totalAnswered,
            learned: this.getLearnedCount(),
            totalItems: this.items.length,
            accuracy: this.totalAnswered > 0 
                ? Math.round((this.score / this.totalAnswered) * 100) 
                : 0,
            progressPercent: this.getProgressPercent()
        };
    }
}


// ============================================
// C. СЛОЙ ПРЕДСТАВЛЕНИЯ (PRESENTATION LAYER)
// ============================================

/**
 * Класс QuestionRendererFactory (Паттерн Фабрика)
 * Создает DOM-элементы для различных типов вопросов
 */
class QuestionRendererFactory {
    constructor(dataRepository) {
        this.dataRepository = dataRepository;
        this.geoToRusMap = dataRepository.getGeoToRusMap();
        this.rusToGeoMap = dataRepository.getRusToGeoMap();
    }

    /**
     * Создать рендер для вопроса
     * @param {Object} question - Объект вопроса
     * @returns {HTMLElement}
     */
    render(question) {
        const { item, template } = question;
        
        switch (template) {
            case 'choice_geo_rus':
                return this.renderChoiceGeoRus(item);
            case 'choice_rus_geo':
                return this.renderChoiceRusGeo(item);
            case 'input_geo_rus':
                return this.renderInputGeoRus(item);
            case 'input_rus_geo':
                return this.renderInputRusGeo(item);
            case 'word_assembly':
                return this.renderWordAssembly(item);
            case 'translit_input':
                return this.renderTranslitInput(item);
            case 'translate_input':
                return this.renderTranslateInput(item);
            case 'phrase_assembly':
                return this.renderPhraseAssembly(item);
            default:
                console.error('Unknown template:', template);
                return document.createElement('div');
        }
    }

    /**
     * Шаблон: Грузинская буква -> Выбор русской
     */
    renderChoiceGeoRus(item) {
        const container = document.createElement('div');
        container.className = 'question-template choice-template';
        
        // Вопрос
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-display';
        questionDiv.innerHTML = `
            <div class="question-label">Какая буква?</div>
            <div class="question-text">${item.geo}</div>
        `;
        container.appendChild(questionDiv);
        
        // Варианты ответов
        const allLetters = this.dataRepository.getAllLetters();
        const wrongOptions = Utils.getRandomElements(allLetters, 3, item);
        const options = Utils.shuffleArray([item, ...wrongOptions]);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options-grid cols-4';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.rus;
            btn.dataset.action = 'select-option';
            btn.dataset.value = opt.rus;
            btn.dataset.correct = (opt.id === item.id).toString();
            optionsDiv.appendChild(btn);
        });
        
        container.appendChild(optionsDiv);
        container.dataset.correctAnswer = item.rus;
        
        return container;
    }

    /**
     * Шаблон: Русская буква -> Выбор грузинской
     */
    renderChoiceRusGeo(item) {
        const container = document.createElement('div');
        container.className = 'question-template choice-template';
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-display';
        questionDiv.innerHTML = `
            <div class="question-label">Найди грузинскую букву</div>
            <div class="question-text">${item.rus}</div>
        `;
        container.appendChild(questionDiv);
        
        const allLetters = this.dataRepository.getAllLetters();
        const wrongOptions = Utils.getRandomElements(allLetters, 3, item);
        const options = Utils.shuffleArray([item, ...wrongOptions]);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options-grid cols-4';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.geo;
            btn.dataset.action = 'select-option';
            btn.dataset.value = opt.geo;
            btn.dataset.correct = (opt.id === item.id).toString();
            optionsDiv.appendChild(btn);
        });
        
        container.appendChild(optionsDiv);
        container.dataset.correctAnswer = item.geo;
        
        return container;
    }

    /**
     * Шаблон: Грузинская буква -> Ввод русской
     */
    renderInputGeoRus(item) {
        const container = document.createElement('div');
        container.className = 'question-template input-template';
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-display';
        questionDiv.innerHTML = `
            <div class="question-label">Введи русский аналог</div>
            <div class="question-text">${item.geo}</div>
        `;
        container.appendChild(questionDiv);
        
        const inputDiv = document.createElement('div');
        inputDiv.className = 'input-container';
        inputDiv.innerHTML = `
            <input type="text" class="answer-input" id="answer-input" 
                   placeholder="Введите ответ" autocomplete="off" autocapitalize="off">
            <button class="submit-btn" data-action="submit-input">Проверить</button>
        `;
        container.appendChild(inputDiv);
        
        container.dataset.correctAnswer = item.rus.toLowerCase();
        
        return container;
    }

    /**
     * Шаблон: Русская буква -> Ввод грузинской
     */
    renderInputRusGeo(item) {
        const container = document.createElement('div');
        container.className = 'question-template input-template';
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-display';
        questionDiv.innerHTML = `
            <div class="question-label">Введи грузинскую букву</div>
            <div class="question-text">${item.rus}</div>
        `;
        container.appendChild(questionDiv);
        
        const inputDiv = document.createElement('div');
        inputDiv.className = 'input-container';
        inputDiv.innerHTML = `
            <input type="text" class="answer-input" id="answer-input" 
                   placeholder="Введите ответ" autocomplete="off" autocapitalize="off">
            <button class="submit-btn" data-action="submit-input">Проверить</button>
        `;
        container.appendChild(inputDiv);
        
        container.dataset.correctAnswer = item.geo;
        
        return container;
    }

    /**
     * Шаблон: Сборка слова из русских букв
     */
    renderWordAssembly(item) {
        const container = document.createElement('div');
        container.className = 'question-template assembly-template';
        
        // Берем случайное простое слово для сборки
        const simpleWords = this.dataRepository.getSimpleWords();
        const wordItem = Utils.getRandomElement(simpleWords);
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-display';
        questionDiv.innerHTML = `
            <div class="question-label">Собери слово по буквам</div>
            <div class="question-text">${wordItem.geo}</div>
        `;
        container.appendChild(questionDiv);
        
        // Разбиваем транслитерацию на буквы
        const letters = wordItem.translit.split('');
        const shuffledLetters = Utils.shuffleArray(letters);
        
        const assemblyDiv = document.createElement('div');
        assemblyDiv.className = 'assembly-container';
        
        // Область ответа
        assemblyDiv.innerHTML = `
            <div class="assembly-answer" id="assembly-answer"></div>
            <div class="pool-container" id="letter-pool">
                ${shuffledLetters.map((letter, idx) => 
                    `<button class="pool-btn" data-action="add-letter" data-letter="${letter}" data-idx="${idx}">${letter}</button>`
                ).join('')}
            </div>
            <div class="assembly-controls">
                <button class="clear-btn" data-action="clear-assembly">🗑</button>
                <button class="check-btn" data-action="check-assembly" disabled>Проверить</button>
            </div>
        `;
        
        container.appendChild(assemblyDiv);
        container.dataset.correctAnswer = wordItem.translit;
        container.dataset.totalLetters = letters.length.toString();
        
        return container;
    }

    /**
     * Шаблон: Транслитерация -> Ввод грузинского
     */
    renderTranslitInput(item) {
        const container = document.createElement('div');
        container.className = 'question-template input-template';
        
        // Берем случайное простое слово
        const simpleWords = this.dataRepository.getSimpleWords();
        const wordItem = Utils.getRandomElement(simpleWords);
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-display';
        questionDiv.innerHTML = `
            <div class="question-label">Напиши по-грузински</div>
            <div class="question-text">${wordItem.translit}</div>
        `;
        container.appendChild(questionDiv);
        
        const inputDiv = document.createElement('div');
        inputDiv.className = 'input-container';
        inputDiv.innerHTML = `
            <input type="text" class="answer-input" id="answer-input" 
                   placeholder="Введите ответ" autocomplete="off" autocapitalize="off">
            <button class="submit-btn" data-action="submit-input">Проверить</button>
        `;
        container.appendChild(inputDiv);
        
        container.dataset.correctAnswer = wordItem.geo;
        
        return container;
    }

    /**
     * Шаблон: Перевод слова
     */
    renderTranslateInput(item) {
        const container = document.createElement('div');
        container.className = 'question-template input-template';
        
        // Случайно выбираем направление перевода
        const geoToRus = Math.random() > 0.5;
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-display';
        
        if (geoToRus) {
            questionDiv.innerHTML = `
                <div class="question-label">Переведи на русский</div>
                <div class="question-text small">${item.geo}</div>
            `;
            container.dataset.correctAnswer = item.rus.toLowerCase();
        } else {
            questionDiv.innerHTML = `
                <div class="question-label">Переведи на грузинский</div>
                <div class="question-text small">${item.rus}</div>
            `;
            container.dataset.correctAnswer = item.geo;
        }
        
        container.appendChild(questionDiv);
        
        const inputDiv = document.createElement('div');
        inputDiv.className = 'input-container';
        inputDiv.innerHTML = `
            <input type="text" class="answer-input" id="answer-input" 
                   placeholder="Введите перевод" autocomplete="off" autocapitalize="off">
            <button class="submit-btn" data-action="submit-input">Проверить</button>
        `;
        container.appendChild(inputDiv);
        
        return container;
    }

    /**
     * Шаблон: Сборка фразы из слов
     */
    renderPhraseAssembly(item) {
        const container = document.createElement('div');
        container.className = 'question-template assembly-template';
        
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-display';
        questionDiv.innerHTML = `
            <div class="question-label">Собери фразу</div>
            <div class="question-text small">${item.rus_phrase}</div>
        `;
        container.appendChild(questionDiv);
        
        // Перемешанные слова
        const shuffledWords = Utils.shuffleArray([...item.geo_words_shuffled]);
        
        const assemblyDiv = document.createElement('div');
        assemblyDiv.className = 'assembly-container';
        
        assemblyDiv.innerHTML = `
            <div class="assembly-answer" id="assembly-answer"></div>
            <div class="pool-container" id="word-pool">
                ${shuffledWords.map((word, idx) => 
                    `<button class="pool-btn" data-action="add-word" data-word="${word}" data-idx="${idx}">${word}</button>`
                ).join('')}
            </div>
            <div class="assembly-controls">
                <button class="clear-btn" data-action="clear-assembly">🗑</button>
                <button class="check-btn" data-action="check-assembly" disabled>Проверить</button>
            </div>
        `;
        
        container.appendChild(assemblyDiv);
        container.dataset.correctAnswer = item.geo_phrase;
        container.dataset.totalWords = item.geo_words_shuffled.length.toString();
        
        return container;
    }
}

/**
 * Класс UIManager
 * Управляет интерфейсом приложения
 */
class UIManager {
    constructor() {
        // Экраны
        this.screens = {
            home: document.getElementById('screen-home'),
            game: document.getElementById('screen-game'),
            result: document.getElementById('screen-result')
        };
        
        // Элементы игрового экрана
        this.questionArea = document.getElementById('question-area');
        this.feedbackContainer = document.getElementById('feedback-container');
        this.feedbackMessage = document.getElementById('feedback-message');
        this.nextBtn = document.getElementById('next-btn');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        
        // Элементы результата
        this.resultScore = document.getElementById('result-score');
        this.resultTotal = document.getElementById('result-total');
        this.resultAccuracy = document.getElementById('result-accuracy');
        
        // Состояние сборки (для assembly шаблонов)
        this.assemblyState = [];
    }

    /**
     * Переключить экран
     * @param {string} screenName - 'home', 'game', или 'result'
     */
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
    }

    /**
     * Отрисовать вопрос
     * @param {HTMLElement} questionElement
     */
    renderQuestion(questionElement) {
        this.questionArea.innerHTML = '';
        this.questionArea.appendChild(questionElement);
        this.hideFeedback();
        this.assemblyState = [];
        
        // Фокус на поле ввода, если есть
        const input = this.questionArea.querySelector('#answer-input');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }

    /**
     * Обновить прогресс
     * @param {number} current - Текущее количество выученных
     * @param {number} total - Общее количество
     * @param {number} percent - Процент прогресса
     */
    updateProgress(current, total, percent) {
        this.progressFill.style.width = `${percent}%`;
        this.progressText.textContent = `${current} / ${total}`;
    }

    /**
     * Показать обратную связь
     * @param {boolean} isCorrect
     * @param {string} message
     * @param {boolean} autoNext - Автоматический переход
     */
    showFeedback(isCorrect, message, autoNext = false) {
        this.feedbackContainer.classList.remove('hidden', 'correct', 'incorrect');
        this.feedbackContainer.classList.add(isCorrect ? 'correct' : 'incorrect');
        this.feedbackMessage.textContent = message;
        
        if (autoNext) {
            this.nextBtn.classList.add('hidden');
        } else {
            this.nextBtn.classList.remove('hidden');
        }
    }

    /**
     * Скрыть обратную связь
     */
    hideFeedback() {
        this.feedbackContainer.classList.add('hidden');
    }

    /**
     * Подсветить выбранный вариант
     * @param {HTMLElement} button
     * @param {boolean} isCorrect
     */
    highlightOption(button, isCorrect) {
        button.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Если неверно, подсветить правильный ответ
        if (!isCorrect) {
            const correctBtn = this.questionArea.querySelector('[data-correct="true"]');
            if (correctBtn) {
                correctBtn.classList.add('correct');
            }
        }
        
        // Заблокировать все кнопки
        this.questionArea.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });
    }

    /**
     * Подсветить поле ввода
     * @param {boolean} isCorrect
     */
    highlightInput(isCorrect) {
        const input = this.questionArea.querySelector('#answer-input');
        const submitBtn = this.questionArea.querySelector('.submit-btn');
        
        if (input) {
            input.classList.add(isCorrect ? 'correct' : 'incorrect');
            input.disabled = true;
        }
        if (submitBtn) {
            if (!isCorrect) {
                submitBtn.style.display = 'none';
            } else {
                submitBtn.disabled = true;
            }
        }
    }

    /**
     * Подсветить область сборки
     * @param {boolean} isCorrect
     */
    highlightAssembly(isCorrect) {
        const assemblyAnswer = this.questionArea.querySelector('#assembly-answer');
        if (assemblyAnswer) {
            assemblyAnswer.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        
        // Заблокировать кнопки пула
        this.questionArea.querySelectorAll('.pool-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        // Скрыть assembly-controls при неверном ответе, заблокировать при верном
        const assemblyControls = this.questionArea.querySelector('.assembly-controls');
        if (assemblyControls) {
            if (!isCorrect) {
                assemblyControls.style.display = 'none';
            } else {
                assemblyControls.querySelectorAll('button').forEach(btn => {
                    btn.disabled = true;
                });
            }
        }
    }

    /**
     * Добавить элемент в область сборки
     * @param {string} value - Буква или слово
     * @param {number} idx - Индекс кнопки
     */
    addToAssembly(value, idx) {
        // Проверяем, не достигнут ли лимит
        const template = this.questionArea.querySelector('.question-template');
        if (template) {
            const totalLetters = parseInt(template.dataset.totalLetters || '0');
            const totalWords = parseInt(template.dataset.totalWords || '0');
            const required = totalLetters || totalWords;
            
            if (required > 0 && this.assemblyState.length >= required) {
                return; // Лимит достигнут, не добавляем
            }
        }
        
        this.assemblyState.push({ value, idx });
        this.updateAssemblyDisplay();
        
        // Пометить кнопку как использованную
        const btn = this.questionArea.querySelector(`[data-idx="${idx}"]`);
        if (btn) {
            btn.classList.add('used');
        }
        
        // Обновить кнопку проверки
        this.updateCheckButton();
    }

    /**
     * Удалить последний элемент из сборки
     */
    removeLastFromAssembly() {
        const removed = this.assemblyState.pop();
        if (removed) {
            const btn = this.questionArea.querySelector(`[data-idx="${removed.idx}"]`);
            if (btn) {
                btn.classList.remove('used');
            }
        }
        this.updateAssemblyDisplay();
        this.updateCheckButton();
    }

    /**
     * Очистить область сборки
     */
    clearAssembly() {
        this.assemblyState.forEach(item => {
            const btn = this.questionArea.querySelector(`[data-idx="${item.idx}"]`);
            if (btn) {
                btn.classList.remove('used');
            }
        });
        this.assemblyState = [];
        this.updateAssemblyDisplay();
        this.updateCheckButton();
    }

    /**
     * Обновить отображение сборки
     */
    updateAssemblyDisplay() {
        const assemblyAnswer = this.questionArea.querySelector('#assembly-answer');
        if (assemblyAnswer) {
            assemblyAnswer.innerHTML = this.assemblyState.map(item => 
                `<span class="answer-piece" data-idx="${item.idx}">${item.value}</span>`
            ).join('');
        }
    }

    /**
     * Обновить состояние кнопки проверки
     */
    updateCheckButton() {
        const checkBtn = this.questionArea.querySelector('.check-btn');
        const template = this.questionArea.querySelector('.question-template');
        
        if (!checkBtn || !template) return;
        
        const totalLetters = parseInt(template.dataset.totalLetters || '0');
        const totalWords = parseInt(template.dataset.totalWords || '0');
        const required = totalLetters || totalWords;
        
        checkBtn.disabled = this.assemblyState.length !== required;
    }

    /**
     * Получить собранный ответ
     * @returns {string}
     */
    getAssemblyAnswer() {
        return this.assemblyState.map(item => item.value).join('');
    }

    /**
     * Показать результаты
     * @param {Object} stats
     */
    showResults(stats) {
        this.resultScore.textContent = stats.score;
        this.resultTotal.textContent = stats.total;
        this.resultAccuracy.textContent = `${stats.accuracy}%`;
        this.showScreen('result');
    }
}


// ============================================
// D. ТОЧКА ВХОДА (APP LAYER)
// ============================================

/**
 * Класс App
 * Главный класс приложения, связывает все компоненты
 */
class App {
    constructor() {
        this.dataRepository = new DataRepository();
        this.uiManager = new UIManager();
        this.questionRenderer = new QuestionRendererFactory(this.dataRepository);
        this.gameSession = null;
        this.currentMode = null;
        
        this.init();
    }

    /**
     * Инициализация приложения
     */
    init() {
        this.bindEvents();
        this.uiManager.showScreen('home');
    }

    /**
     * Привязка обработчиков событий (делегирование)
     */
    bindEvents() {
        // Глобальный обработчик кликов через делегирование
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.dataset.action;
            
            switch (action) {
                case 'start-game':
                    this.startGame(target.dataset.mode);
                    break;
                case 'go-home':
                    this.goHome();
                    break;
                case 'restart-game':
                    this.startGame(this.currentMode);
                    break;
                case 'select-option':
                    this.handleOptionSelect(target);
                    break;
                case 'submit-input':
                    this.handleInputSubmit();
                    break;
                case 'add-letter':
                    this.handleAddLetter(target);
                    break;
                case 'add-word':
                    this.handleAddWord(target);
                    break;
                case 'clear-assembly':
                    this.uiManager.clearAssembly();
                    break;
                case 'check-assembly':
                    this.handleCheckAssembly();
                    break;
                case 'next-question':
                    this.nextQuestion();
                    break;
            }
        });

        // Обработчик нажатия Enter в полях ввода
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const input = document.getElementById('answer-input');
                if (input && document.activeElement === input) {
                    this.handleInputSubmit();
                }
            }
        });

        // Удаление элементов из сборки по клику
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-piece')) {
                this.uiManager.removeLastFromAssembly();
            }
        });
    }

    /**
     * Начать игру
     * @param {string} mode - 'letters' или 'words'
     */
    startGame(mode) {
        this.currentMode = mode;
        const items = this.dataRepository.getData(mode);
        
        // Ограничиваем количество элементов для сессии
        const sessionItems = Utils.shuffleArray(items).slice(0, 10);
        
        this.gameSession = new GameSession(mode, sessionItems);
        
        this.uiManager.showScreen('game');
        this.updateProgressUI();
        
        this.nextQuestion();
    }

    /**
     * Вернуться на главный экран
     */
    goHome() {
        this.gameSession = null;
        this.uiManager.showScreen('home');
    }

    /**
     * Следующий вопрос
     */
    nextQuestion() {
        if (!this.gameSession) return;
        
        if (this.gameSession.isGameComplete()) {
            this.endGame();
            return;
        }
        
        const question = this.gameSession.generateNextQuestion();
        if (!question) {
            this.endGame();
            return;
        }
        
        const questionElement = this.questionRenderer.render(question);
        this.uiManager.renderQuestion(questionElement);
        this.updateProgressUI();
    }

    /**
     * Обработка выбора варианта
     * @param {HTMLElement} button
     */
    handleOptionSelect(button) {
        if (button.disabled) return;
        
        const isCorrect = button.dataset.correct === 'true';
        const correctAnswer = this.uiManager.questionArea.querySelector('.question-template').dataset.correctAnswer;
        
        this.uiManager.highlightOption(button, isCorrect);
        this.processAnswer(isCorrect, correctAnswer);
    }

    /**
     * Обработка отправки ввода
     */
    handleInputSubmit() {
        const input = document.getElementById('answer-input');
        if (!input || input.disabled) return;
        
        const userAnswer = input.value.trim().toLowerCase();
        const template = this.uiManager.questionArea.querySelector('.question-template');
        const correctAnswer = template.dataset.correctAnswer;
        
        const isCorrect = userAnswer === correctAnswer.toLowerCase();
        
        this.uiManager.highlightInput(isCorrect);
        this.processAnswer(isCorrect, correctAnswer);
    }

    /**
     * Добавить букву в сборку
     * @param {HTMLElement} button
     */
    handleAddLetter(button) {
        if (button.classList.contains('used')) return;
        
        const letter = button.dataset.letter;
        const idx = button.dataset.idx;
        
        this.uiManager.addToAssembly(letter, idx);
    }

    /**
     * Добавить слово в сборку
     * @param {HTMLElement} button
     */
    handleAddWord(button) {
        if (button.classList.contains('used')) return;
        
        const word = button.dataset.word;
        const idx = button.dataset.idx;
        
        this.uiManager.addToAssembly(word, idx);
    }

    /**
     * Проверить сборку
     */
    handleCheckAssembly() {
        const template = this.uiManager.questionArea.querySelector('.question-template');
        const correctAnswer = template.dataset.correctAnswer;
        
        let userAnswer = this.uiManager.getAssemblyAnswer();
        
        // Для фраз добавляем пробелы между словами
        if (template.dataset.totalWords) {
            userAnswer = this.uiManager.assemblyState.map(item => item.value).join(' ');
        }
        
        // Нормализуем для сравнения (убираем лишние пробелы, приводим к нижнему регистру)
        const normalizedUser = userAnswer.toLowerCase().replace(/\s+/g, ' ').trim();
        const normalizedCorrect = correctAnswer.toLowerCase().replace(/\s+/g, ' ').trim();
        
        const isCorrect = normalizedUser === normalizedCorrect;
        
        this.uiManager.highlightAssembly(isCorrect);
        this.processAnswer(isCorrect, correctAnswer);
    }

    /**
     * Обработать ответ
     * @param {boolean} isCorrect
     * @param {string} correctAnswer
     */
    processAnswer(isCorrect, correctAnswer) {
        this.gameSession.processAnswer(isCorrect);
        
        this.updateProgressUI();
        
        if (isCorrect) {
            this.uiManager.showFeedback(true, 'Правильно! 🎉', true);
            // Автопереход через 1 секунду
            setTimeout(() => this.nextQuestion(), 1000);
        } else {
            this.uiManager.showFeedback(false, `Правильный ответ: ${correctAnswer}`);
        }
    }

    /**
     * Обновить UI прогресса
     */
    updateProgressUI() {
        if (!this.gameSession) return;
        
        const stats = this.gameSession.getStats();
        this.uiManager.updateProgress(stats.learned, stats.totalItems, stats.progressPercent);
    }

    /**
     * Завершить игру
     */
    endGame() {
        const stats = this.gameSession.getStats();
        this.uiManager.showResults(stats);
    }
}


// ============================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ============================================

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
