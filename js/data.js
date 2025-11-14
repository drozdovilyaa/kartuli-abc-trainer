// Dictionary of Georgian-Russian letter pairs
export const dictionary = [
    { georgian_letter: "ა", russian_letter: "а", comment: "" },
    { georgian_letter: "ბ", russian_letter: "б", comment: "" },
    { georgian_letter: "გ", russian_letter: "г", comment: "" },
    { georgian_letter: "დ", russian_letter: "д", comment: "" },
    { georgian_letter: "ე", russian_letter: "э", comment: "" },
    { georgian_letter: "ვ", russian_letter: "в", comment: "" },
    { georgian_letter: "ზ", russian_letter: "з", comment: "" },
    { georgian_letter: "თ", russian_letter: "тх", comment: "С придыханием" },
    { georgian_letter: "ი", russian_letter: "и", comment: "" },
    { georgian_letter: "კ", russian_letter: "к", comment: "Резкое, без выдоха" },
    { georgian_letter: "ლ", russian_letter: "л", comment: "" },
    { georgian_letter: "მ", russian_letter: "м", comment: "" },
    { georgian_letter: "ნ", russian_letter: "н", comment: "" },
    { georgian_letter: "ო", russian_letter: "о", comment: "" },
    { georgian_letter: "პ", russian_letter: "п", comment: "лёгкое, на выдохе" },
    { georgian_letter: "ჟ", russian_letter: "ж", comment: "" },
    { georgian_letter: "რ", russian_letter: "р", comment: "" },
    { georgian_letter: "ს", russian_letter: "с", comment: "" },
    { georgian_letter: "ტ", russian_letter: "т", comment: "" },
    { georgian_letter: "უ", russian_letter: "у", comment: "" },
    { georgian_letter: "ფ", russian_letter: "пф", comment: "" },
    { georgian_letter: "ქ", russian_letter: "кх", comment: "лёгкое, на выдохе" },
    { georgian_letter: "ღ", russian_letter: "гх", comment: "" },
    { georgian_letter: "ყ", russian_letter: "кх!", comment: "глубокое, без выдоха" },
    { georgian_letter: "შ", russian_letter: "ш", comment: "мягкое" },
    { georgian_letter: "ჩ", russian_letter: "ч", comment: "" },
    { georgian_letter: "ც", russian_letter: "ц", comment: "" },
    { georgian_letter: "ძ", russian_letter: "дз", comment: "" },
    { georgian_letter: "წ", russian_letter: "ц!", comment: "резкое, без выдоха" },
    { georgian_letter: "ჭ", russian_letter: "ч!", comment: "резкое, без выдоха" },
    { georgian_letter: "ხ", russian_letter: "х", comment: "глубокое" },
    { georgian_letter: "ჯ", russian_letter: "дж", comment: "совме­щённое" },
    { georgian_letter: "ჰ", russian_letter: "хх", comment: "лёгкое, на выдохе" }
];

