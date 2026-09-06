// randomNew.js – игра "Виселица"

// Списки слов по уровням
const WORDS_EASY = [
    'лампа', 'стена', 'книга', 'ручка', 'кошка',
    'мышка', 'шапка', 'школа', 'парта', 'пенал',
    'лилия', 'роза', 'пицца', 'весло', 'клоун',
    'бокал', 'ваза', 'дверь', 'зерно', 'игла',
    'йогурт', 'кафе', 'лебедь', 'молот', 'носок',
    'орех', 'пальто', 'рукав', 'салат', 'топор',
    'угорь', 'флаг', 'хлеб', 'цветок', 'чашка',
    'шампунь', 'щит', 'эскиз', 'юбка', 'якорь',
    'банка', 'вилка', 'гараж', 'дождь', 'ёжик',
    'жёлудь', 'замок', 'ирис', 'кекс', 'лук'
];

const WORDS_NORMAL = [
    'автомобиль', 'библиотека', 'велосипед', 'компьютер', 'телефон',
    'троллейбус', 'подоконник', 'свидетель', 'инженер', 'календарь',
    'бутерброд', 'вермишель', 'гастроном', 'дирижер', 'ежевика',
    'журналист', 'занавеска', 'изумруд', 'карамель', 'лабиринт',
    'магазин', 'навигатор', 'обложка', 'паутина', 'рассвет',
    'самолёт', 'телевизор', 'университет', 'фотограф', 'хоккей',
    'центрифуга', 'черепаха', 'шоколад', 'экскаватор', 'ювелир',
    'ящерица', 'абрикос', 'барабан', 'варежки', 'горчица',
    'древесина', 'ежедневник', 'жираф', 'закладка', 'игрушка',
    'кастрюля', 'лимон', 'морковь', 'наушник', 'овощи'
];

const WORDS_HARD = [
    'электричество', 'достопримечательность', 'организация',
    'правительство', 'оборудование', 'усовершенствование',
    'перпендикуляр', 'радиоэлектроника', 'водопроводчик',
    'землетрясение', 'книгоиздательство', 'медицинский',
    'независимость', 'общеобразовательный', 'преподаватель',
    'самостоятельность', 'телевидение', 'фотографирование',
    'художественный', 'циркуляр', 'человечество', 'энциклопедия',
    'юриспруденция', 'авиаконструктор', 'бактериология',
    'велосипедист', 'гастроэнтерология', 'делопроизводство',
    'естествознание', 'железнодорожный', 'законодательство',
    'изобразительный', 'интеллектуальный', 'конструктор',
    'литературоведение', 'математический', 'наблюдательность',
    'обороноспособность', 'промышленный', 'распределитель',
    'свидетельство', 'товарищество', 'управляющий', 'философский',
    'химический', 'централизованный', 'черепаховый', 'шахматный',
    'щитовидный', 'экспериментальный', 'энергетический'
];

const h3 = document.getElementById('СomplexityH3');
const cp = document.getElementById('Сomplexity');
const h2 = document.getElementById('PzH2');
const input = document.getElementById('PzInput');
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('reset');
const exitBtn = document.getElementById('exit');
const pz = document.getElementById('PlayZone');
const wordDisplay = document.getElementById('wordDisplay');
const errorCountSpan = document.getElementById('errorCount');
const maxErrorsSpan = document.getElementById('maxErrors');
const usedLettersSpan = document.getElementById('usedLettersDisplay');
const messageP = document.getElementById('message');

let currentWord = '';
let guessedLetters = [];
let errors = 0;
const MAX_ERRORS = 6;
let usedLetters = [];
let isGameOver = false;

function resetGameState() {
    guessedLetters = new Array(currentWord.length).fill(false);
    errors = 0;
    usedLetters = [];
    isGameOver = false;
    input.disabled = false;
    input.value = '';
    playBtn.disabled = false;
    updateUI();
    messageP.textContent = 'Введите букву';
    messageP.style.color = '#1a1a1a';
}

function startGame(word) {
    currentWord = word.toLowerCase();
    resetGameState();
    h2.textContent = `Угадайте слово (${currentWord.length} букв)`;
    cp.classList.add('hidden');
    pz.classList.remove('hidden');
    maxErrorsSpan.textContent = MAX_ERRORS;
}

