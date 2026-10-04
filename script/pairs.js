const complexityH3 = document.getElementById('complexityH3');
const complexityButtons = document.getElementById('Complexity');
const playZone = document.getElementById('playZone');
const cardsGrid = document.getElementById('cardsGrid');
const status = document.getElementById('status');
const movesCountSpan = document.getElementById('movesCount');
const pairsFoundSpan = document.getElementById('pairsFound');
const pairsTotalSpan = document.getElementById('pairsTotal');
const timerDisplay = document.getElementById('timerDisplay');
const replayBtn = document.getElementById('replay');
const exitBtn = document.getElementById('exit');

// Наборы эмодзи для карточек
const EMOJI_POOL = [
    '🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝', '🍉', '🍊',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦉',
    '⭐', '🌙', '☀️', '⚡', '🔥', '💧', '❄️', '🌈', '☁️', '🌊',
    '🎈', '🎁', '🎉', '🎨', '🎵', '🎮', '⚽', '🏀', '🎯', '🚗',
    '🚀', '✈️', '🚲', '⛵', '🏠', '🌳', '🌸', '🍀', '🌵', '🍄'
];

let cards = [];             // массив значений карточек (пары)
let flippedCards = [];      // индексы открытых карточек
let matchedCount = 0;       // найдено пар
let totalPairs = 0;         // всего пар
let moves = 0;              // количество ходов
let lockBoard = false;      // блокировка во время проверки
let timerInterval = null;
let startTime = null;
let gameActive = false;

// ---------- Вспомогательные ----------
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Подбираем количество колонок, чтобы сетка смотрелась хорошо и не «прыгала»
function getColumns(count) {
    if (count <= 6) return 2;
    if (count <= 12) return 3;
    if (count <= 20) return 4;
    if (count <= 30) return 5;
    if (count <= 42) return 6;
    return 7;
}

// ---------- Таймер ----------
function startTimer() {
    stopTimer();
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function updateTimer() {
    if (!startTime) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ---------- Запуск игры ----------
function startGame(cardCount) {
    // cardCount — общее количество карточек (должно быть чётным)
    totalPairs = cardCount / 2;
    matchedCount = 0;
    moves = 0;
    flippedCards = [];
    lockBoard = false;
    gameActive = true;

    movesCountSpan.textContent = '0';
    pairsFoundSpan.textContent = '0';
    pairsTotalSpan.textContent = totalPairs;
    timerDisplay.textContent = '00:00';
    status.textContent = 'Найдите все пары';
    status.style.color = '#2c3e50';

    // Выбираем нужное количество эмодзи
    const chosen = shuffle([...EMOJI_POOL]).slice(0, totalPairs);
    // Дублируем и перемешиваем
    cards = shuffle([...chosen, ...chosen]);

    buildGrid(cardCount);
    startTimer();

    complexityButtons.classList.add('hidden');
    playZone.classList.remove('hidden');
}

// ---------- Построение сетки ----------
function buildGrid(cardCount) {
    cardsGrid.innerHTML = '';
    const cols = getColumns(cardCount);
    cardsGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;

        const inner = document.createElement('div');
        inner.className = 'cardInner';

        const back = document.createElement('div');
        back.className = 'cardFace cardBack';
        back.textContent = '?';

        const front = document.createElement('div');
        front.className = 'cardFace cardFront';
        front.textContent = emoji;

        inner.appendChild(back);
        inner.appendChild(front);
        card.appendChild(inner);
        card.addEventListener('click', () => onCardClick(card, index));
        cardsGrid.appendChild(card);
    });
}

// ---------- Клик по карточке ----------
function onCardClick(card, index) {
    if (!gameActive || lockBoard) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push({ card, index });

    if (flippedCards.length === 2) {
        moves++;
        movesCountSpan.textContent = moves;
        checkMatch();
    }
}

// ---------- Проверка пары ----------
function checkMatch() {
    lockBoard = true;
    const [first, second] = flippedCards;

    if (cards[first.index] === cards[second.index]) {
        // Совпадение
        matchedCount++;
        pairsFoundSpan.textContent = matchedCount;
        status.textContent = '✅ Пара найдена!';
        status.style.color = '#27ae60';

        setTimeout(() => {
            first.card.classList.add('matched');
            second.card.classList.add('matched');
            flippedCards = [];
            lockBoard = false;

            if (matchedCount === totalPairs) {
                endGame();
            }
        }, 500);
    } else {
        // Не совпало — переворачиваем обратно
        status.textContent = '❌ Не пара';
        status.style.color = '#e74c3c';

        setTimeout(() => {
            first.card.classList.remove('flipped');
            second.card.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 900);
    }
}

// ---------- Завершение игры ----------
function endGame() {
    gameActive = false;
    stopTimer();
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = minutes > 0 ? `${minutes} мин ${seconds} сек` : `${seconds} сек`;

    status.textContent = `🎉 Победа! Ходов: ${moves}, время: ${timeStr}`;
    status.style.color = '#27ae60';
}

// ---------- Выход ----------
function exitGame() {
    gameActive = false;
    stopTimer();
    startTime = null;
    timerDisplay.textContent = '00:00';
    cards = [];
    flippedCards = [];
    matchedCount = 0;
    moves = 0;
    cardsGrid.innerHTML = '';
    status.textContent = 'Найдите все пары';
    status.style.color = '#2c3e50';
    complexityButtons.classList.remove('hidden');
    playZone.classList.add('hidden');
    complexityH3.textContent = 'Уровень сложности:';
}

// ---------- Обработчики кнопок сложности ----------
document.getElementById('Easy').addEventListener('click', () => {
    complexityH3.textContent = 'Уровень: Лёгкий (14 карточек)';
    startGame(14);
});

document.getElementById('Normal').addEventListener('click', () => {
    complexityH3.textContent = 'Уровень: Средний (26 карточек)';
    startGame(26);
});

document.getElementById('Hard').addEventListener('click', () => {
    complexityH3.textContent = 'Уровень: Сложный (50 карточек)';
    startGame(50);
});

// ---------- Играть ещё раз ----------
replayBtn.addEventListener('click', () => {
    const level = complexityH3.textContent;
    if (level.includes('Лёгкий')) {
        startGame(14);
    } else if (level.includes('Средний')) {
        startGame(26);
    } else if (level.includes('Сложный')) {
        startGame(50);
    } else {
        exitGame();
    }
});

exitBtn.addEventListener('click', exitGame);

console.log('Игра "Найди пару" готова к работе');