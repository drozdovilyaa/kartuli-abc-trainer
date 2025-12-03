/**
 * Presentation Layer — Генератор вопросов
 * ========================================
 * Фабрика для создания рендереров различных типов вопросов
 */

'use strict';

import { Utils } from './utils.js';
import { DataRepository } from './state.js';

/**
 * QuestionRendererFactory — Фабрика рендереров вопросов
 * Создаёт DOM-элементы для разных шаблонов вопросов (Bootstrap 5.3)
 */
export class QuestionRendererFactory {
    /** Массив классов грузинских шрифтов */
    static GEO_FONTS = ['geo-font-1', 'geo-font-2', 'geo-font-3'];

    /**
     * Получить случайный класс грузинского шрифта
     * @returns {string} CSS класс шрифта
     */
    static getRandomFontClass() {
        const index = Math.floor(Math.random() * QuestionRendererFactory.GEO_FONTS.length);
        return QuestionRendererFactory.GEO_FONTS[index];
    }

    /**
     * Получить рендерер по типу шаблона
     * @param {string} template - Тип шаблона
     * @returns {Function} - Функция-рендерер
     */
    static getRenderer(template) {
        const renderers = {
            'choice_geo_rus': QuestionRendererFactory.renderChoiceGeoRus,
            'choice_rus_geo': QuestionRendererFactory.renderChoiceRusGeo,
            'input_geo_rus': QuestionRendererFactory.renderInputGeoRus,
            'input_rus_geo': QuestionRendererFactory.renderInputRusGeo,
            'word_assembly': QuestionRendererFactory.renderWordAssembly,
            'translit_input': QuestionRendererFactory.renderTranslitInput,
            'translate_input': QuestionRendererFactory.renderTranslateInput,
            'phrase_assembly': QuestionRendererFactory.renderPhraseAssembly
        };
        return renderers[template] || null;
    }

    /**
     * Генерирует HTML для кнопки подсказки (открывает модалку)
     * @param {string} translation - Текст перевода
     * @returns {string} HTML строка
     */
    static renderHintButton(translation) {
        if (!translation) return '';
        return `
            <button class="btn btn-sm btn-outline-warning ms-2" id="hint-btn" 
                    data-hint="${translation}" title="Показать подсказку">
                <i class="bi bi-lightbulb"></i>
            </button>`;
    }

    /**
     * Шаблон: Выбор русского перевода по грузинскому
     */
    static renderChoiceGeoRus(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.rus;
        // Фильтруем только элементы с полем rus (исключаем фразы с rus_phrase)
        const others = allItems.filter(i => i.rus && i.rus !== correctAnswer);
        const distractors = Utils.getRandomElements(others, 3).map(i => i.rus);
        const options = Utils.shuffleArray([correctAnswer, ...distractors]);
        const fontClass = QuestionRendererFactory.getRandomFontClass();

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">${item.type === 'word' ? 'Выберите перевод' : 'Какая буква соответствует?'}</p>
            <div class="${item.type === 'word' ? 'display-4' : 'display-1'} fw-bold text-primary ${fontClass}">${item.geo}</div>
        `;

        answerContainer.innerHTML = `
            <div class="row g-2">
                ${options.map(opt => `
                    <div class="col-6">
                        <button class="btn btn-outline-secondary w-100 py-3 fs-4 fw-bold option-btn" data-answer="${opt}">${opt}</button>
                    </div>
                `).join('')}
            </div>
        `;

        return { type: 'choice', correctAnswer, itemId: item.id };
    }

    /**
     * Шаблон: Выбор грузинского по русскому
     */
    static renderChoiceRusGeo(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.geo;
        // Фильтруем только элементы с полем geo (исключаем некорректные)
        const others = allItems.filter(i => i.geo && i.geo !== correctAnswer);
        const distractors = Utils.getRandomElements(others, 3).map(i => i.geo);
        const options = Utils.shuffleArray([correctAnswer, ...distractors]);
        const fontClass = QuestionRendererFactory.getRandomFontClass();

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">${item.type === 'word' ? 'Выберите перевод' : 'Выберите на грузинском'}</p>
            <div class="display-4 fw-bold text-primary">${item.rus}</div>
        `;

        answerContainer.innerHTML = `
            <div class="row g-2">
                ${options.map(opt => `
                    <div class="col-6">
                        <button class="btn btn-outline-secondary w-100 py-3 fs-4 fw-bold option-btn ${fontClass}" data-answer="${opt}">${opt}</button>
                    </div>
                `).join('')}
            </div>
        `;

        return { type: 'choice', correctAnswer, itemId: item.id };
    }

