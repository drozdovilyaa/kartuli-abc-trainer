/**
 * Presentation Layer — Question Generator
 * ========================================
 * Factory for creating renderers for various question types
 */

'use strict';

import { Utils } from './utils.js';
import { DataRepository } from './state.js';

/**
 * QuestionRendererFactory — Question Renderers Factory
 * Creates DOM elements for different question templates (Bootstrap 5.3)
 */
export class QuestionRendererFactory {
    /** Array of Georgian font classes */
    static GEO_FONTS = ['geo-font-1', 'geo-font-2', 'geo-font-3'];

    /**
     * Get random Georgian font class
     * @returns {string} CSS font class
     */
    static getRandomFontClass() {
        const index = Math.floor(Math.random() * QuestionRendererFactory.GEO_FONTS.length);
        return QuestionRendererFactory.GEO_FONTS[index];
    }

    /**
     * Get renderer by template type
     * @param {string} template - Template type
     * @returns {Function} - Renderer function
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
     * Generates HTML for hint button (opens modal)
     * @param {string} translation - Translation text (Russian)
     * @param {string} translit - Transliteration text (optional)
     * @returns {string} HTML string
     */
    static renderHintButton(translation, translit = null) {
        if (!translation && !translit) return '';
        
        // Build hint text with both translation and transliteration if available
        let hintText = '';
        if (translation) hintText += translation;
        // TODO: Temporarily disabled transliteration in hints
        // if (translit) hintText += (hintText ? ' • ' : '') + `[${translit}]`;
        
        return `
            <button class="btn btn-sm btn-outline-warning ms-2" id="hint-btn" 
                    data-hint="${hintText}" title="Показать подсказку">
                <i class="bi bi-lightbulb"></i>
            </button>`;
    }

    /**
     * Template: Choose Russian translation by Georgian
     */
    static renderChoiceGeoRus(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.rus;
        // Filter only items with rus field (exclude phrases with rus_phrase)
        const others = allItems.filter(i => i.rus && i.rus !== correctAnswer);
        const distractors = Utils.getRandomElements(others, 3).map(i => i.rus);
        const options = Utils.shuffleArray([correctAnswer, ...distractors]);
        const fontClass = QuestionRendererFactory.getRandomFontClass();
        
        // Hint with translation and transliteration for words
        const hintBtn = item.type === 'word' 
            ? QuestionRendererFactory.renderHintButton(item.rus, item.translit) 
            : '';

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">${item.type === 'word' ? 'Выберите перевод' : 'Какая буква соответствует?'} ${hintBtn}</p>
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
     * Template: Choose Georgian by Russian
     */
    static renderChoiceRusGeo(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.geo;
        // Filter only items with geo field (exclude invalid)
        const others = allItems.filter(i => i.geo && i.geo !== correctAnswer);
        const distractors = Utils.getRandomElements(others, 3).map(i => i.geo);
        const options = Utils.shuffleArray([correctAnswer, ...distractors]);
        const fontClass = QuestionRendererFactory.getRandomFontClass();
        
        // Hint with Georgian word and transliteration for words
        const hintBtn = item.type === 'word' 
            ? QuestionRendererFactory.renderHintButton(item.geo, item.translit) 
            : '';

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">${item.type === 'word' ? 'Выберите перевод' : 'Выберите на грузинском'} ${hintBtn}</p>
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
     * Template: Input Russian letter by Georgian
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
     * Template: Input Georgian by Russian
     */
    static renderInputRusGeo(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.geo;
        const fontClass = QuestionRendererFactory.getRandomFontClass();
        
        // Hint with Georgian word and transliteration for words
        const hintBtn = item.type === 'word' 
            ? QuestionRendererFactory.renderHintButton(item.geo, item.translit) 
            : '';

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">${item.type === 'word' ? 'Напишите перевод' : 'Напишите на грузинском'} ${hintBtn}</p>
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
     * Template: Word assembly from letters (transliteration → Georgian)
     */
    static renderWordAssembly(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.geo;
        const geoLetters = item.geo.split('');
        const fontClass = QuestionRendererFactory.getRandomFontClass();
        
        // Add random distractor letters
        const allLetters = DataRepository.getAllLetters();
        const distractors = Utils.getRandomElements(
            allLetters.filter(l => !geoLetters.includes(l.geo)),
            Math.min(3, allLetters.length)
        ).map(l => l.geo);
        
        const poolLetters = Utils.shuffleArray([...geoLetters, ...distractors]);
        const hintBtn = QuestionRendererFactory.renderHintButton(item.rus, item.translit);

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
     * Template: Input transliteration of Georgian word
     */
    static renderTranslitInput(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.translit;
        const hintBtn = QuestionRendererFactory.renderHintButton(item.rus, item.translit);
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
     * Template: Input word translation (hint — Russian translation)
     */
    static renderTranslateInput(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.rus;
        // Hint shows Russian translation and transliteration
        const hintBtn = QuestionRendererFactory.renderHintButton(item.rus, item.translit);
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
     * Template: Phrase assembly from words
     */
    static renderPhraseAssembly(item, allItems, questionContainer, answerContainer) {
        const correctAnswer = item.geo_phrase;
        const words = item.geo_words_shuffled || item.geo_phrase.split(' ');
        const shuffledWords = Utils.shuffleArray([...words]);
        const fontClass = QuestionRendererFactory.getRandomFontClass();
        
        // Hint with correct Georgian phrase
        const hintBtn = QuestionRendererFactory.renderHintButton(item.geo_phrase);

        questionContainer.innerHTML = `
            <p class="text-muted mb-2">Соберите фразу ${hintBtn}</p>
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
