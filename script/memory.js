const complexityH3 = document.getElementById('complexityH3');
const complexityButtons = document.getElementById('Complexity');
const playZone = document.getElementById('playZone');
const colorGrid = document.getElementById('colorGrid');
const palette = document.getElementById('palette');
const status = document.getElementById('status');
const levelInfo = document.getElementById('levelInfo');
const checkBtn = document.getElementById('checkBtn');
const replayBtn = document.getElementById('replay');
const exitBtn = document.getElementById('exit');

const customSettings = document.getElementById('customSettings');
const customCount = document.getElementById('customCount');
const customTime = document.getElementById('customTime');
const customStart = document.getElementById('customStart');

// Палитра цветов, которые игрок может выбирать
const PALETTE = [
    '#e74c3c', // красный
    '#3498db', // синий
    '#2ecc71', // зелёный
    '#f1c40f', // жёлтый
    '#9b59b6', // фиолетовый
    '#e67e22', // оранжевый
    '#1abc9c', // бирюзовый
    '#e84393', // розовый
    '#34495e', // тёмно-синий
    '#7f8c8d', // серый
    '#6d3630', // коричневый
    '#0b3f20'  // тёмно-зелёный
];

let targetColors = [];      // правильная последовательность цветов
let playerColors = [];      // то, что выставил игрок
let blockCount = 0;
let showTime = 0;
let selectedColor = null;   // выбранный в палитре цвет
let currentLevel = null;
let gameActive = false;

// ---------- Вспомогательные ----------
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getGridColumns(count) {
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    if (count <= 16) return 4;
    return 4;
}

// ---------- Запуск игры ----------
function startGame(level, customBlocks = null, customSeconds = null) {
    currentLevel = level;
    customSettings.classList.add('hidden');
    complexityButtons.classList.add('hidden');
    playZone.classList.remove('hidden');
    checkBtn.classList.add('hidden');
    palette.classList.add('hidden');

    let blocks, seconds;
    if (level === 'easy') {
        blocks = 5;
        seconds = 5;
        complexityH3.textContent = 'Уровень: Лёгкий (5 блоков)';
    } else if (level === 'normal') {
        blocks = 8;
        seconds = 7;
        complexityH3.textContent = 'Уровень: Средний (8 блоков)';
    } else if (level === 'hard') {
        blocks = 10;
        seconds = 9;
        complexityH3.textContent = 'Уровень: Сложный (10 блоков)';
    } else if (level === 'custom') {
        blocks = customBlocks;
        seconds = customSeconds;
        complexityH3.textContent = `Уровень: Особый (${blocks} блоков, ${seconds} сек)`;
    }

    blockCount = blocks;
    showTime = seconds * 1000;
    gameActive = true;
    selectedColor = null;

    // Генерируем правильную последовательность
    targetColors = [];
    for (let i = 0; i < blockCount; i++) {
        targetColors.push(PALETTE[randInt(0, PALETTE.length - 1)]);
    }
    playerColors = new Array(blockCount).fill(null);

    // Строим сетку и палитру
    buildGrid();
    buildPalette();

    levelInfo.textContent = `Блоков: ${blockCount} · Время показа: ${seconds} сек`;

    // Показываем исходную картинку
    status.textContent = 'Запоминайте цвета!';
    status.style.color = '#e67e22';

    const blockEls = colorGrid.querySelectorAll('.colorBlock');
    blockEls.forEach((el, i) => {
        el.style.backgroundColor = targetColors[i];
        el.classList.add('active');
    });

    // Через showTime скрываем цвета
    setTimeout(() => {
        blockEls.forEach(el => {
            el.style.backgroundColor = '#bdc3c7';
            el.classList.remove('active');
        });
        status.textContent = 'Выберите цвет в палитре и кликайте по блокам';
        status.style.color = '#2c3e50';
        palette.classList.remove('hidden');
        checkBtn.classList.remove('hidden');
    }, showTime);
}

// ---------- Сетка ----------
function buildGrid() {
    colorGrid.innerHTML = '';
    const cols = getGridColumns(blockCount);
    colorGrid.style.gridTemplateColumns = `repeat(${cols}, auto)`;

    for (let i = 0; i < blockCount; i++) {
        const block = document.createElement('div');
        block.className = 'colorBlock';
        block.dataset.index = i;
        block.addEventListener('click', () => onBlockClick(i));
        colorGrid.appendChild(block);
    }
}

// ---------- Палитра ----------
function buildPalette() {
    palette.innerHTML = '';
    PALETTE.forEach(color => {
        const c = document.createElement('div');
        c.className = 'paletteColor';
        c.style.backgroundColor = color;
        c.dataset.color = color;
        c.addEventListener('click', () => {
            selectedColor = color;
            palette.querySelectorAll('.paletteColor').forEach(el => el.classList.remove('selected'));
            c.classList.add('selected');
        });
        palette.appendChild(c);
    });
}