// List of Georgian words for Mode 3
export const georgianWords = [
    { word: "მამა", translation: "отец" },           // mama (father)
    { word: "დედა", translation: "мать" },           // deda (mother)
    { word: "სახლი", translation: "дом" },           // sakhli (house)
    { word: "წიგნი", translation: "книга" },         // ts'igni (book)
    { word: "ქალაქი", translation: "город" },        // k'alak'i (city)
    { word: "მთა", translation: "гора" },            // mta (mountain)
    { word: "თბილისი", translation: "Тбилиси" },    // tbilisi
    { word: "საქართველო", translation: "Грузия" },  // sak'art'velo (Georgia)
    { word: "წყალი", translation: "вода" },          // ts'q'ali (water)
    { word: "ძმა", translation: "брат" },            // dzma (brother)
    { word: "და", translation: "сестра" },           // da (sister)
    { word: "ბავშვი", translation: "ребенок" },      // bavshvi (child)
    { word: "კაცი", translation: "мужчина" },        // k'atsi (man)
    { word: "ქალი", translation: "женщина" },        // kali (woman)
    { word: "ძაღლი", translation: "собака" },        // dzaghli (dog)
    { word: "კატა", translation: "кошка" },          // k'at'a (cat)
    { word: "ხე", translation: "дерево" },           // khe (tree)
    { word: "ყვავილი", translation: "цветок" },      // q'vavili (flower)
    { word: "მზე", translation: "солнце" },          // mze (sun)
    { word: "მთვარე", translation: "луна" },         // mtvare (moon)
    { word: "ცა", translation: "небо" },             // tsa (sky)
    { word: "დღე", translation: "день" },            // dghe (day)
    { word: "ღამე", translation: "ночь" },           // ghame (night)
    { word: "სკოლა", translation: "школа" },         // sk'ola (school)
    { word: "მასწავლებელი", translation: "учитель" }, // masts'avlebeli (teacher)
    { word: "მეგობარი", translation: "друг" },       // megobari (friend)
    { word: "საჭმელი", translation: "еда" },         // sachмeli (food)
    { word: "პური", translation: "хлеб" },           // p'uri (bread)
    { word: "ღვინო", translation: "вино" },          // ghvino (wine)
    { word: "ხაჭაპური", translation: "хачапури" },  // khachap'uri (khachapuri)
    { word: "ხინკალი", translation: "хинкали" },    // khink'ali (khinkali)
    { word: "გზა", translation: "дорога" },          // gza (road)
    { word: "მანქანა", translation: "машина" },      // mankana (car)
    { word: "ფული", translation: "деньги" },        // p'uli (money)
    { word: "სახელი", translation: "имя" },          // sakheli (name)
    { word: "ენა", translation: "язык" },            // ena (language)
    { word: "მუსიკა", translation: "музыка" },       // musik'a (music)
    { word: "სიმღერა", translation: "песня" },       // simghera (song)
    { word: "ცეკვა", translation: "танец" },         // tsek'va (dance)
    { word: "სიყვარული", translation: "любовь" },     // siq'varuli (love)
    { word: "ცხოვრება", translation: "жизнь" },       // ckhovreba (life)
    { word: "ოფისი", translation: "офис" },           // opisi (office)
    { word: "ბინა", translation: "квартира" },        // bina (apartment)
    { word: "ოთახი", translation: "комната" },       // otakhi (room)
    { word: "ბაზარი", translation: "рынок" },        // bazari (market)
    { word: "პროდუქტი", translation: "продукт" },    // produk'ti (product)
    { word: "ადამიანი", translation: "человек" },     // adamiani (human)
    { word: "კაცი", translation: "люди" },           // k'atsi (man)
    { word: "ცოლი", translation: "жена" },            // ts'oli (wife)
    { word: "საავადმყოფო", translation: "больница" }, // saavandgmo (hospital)
    { word: "ფეხბურთი", translation: "футбол" },     // pekhburti (football)
    { word: "ფეხი", translation: "нога" },            // pekhi (leg)
    { word: "ბურთი", translation: "мяч" },            // burti (ball)
    { word: "მანქანა", translation: "машина" },      // mankhana (car)
    { word: "სკოლა", translation: "школа" },         // sk'ola (school)
    { word: "ქალაქი", translation: "город" },        // qalaki (city)
    { word: "ქუთაისი", translation: "Кутаиси" },    // qutaisi (Kutaisi)
    { word: "ბათუმი", translation: "Батуми" },      // batumi (Batumi)
    { word: "ხილი", translation: "фрукты" },        // khili (fruit)
    { word: "შვილი", translation: "сын/дочь" },     // shvili (child)
    { word: "ახალი", translation: "новый" },        // akhali (new)
    { word: "დიდი", translation: "большой" },       // didi (big)
    { word: "პატარა", translation: "маленький" },   // pat'ara (small)
    { word: "კომფორტული", translation: "комфортный" }, // kom'fort'uli (comfortable)
    { word: "კარგი", translation: "хороший" },      // k'argi (good)
    { word: "ცუდი", translation: "плохой" },        // ts'udi (bad)
    { word: "ლამაზი", translation: "красивый" },    // lamazi (beautiful)
    { word: "იშვიათი", translation: "редкий" },     // ishviati (rare)
    { word: "ხშირი", translation: "частый" },      // khsiri (frequent)
    { word: "სწრაფი", translation: "быстрый" },      // srap'i (fast)
    { word: "ახლა", translation: "сейчас" },        // akhali (now)
    { word: "ხშირად", translation: "часто" },      // khshirad (often)
    { word: "იშვიათად", translation: "редко" },     // ishviatad (rarely)
    { word: "ძალიან", translation: "очень" },      // dzalian (very)
    { word: "კარგად", translation: "хорошо" },      // k'argad (well)
    { word: "სწრაფად", translation: "быстро" },     // srap'ad (quickly)
    { word: "ჩემი", translation: "мой/моя/моё/мои" },  // chemi (my)
    { word: "შენი", translation: "твой/твоя/твоё/твои" }, // sheni (your)
    { word: "მისი", translation: "его/её" },       // misi (his/her)
    { word: "ჩვენი", translation: "наш/наша/наше/наши" }, // chveni (our)
    { word: "თქვენი", translation: "ваш/ваша/ваше/ваши" }, // tkveni (your)
    { word: "მათი", translation: "их" },           // mati (their)
    { word: "სახლი", translation: "дом" }, // sakhli (house)
    { word: "ოთახი", translation: "комната" }, // otakhi (room)
    { word: "ინფორმაცია", translation: "информация" }, // informatsia (information)
    { word: "პროდუქტი", translation: "продукт" }, // produk'ti (product)
    { word: "საყვარელი", translation: "возлюбленный / ая" }, // saq'var'eli (beloved)
    { word: "მანქანა", translation: "машина" }, // mankhana (car)
    { word: "ველოსიპედი", translation: "велосипед" }, // velosip'edi (bicycle)
    { word: "უფროსი", translation: "начальник, старший" }, // ufrosi (senior)
    { word: "მშობლები", translation: "родители" }, // mshoblebebi (parents)
    { word: "შოთი", translation: "шоти" }, // shoti (Shoti)
    { word: "წყალი", translation: "вода" }, // ts'qali (water)
    { word: "ამინდი", translation: "погода" }, // amin'di (weather)
    { word: "თოკი", translation: "верёвка" }, // thoki (rope)
    { word: "სამსახური", translation: "служба" }, // sam'sakhuri (service)
    { word: "სამუშაო", translation: "работа" }, // sam'shual (work)
    { word: "შვილი", translation: "ребёнок" }, // shvili (child)
    { word: "ყვავილი", translation: "цветок" }, // yvav'ili (flower)
    { word: "კატა", translation: "кошка" }, // kata (cat)
    { word: "ძაღლი", translation: "собака" }, // dzaghli (dog)
    { word: "ნივთი", translation: "вещь" }, // niv'thi (thing)
    { word: "ოჯახი", translation: "семья" }, // ojakh'i (family)
    { word: "მაგიდა", translation: "стол" }, // mag'ida (table)
    { word: "სკამი", translation: "стул" }, // sk'ami (chair)
    { word: "დივანი", translation: "диван" }, // divani (sofa)
    { word: "კომპიუტერი", translation: "компьютер" }, // komp'iut'eri (computer)
    { word: "ცხოველები", translation: "животные" }, // ts'khov'elebi (animals)
    { word: "კომპანია", translation: "компания" }, // komp'ania (company)
    { word: "დიდი", translation: "большой" }, // didi (big)
    { word: "პატარა", translation: "маленький" }, // pat'ara (small)
    { word: "ლამაზი", translation: "красивый" }, // lam'azi (beautiful)
    { word: "სწრაფი", translation: "быстрый" }, // s'trap'i (fast)
    { word: "ახალი", translation: "новый" }, // akhali (new)
    { word: "საინტერესო", translation: "интересный" }, // sain't'eresho (interesting)
    { word: "კარგი", translation: "хороший" }, // k'argi (good)
    { word: "სიმპათიური", translation: "симпатичный" }, // simp'atiuri (nice)
    { word: "გრძელი", translation: "длинный" }, // g'rzeli (long)
    { word: "მოკლე", translation: "короткий" }, // mok'le (short)
    { word: "ცხელი", translation: "горячий" }, // ts'kheli (hot)
    { word: "ცივი", translation: "холодный" }, // ts'ivi (cold)
    { word: "გრილი", translation: "прохладный" }, // grili (cool)
    { word: "თბილი", translation: "тёплый" }, // t'bili (warm)
    { word: "ძვირი", translation: "дорогой" }, // dz'viri (expensive)
    { word: "მაღალი", translation: "высокий" }, // maghali (tall)
    { word: "ფუმფულა", translation: "пушистый" }, // pum'p'ula (fluffy)
    { word: "მშვიდი", translation: "спокойный" }, // m'shv'idi (calm)
    { word: "პატარა", translation: "маленький (д)" }, // pat'ara (small)
    { word: "ცელქი", translation: "шаловливый" } // ts'elk'i (playful)
];