function updateUI() {
    let display = '';
    for (let i = 0; i < currentWord.length; i++) {
        if (guessedLetters[i]) {
            display += currentWord[i] + ' ';
        } else {
            display += '_ ';
        }
    }
    wordDisplay.textContent = display.trim();

    errorCountSpan.textContent = errors;

    if (usedLetters.length === 0) {
        usedLettersSpan.textContent = '—';
    } else {
        usedLettersSpan.innerHTML = usedLetters.map(l => `<span>${l}</span>`).join(' ');
    }
}

function handleGuess(letter) {
    if (isGameOver) {
        messageP.textContent = 'Игра окончена. Нажмите "Заново" или выберите уровень заново.';
        return;
    }

    letter = letter.toLowerCase().trim();
    if (letter === '') {
        messageP.textContent = 'Введите букву!';
        return;
    }
    if (!/^[а-яё]$/i.test(letter)) {
        messageP.textContent = 'Введите русскую букву!';
        input.value = '';
        return;
    }
    if (usedLetters.includes(letter)) {
        messageP.textContent = `Буква "${letter}" уже была.`;
        input.value = '';
        return;
    }
    usedLetters.push(letter);

    if (currentWord.includes(letter)) {
        let found = false;
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === letter && !guessedLetters[i]) {
                guessedLetters[i] = true;
                found = true;
            }
        }
        if (found) {
            messageP.textContent = `Есть буква "${letter}"!`;
            messageP.style.color = 'green';
        } else {
            messageP.textContent = `Буква "${letter}" уже открыта.`;
        }
    } else {
        errors++;
        messageP.textContent = `Нет буквы "${letter}"!`;
        messageP.style.color = 'red';
    }

    updateUI();

    if (guessedLetters.every(v => v === true)) {
        messageP.textContent = `Поздравляю! Вы угадали слово "${currentWord}"!`;
        messageP.style.color = 'green';
        isGameOver = true;
        input.disabled = true;
        playBtn.disabled = true;
        return;
    }

    if (errors >= MAX_ERRORS) {
        messageP.textContent = `Вы проиграли! Загаданное слово: "${currentWord}"`;
        messageP.style.color = 'red';
        isGameOver = true;
        input.disabled = true;
        playBtn.disabled = true;
        // Показываем всё слово
        wordDisplay.textContent = currentWord.split('').join(' ');
        return;
    }
    input.value = '';
    input.focus();
}

document.getElementById('Easy').addEventListener('click', function () {
    const word = WORDS_EASY[Math.floor(Math.random() * WORDS_EASY.length)];
    h3.textContent = 'Уровень: Лёгкий (5 букв)';
    startGame(word);
});

document.getElementById('Normal').addEventListener('click', function () {
    const word = WORDS_NORMAL[Math.floor(Math.random() * WORDS_NORMAL.length)];
    h3.textContent = 'Уровень: Нормальный (10 букв)';
    startGame(word);
});

document.getElementById('Hard').addEventListener('click', function () {
    const word = WORDS_HARD[Math.floor(Math.random() * WORDS_HARD.length)];
    h3.textContent = 'Уровень: Сложный (более 10 букв)';
    startGame(word);
});

// Обработка ввода буквы
playBtn.addEventListener('click', function () {
    const val = input.value;
    if (val.length === 0) {
        messageP.textContent = 'Введите букву!';
        return;
    }
    const letter = val.charAt(0);
    input.value = letter;
    handleGuess(letter);
});

input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (!input.disabled && !isGameOver) {
            playBtn.click();
        }
    }
});

resetBtn.addEventListener('click', function () {
    if (currentWord === '') {
        cp.classList.remove('hidden');
        pz.classList.add('hidden');
        return;
    }
    resetGameState();
    h2.textContent = `Угадайте слово (${currentWord.length} букв)`;
    messageP.textContent = 'Новая игра! Введите букву';
    messageP.style.color = '#1a1a1a';
    input.focus();
});

exitBtn.addEventListener('click', function () {
    cp.classList.remove('hidden');
    pz.classList.add('hidden');
    currentWord = '';
    guessedLetters = [];
    errors = 0;
    usedLetters = [];
    isGameOver = false;
    input.disabled = false;
    playBtn.disabled = false;
    input.value = '';
    h2.textContent = 'Угадайте слово';
    wordDisplay.textContent = '_ _ _ _ _';
    errorCountSpan.textContent = '0';
    maxErrorsSpan.textContent = MAX_ERRORS;
    usedLettersSpan.textContent = '—';
    messageP.textContent = 'Введите букву';
    messageP.style.color = '#1a1a1a';
    h3.textContent = 'Уровень сложности:';
});