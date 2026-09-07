const h3 = document.getElementById('СomplexityH3');
const cp = document.getElementById('Сomplexity');
const h2 = document.getElementById('PzH2');
const input = document.getElementById('PzInput');
const progress = document.getElementById('progress');
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('reset');
const exitBtn = document.getElementById('exit');
const pz = document.getElementById('PlayZone')

let maxNumber = 0;
let secretNumber = 0;

function updateProgress(message) {
    progress.textContent = message;
}

function startGame(max) {
    maxNumber = max;
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    input.value = '';
    updateProgress('Введите число и нажмите ►');
    h2.textContent = `Введите число от 1 до ${maxNumber}`;
    cp.classList.add('hidden');
    pz.classList.remove('hidden');
}

document.getElementById('Easy').addEventListener('click', function () {
    h3.textContent = 'Угадайте число от 1 до 10';
    startGame(10);
});

document.getElementById('Normal').addEventListener('click', function () {
    h3.textContent = 'Угадайте число от 1 до 100';
    startGame(100);
});

document.getElementById('Hard').addEventListener('click', function () {
    h3.textContent = 'Угадайте число от 1 до 1000';
    startGame(1000);
});

playBtn.addEventListener('click', function () {
    const Value = input.value.trim();
    if (Value === '') {
        updateProgress('Введите число!');
        return;
    }
    const guess = Number(Value);
    if (isNaN(guess) || !Number.isInteger(guess)) {
        updateProgress('Введите целое число!');
        input.value = '';
        return;
    }
    if (guess < 1 || guess > maxNumber) {
        updateProgress(`Число должно быть от 1 до ${maxNumber}`);
        input.value = '';
        return;
    }
    if (guess === secretNumber) {
        updateProgress(`Поздравляю!Вы угадали число`);
    } else if (guess < secretNumber) {
        updateProgress(`Загаданное число БОЛЬШЕ ${guess}`);
    } else {
        updateProgress(`Загаданное число МЕНЬШЕ ${guess}`);
    }
    if (guess !== secretNumber) {
        input.value = '';
    }
});

resetBtn.addEventListener('click', function () {
    if (maxNumber === 0) {
        cp.classList.remove('hidden');
        return;
    }
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    input.value = '';
    updateProgress('Новая игра! Введите число');
    h2.textContent = `Введите число от 1 до ${maxNumber}`;
});
exitBtn.addEventListener('click', function () {
    cp.classList.remove('hidden');
    maxNumber = 0;
    secretNumber = 0;
    input.value = '';
    updateProgress('0% - введите число');
    h2.textContent = 'Введите число от ... до ...';
    h3.textContent = 'уровень сложности:';
    pz.classList.add('hidden');
});

input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (!input.disabled) {
            playBtn.click();
        }
    }
});