// ---------- Клик по блоку ----------
function onBlockClick(index) {
    if (!gameActive) return;
    // Пока идёт показ — блоки не трогаем
    if (palette.classList.contains('hidden')) return;

    if (!selectedColor) {
        status.textContent = 'Сначала выберите цвет в палитре!';
        status.style.color = '#e74c3c';
        return;
    }

    playerColors[index] = selectedColor;
    const block = colorGrid.querySelectorAll('.colorBlock')[index];
    block.style.backgroundColor = selectedColor;
    block.classList.add('active');
    setTimeout(() => block.classList.remove('active'), 200);

    status.textContent = 'Продолжайте...';
    status.style.color = '#2c3e50';
}

// ---------- Проверка ----------
checkBtn.addEventListener('click', () => {
    if (!gameActive) return;

    // Проверяем, все ли блоки заполнены
    if (playerColors.includes(null)) {
        status.textContent = 'Заполните все блоки!';
        status.style.color = '#e74c3c';
        return;
    }

    gameActive = false;

    let correct = 0;
    const blockEls = colorGrid.querySelectorAll('.colorBlock');

    for (let i = 0; i < blockCount; i++) {
        if (playerColors[i] === targetColors[i]) {
            correct++;
            blockEls[i].style.boxShadow = '0 0 0 4px limegreen';
        } else {
            blockEls[i].classList.add('wrong');
            // Показываем правильный цвет в углу через рамку
            blockEls[i].style.boxShadow = `inset 0 0 0 4px ${targetColors[i]}`;
        }
    }

    if (correct === blockCount) {
        status.textContent = `🎉 Идеально! Все ${blockCount} блоков угаданы!`;
        status.style.color = '#0b3f20';
    } else {
        status.textContent = `Правильно: ${correct} из ${blockCount}. Зелёная рамка — верно, цветная внутри — правильный цвет.`;
        status.style.color = '#e74c3c';
    }
});

// ---------- Обработчики уровней ----------
document.getElementById('Easy').addEventListener('click', () => startGame('easy'));
document.getElementById('Normal').addEventListener('click', () => startGame('normal'));
document.getElementById('Hard').addEventListener('click', () => startGame('hard'));

document.getElementById('Custom').addEventListener('click', () => {
    complexityButtons.classList.add('hidden');
    playZone.classList.remove('hidden');
    customSettings.classList.remove('hidden');
    colorGrid.innerHTML = '';
    palette.innerHTML = '';
    palette.classList.add('hidden');
    checkBtn.classList.add('hidden');
    status.textContent = 'Настройте особый уровень';
    status.style.color = '#2c3e50';
    levelInfo.textContent = '';
    complexityH3.textContent = 'Особый уровень';
    currentLevel = 'custom';
    customCount.value = '';
    customTime.value = '';
    customCount.focus();
});

customStart.addEventListener('click', () => {
    const count = Number(customCount.value);
    const time = Number(customTime.value);

    if (isNaN(count) || count < 3 || count > 50) {
        status.textContent = 'Введите количество блоков от 3 до 50!';
        status.style.color = '#e74c3c';
        return;
    }
    if (isNaN(time) || time < 1 || time > 30) {
        status.textContent = 'Введите время показа от 1 до 30 секунд!';
        status.style.color = '#e74c3c';
        return;
    }

    startGame('custom', count, time);
});

customCount.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') customTime.focus();
});

customTime.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') customStart.click();
});

// ---------- Играть ещё раз ----------
replayBtn.addEventListener('click', () => {
    if (currentLevel === 'custom') {
        const count = Number(customCount.value);
        const time = Number(customTime.value);
        if (!isNaN(count) && !isNaN(time) && count >= 3 && time >= 1) {
            startGame('custom', count, time);
        } else {
            exitGame();
        }
    } else if (currentLevel) {
        startGame(currentLevel);
    } else {
        exitGame();
    }
});

// ---------- Выход ----------
exitBtn.addEventListener('click', exitGame);

function exitGame() {
    gameActive = false;
    targetColors = [];
    playerColors = [];
    selectedColor = null;
    currentLevel = null;

    complexityButtons.classList.remove('hidden');
    playZone.classList.add('hidden');
    customSettings.classList.add('hidden');
    palette.classList.add('hidden');
    checkBtn.classList.add('hidden');
    colorGrid.innerHTML = '';
    palette.innerHTML = '';
    status.textContent = 'Приготовьтесь...';
    status.style.color = '#2c3e50';
    levelInfo.textContent = '';
    complexityH3.textContent = 'Уровень сложности:';
    customCount.value = '';
    customTime.value = '';
}

console.log('Игра "Запомни цвет" готова к работе');