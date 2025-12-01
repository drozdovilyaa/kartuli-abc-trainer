/**
 * Data Layer — Данные приложения
 * ================================
 * Содержит тестовые данные для обучения грузинскому языку
 */

'use strict';

/**
 * Константа с тестовыми данными
 * Содержит буквы, слова и фразы для изучения
 */
export const MOCK_DATA = {
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
        { id: "w1", geo: "მამა", rus: "отец", translit: "мама", type: "word" },
        { id: "w2", geo: "დედა", rus: "мать", translit: "дэда", type: "word" },
        { id: "w3", geo: "სახლი", rus: "дом", translit: "сахли", type: "word" },
        { id: "w4", geo: "წიგნი", rus: "книга", translit: "цигни", type: "word" },
        { id: "w5", geo: "ქალაქი", rus: "город", translit: "калаки", type: "word" },
        { id: "w6", geo: "მთა", rus: "гора", translit: "мта", type: "word" },
        { id: "w7", geo: "წყალი", rus: "вода", translit: "цкали", type: "word" },
        { id: "w8", geo: "ძმა", rus: "брат", translit: "дзма", type: "word" },
        { id: "w9", geo: "და", rus: "сестра", translit: "да", type: "word" },
        { id: "w10", geo: "ბავშვი", rus: "ребенок", translit: "бавшви", type: "word" },
        { id: "w11", geo: "კაცი", rus: "мужчина", translit: "каци", type: "word" },
        { id: "w12", geo: "ქალი", rus: "женщина", translit: "кали", type: "word" },
        { id: "w13", geo: "ძაღლი", rus: "собака", translit: "дзагли", type: "word" },
        { id: "w14", geo: "კატა", rus: "кошка", translit: "ката", type: "word" },
        { id: "w15", geo: "ხე", rus: "дерево", translit: "хэ", type: "word" },
        { id: "w16", geo: "მზე", rus: "солнце", translit: "мзэ", type: "word" },
        { id: "w17", geo: "ღამე", rus: "ночь", translit: "гамэ", type: "word" },
        { id: "w18", geo: "დღე", rus: "день", translit: "дгэ", type: "word" },
        { id: "w19", geo: "პური", rus: "хлеб", translit: "пури", type: "word" },
        { id: "w20", geo: "ღვინო", rus: "вино", translit: "гвино", type: "word" },
        { id: "w21", geo: "გზა", rus: "дорога", translit: "гза", type: "word" },
        { id: "w22", geo: "ენა", rus: "язык", translit: "эна", type: "word" },
        { id: "w23", geo: "სიყვარული", rus: "любовь", translit: "сикварули", type: "word" },
        { id: "w24", geo: "მეგობარი", rus: "друг", translit: "мэгобари", type: "word" },
        { id: "w25", geo: "კარგი", rus: "хороший", translit: "карги", type: "word" },
        { id: "w26", geo: "ცუდი", rus: "плохой", translit: "цуди", type: "word" },
        { id: "w27", geo: "დიდი", rus: "большой", translit: "диди", type: "word" },
        { id: "w28", geo: "პატარა", rus: "маленький", translit: "патара", type: "word" },
        { id: "w29", geo: "ახალი", rus: "новый", translit: "ахали", type: "word" },
        { id: "w30", geo: "ლამაზი", rus: "красивый", translit: "ламази", type: "word" }
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

    // Простые слова для режима букв (word_assembly, translit_input)
    simpleWords: [
        { id: "sw1", geo: "მამა", translit: "мама", rus: "отец" },
        { id: "sw2", geo: "დედა", translit: "дэда", rus: "мать" },
        { id: "sw3", geo: "კატა", translit: "ката", rus: "кошка" },
        { id: "sw4", geo: "სახლი", translit: "сахли", rus: "дом" },
        { id: "sw5", geo: "წიგნი", translit: "цигни", rus: "книга" },
        { id: "sw6", geo: "ვარ", translit: "вар", rus: "есть (я)" },
        { id: "sw7", geo: "და", translit: "да", rus: "и / сестра" },
        { id: "sw8", geo: "არის", translit: "арис", rus: "есть (он/она)" },
        { id: "sw9", geo: "კარგი", translit: "карги", rus: "хороший" },
        { id: "sw10", geo: "დიდი", translit: "диди", rus: "большой" }
    ]
};