    /**
     * Шаблон: Ввод русской буквы по грузинской
     */
    static renderInputGeoRus(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.rus;
        const fontClass = QuestionRendererFactory.getRandomFontClass();

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">Напишите соответствие</p>
            <div class="display-1 fw-bold text-primary ${fontClass}">${item.geo}</div>
        `;

        answerContainer.innerHTML = `
            <div class="d-flex flex-column gap-2">
                <input 
                    type="text" 
                    class="form-control form-control-lg text-center fs-3 fw-bold" 
                    id="answer-input"
                    placeholder="Введите ответ..." 
                    autocomplete="off"
                    autofocus
                >
                <button class="btn btn-primary btn-lg" id="submit-btn">Проверить</button>
            </div>
        `;

        return { type: 'input', correctAnswer, itemId: item.id };
    }

    /**
     * Шаблон: Ввод грузинского по русскому
     */
    static renderInputRusGeo(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.geo;
        const fontClass = QuestionRendererFactory.getRandomFontClass();

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">${item.type === 'word' ? 'Напишите перевод' : 'Напишите на грузинском'}</p>
            <div class="display-4 fw-bold text-primary">${item.rus}</div>
        `;

        answerContainer.innerHTML = `
            <div class="d-flex flex-column gap-2">
                <input 
                    type="text" 
                    class="form-control form-control-lg text-center fs-3 fw-bold ${fontClass}" 
                    id="answer-input"
                    placeholder="Введите ответ..." 
                    autocomplete="off"
                    autofocus
                >
                <button class="btn btn-primary btn-lg" id="submit-btn">Проверить</button>
            </div>
        `;

        return { type: 'input', correctAnswer, itemId: item.id };
    }
    /**
     * Шаблон: Сборка слова из букв (транслитерация → грузинский)
     */
    static renderWordAssembly(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.geo;
        const geoLetters = item.geo.split('');
        const fontClass = QuestionRendererFactory.getRandomFontClass();
        
        // Добавляем случайные буквы-дистракторы
        const allLetters = DataRepository.getAllLetters();
        const distractors = Utils.getRandomElements(
            allLetters.filter(l => !geoLetters.includes(l.geo)),
            Math.min(3, allLetters.length)
        ).map(l => l.geo);
        
        const poolLetters = Utils.shuffleArray([...geoLetters, ...distractors]);
        const hintBtn = QuestionRendererFactory.renderHintButton(item.rus);

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">Соберите слово из букв ${hintBtn}</p>
            <div class="fs-2 fw-bold text-primary">${item.translit || item.rus}</div>
        `;

        answerContainer.innerHTML = `
            <div class="d-flex flex-column gap-3">
                <div class="border rounded p-3 min-height-60 d-flex flex-wrap gap-2 justify-content-center align-items-center bg-white ${fontClass}" id="assembly-zone">
                    <span class="text-muted fst-italic assembly-placeholder">Нажмите на буквы ниже</span>
                </div>
                <div class="d-flex flex-wrap gap-2 justify-content-center" id="pool-container">
                    ${poolLetters.map(letter => `
                        <button class="btn btn-outline-secondary fs-4 fw-bold letter-btn ${fontClass}" data-letter="${letter}">${letter}</button>
                    `).join('')}
                </div>
                <div class="d-flex justify-content-center gap-2" id="assembly-controls">
                    <button class="btn btn-outline-danger" id="clear-assembly-btn" title="Очистить">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-primary" id="submit-btn">Проверить</button>
                </div>
            </div>
        `;

        return { 
            type: 'assembly', 
            correctAnswer, 
            itemId: item.id,
            requiredLength: geoLetters.length
        };
    }

    /**
     * Шаблон: Ввод транслитерации грузинского слова
     */
    static renderTranslitInput(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.translit;
        const hintBtn = QuestionRendererFactory.renderHintButton(item.rus);
        const fontClass = QuestionRendererFactory.getRandomFontClass();

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">Напишите транслитерацию ${hintBtn}</p>
            <div class="display-4 fw-bold text-primary ${fontClass}">${item.geo}</div>
        `;

        answerContainer.innerHTML = `
            <div class="d-flex flex-column gap-2">
                <input 
                    type="text" 
                    class="form-control form-control-lg text-center fs-3 fw-bold" 
                    id="answer-input"
                    placeholder="Введите ответ..." 
                    autocomplete="off"
                    autofocus
                >
                <button class="btn btn-primary btn-lg" id="submit-btn">Проверить</button>
            </div>
        `;

        return { type: 'input', correctAnswer, itemId: item.id };
    }