// List of Georgian phrases for Mode 5 (Russian phrase -> Select Georgian words)
export const georgianPhrases = [
    {
        "phrase": "მე ავად ვარ და საავადმყოფოში ვმკურნალობ.",
        "russianPhrase": "Я болен и лечусь в больнице.",
        "words": ["მე", "ავად", "ვარ", "და", "საავადმყოფოში", "ვმკურნალობ"],
        "comment": "I am sick and being treated in the hospital."
    },
    {
        "phrase": "ეს ჩემი სახლია.",
        "russianPhrase": "Это мой дом.",
        "words": ["ეს", "ჩემი", "სახლია"],
        "comment": "This is my house."
    },
    {
        "phrase": "ეს შენი ხილია?",
        "russianPhrase": "Это твои фрукты?",
        "words": ["ეს", "შენი", "ხილია"],
        "comment": "Are these your fruits?"
    },
    {
        "phrase": "ეს ჩვენი ახალი მანქანაა.",
        "russianPhrase": "Это наша новая машина.",
        "words": ["ეს", "ჩვენი", "ახალი", "მანქანაა"],
        "comment": "This is our new car."
    },
    {
        "phrase": "სად არის თქვენი ბინა?",
        "russianPhrase": "Где ваша квартира?",
        "words": ["სად", "არის", "თქვენი", "ბინა"],
        "comment": "Where is your apartment?"
    },
    {
        "phrase": "მისი ქართული ძალიან კარგია.",
        "russianPhrase": "Его/её грузинский очень хороший.",
        "words": ["მისი", "ქართული", "ძალიან", "კარგია"],
        "comment": "His/Her Georgian is very good."
    },
    {
        "phrase": "ის მათი შვილია.",
        "russianPhrase": "Он их сын/дочь.",
        "words": ["ის", "მათი", "შვილია"],
        "comment": "He/She is their child."
    },
    {
        "phrase": "მე ვარ ნანა. ახლა ვცხოვრობ თბილისში.",
        "russianPhrase": "Я Нана. Сейчас я живу в Тбилиси.",
        "words": ["მე", "ვარ", "ნანა", "ახლა", "ვცხოვრობ", "თბილისში"],
        "comment": "I am Nana. Now I live in Tbilisi."
    },
    {
        "phrase": "ეს ჩემი წიგნია.",
        "russianPhrase": "Это моя книга.",
        "words": ["ეს", "ჩემი", "წიგნია"],
        "comment": "This is my book."
    },
    {
        "phrase": "ეს შენი კალამია?",
        "russianPhrase": "Это твоя ручка?",
        "words": ["ეს", "შენი", "კალამია"],
        "comment": "Is this your pen?"
    },
    {
        "phrase": "ეს ჩვენი სკოლაა.",
        "russianPhrase": "Это наша школа.",
        "words": ["ეს", "ჩვენი", "სკოლაა"],
        "comment": "This is our school."
    },
    {
        "phrase": "სად არის თქვენი მანქანა?",
        "russianPhrase": "Где ваша машина?",
        "words": ["სად", "არის", "თქვენი", "მანქანა"],
        "comment": "Where is your car?"
    },
    {
        "phrase": "მისი სახლი ძალიან ლამაზია.",
        "russianPhrase": "Его/её дом очень красивый.",
        "words": ["მისი", "სახლი", "ძალიან", "ლამაზია"],
        "comment": "His/Her house is very beautiful."
    },
    {
        "phrase": "ის მათი მეგობარია.",
        "russianPhrase": "Он их друг.",
        "words": ["ის", "მათი", "მეგობარია"],
        "comment": "He/She is their friend."
    },
    {
        "phrase": "მე ვარ ლევანი. ახლა ვცხოვრობ ბათუმში.",
        "russianPhrase": "Я Леван. Сейчас я живу в Батуми.",
        "words": ["მე", "ვარ", "ლევანი", "ახლა", "ვცხოვრობ", "ბათუმში"],
        "comment": "I am Levan. Now I live in Batumi."
    },
    {
        "phrase": "ეს ჩემი ტელეფონია.",
        "russianPhrase": "Это мой телефон.",
        "words": ["ეს", "ჩემი", "ტელეფონია"],
        "comment": "This is my phone."
    },
    {
        "phrase": "ეს შენი კომპიუტერია?",
        "russianPhrase": "Это твой компьютер?",
        "words": ["ეს", "შენი", "კომპიუტერია"],
        "comment": "Is this your computer?"
    },
    {
        "phrase": "ეს ჩვენი ბაღია.",
        "russianPhrase": "Это наш сад.",
        "words": ["ეს", "ჩვენი", "ბაღია"],
        "comment": "This is our garden."
    },
    {
        "phrase": "სად არის თქვენი სახლი?",
        "russianPhrase": "Где ваш дом?",
        "words": ["სად", "არის", "თქვენი", "სახლი"],
        "comment": "Where is your house?"
    },
    {
        "phrase": "მისი მანქანა ძალიან სწრაფია.",
        "russianPhrase": "Его/её машина очень быстрая.",
        "words": ["მისი", "მანქანა", "ძალიან", "სწრაფია"],
        "comment": "His/Her car is very fast."
    },
    {
        "phrase": "ის მათი მასწავლებელია.",
        "russianPhrase": "Он их учитель.",
        "words": ["ის", "მათი", "მასწავლებელია"],
        "comment": "He/She is their teacher."
    },
    {
        "phrase": "მე ვარ მარიამი. ახლა ვცხოვრობ ქუთაისში.",
        "russianPhrase": "Я Мариам. Сейчас я живу в Кутаиси.",
        "words": ["მე", "ვარ", "მარიამი", "ახლა", "ვცხოვრობ", "ქუთაისში"],
        "comment": "I am Mariam. Now I live in Kutaisi."
    },
    {
        "phrase": "სად ცხოვრობ ახლა?",
        "russianPhrase": "Где ты живешь сейчас?",
        "words": ["სად", "ცხოვრობ", "ახლა"],
        "comment": "Where do you live now?"
    },
    {
        "phrase": "გიორგი ცუდად ხუმრობს.",
        "russianPhrase": "Гиорги шутит очень плохо.",
        "words": ["გიორგი", "ცუდად", "ხუმრობს"],
        "comment": "Giorgi jokes very badly. I joke very well."
    },
    {
        "phrase": "ეს ჩემი მეგობარია.",
        "russianPhrase": "Это мой друг.",
        "words": ["ეს", "ჩემი", "მეგობარია"],
        "comment": "This is my friend."
    },
    {
        "phrase": "ეს შენი წიგნია?",
        "russianPhrase": "Это твоя книга?",
        "words": ["ეს", "შენი", "წიგნია"],
        "comment": "Is this your book?"
    }
];