    /**
     * Шаблон: Ввод перевода слова (подсказка — русский перевод)
     */
    static renderTranslateInput(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.rus;
        // Подсказка показывает русский перевод
        const hintBtn = QuestionRendererFactory.renderHintButton(item.rus);
        const fontClass = QuestionRendererFactory.getRandomFontClass();

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">Переведите слово ${hintBtn}</p>
            <div class="display-4 fw-bold text-primary ${fontClass}">${item.geo}</div>
        `;

        answerContainer.innerHTML = `
            <div class="d-flex flex-column gap-2">
                <input 
                    type="text" 
                    class="form-control form-control-lg text-center fs-3 fw-bold" 
                    id="answer-input"
                    placeholder="Введите перевод..." 
                    autocomplete="off"
                    autofocus
                >
                <button class="btn btn-primary btn-lg" id="submit-btn">Проверить</button>
            </div>
        `;

        return { type: 'input', correctAnswer, itemId: item.id };
    }

    /**
     * Шаблон: Сборка фразы из слов
     */
    static renderPhraseAssembly(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.geo_phrase;
        const words = item.geo_words_shuffled || item.geo_phrase.split(' ');
        const shuffledWords = Utils.shuffleArray([...words]);
        const fontClass = QuestionRendererFactory.getRandomFontClass();

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">Соберите фразу</p>
            <div class="fs-4 fw-bold text-primary">${item.rus_phrase}</div>
        `;

        answerContainer.innerHTML = `
            <div class="d-flex flex-column gap-3">
                <div class="border rounded p-3 min-height-60 d-flex flex-wrap gap-2 justify-content-center align-items-center bg-white ${fontClass}" id="assembly-zone">
                    <span class="text-muted fst-italic assembly-placeholder">Нажмите на слова ниже</span>
                </div>
                <div class="d-flex flex-wrap gap-2 justify-content-center" id="pool-container">
                    ${shuffledWords.map(word => `
                        <button class="btn btn-outline-secondary fs-5 fw-bold word-btn ${fontClass}" data-word="${word}">${word}</button>
                    `).join('')}
                </div>
                <div class="d-flex justify-content-center gap-2" id="assembly-controls">
                    <button class="btn btn-outline-danger" id="clear-assembly-btn" title="Очистить">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-primary" id="submit-btn">Проверить</button>
                </div>
            </div>
        `;

        return { 
            type: 'phrase_assembly', 
            correctAnswer, 
            itemId: item.id,
            requiredLength: words.length
        };
    }
}
