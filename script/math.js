const complexityH3 = document.getElementById('complexityH3');
const complexityButtons = document.getElementById('complexityButtons');
const playZone = document.getElementById('playZone');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const progress = document.getElementById('progress');
const resetBtn = document.getElementById('reset');
const exitBtn = document.getElementById('exit');
const timerDisplay = document.getElementById('timerDisplay');

const TOTAL_QUESTIONS = 10;
let questions = [];
let currentIndex = 0;
let correctCount = 0;
let startTime = null;
let currentComplexity = null;
let gameActive = false;
let timerInterval = null;

// Вспомогательные
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function compute(a, op, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return (a >= b) ? a - b : null;
        case '*': return a * b;
        case '/': return (b !== 0 && a % b === 0) ? a / b : null;
        default: return null;
    }
}

// Начало игры
function startGame(complexity) {
    currentComplexity = complexity;
    // создаём массив вопросов
    questions = generateQuestions(complexity); 
    currentIndex = 0;
    correctCount = 0;
    gameActive = true;

    complexityButtons.classList.add('hidden');
    playZone.classList.remove('hidden');

    answerInput.disabled = false;
    submitBtn.disabled = false;
    answerInput.value = '';

    progress.textContent = `Вопрос 1 из ${TOTAL_QUESTIONS}`;
    startTimer();
    // показываем вопрос
    showQuestion();
}

// Генерация набора вопросов
function generateQuestions(complexity) {
    const qs = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        qs.push(generateQuestion(complexity));
    }
    return qs;
}

// Выбор сложности вопросов
function generateQuestion(complexity) {
    if (complexity === 'easy') return generateEasy();
    if (complexity === 'medium') return generateMedium();
    if (complexity === 'hard') return generateHard();
}

// Генераторы конкретных уровней
function generateEasy() {
    const op = ['+', '-'][randInt(0, 1)];
    let a, b, answer;
    if (op === '+') {
        a = randInt(1, 10);
        b = randInt(1, 10);
        answer = a + b;
    } else {
        a = randInt(1, 10);
        b = randInt(1, a);
        answer = a - b;
    }
    return { question: `${a} ${op} ${b}`, answer };
}

function generateMedium() {
    const structure = randInt(0, 1);
    let a, b, c, op1, op2, answer, question;
    let ok = false;
    while (!ok) {
        a = randInt(1, 10);
        b = randInt(1, 10);
        c = randInt(1, 10);
        op1 = ['+', '-', '*', '/'][randInt(0, 3)];
        op2 = ['+', '-', '*', '/'][randInt(0, 3)];

        let left, right;
        if (structure === 0) {
            left = compute(a, op1, b);
            if (left === null) continue;
            right = compute(left, op2, c);
            if (right === null) continue;
            if (right < 0) continue;
            answer = right;
            question = `(${a} ${op1} ${b}) ${op2} ${c}`;
        } else {
            left = compute(b, op2, c);
            if (left === null) continue;
            right = compute(a, op1, left);
            if (right === null) continue;
            if (right < 0) continue;
            answer = right;
            question = `${a} ${op1} (${b} ${op2} ${c})`;
        }
        ok = true;
    }
    return { question, answer };
}

function generateHard() {
    const type = randInt(0, 1);
    if (type === 0) {
        const op = ['+', '*'][randInt(0, 1)];
        let a, b, answer, question;
        let ok = false;
        while (!ok) {
            a = randInt(1, 12);
            b = randInt(1, 12);
            let val = (op === '+') ? a + b : a * b;
            const sqrt = Math.sqrt(val);
            if (Number.isInteger(sqrt)) {
                answer = sqrt;
                question = `√(${a} ${op} ${b})`;
                ok = true;
            }
        }
        return { question, answer };
    } else {
        const op = ['+', '*'][randInt(0, 1)];
        let a, b, c, answer, question;
        let ok = false;
        while (!ok) {
            a = randInt(1, 6);
            b = randInt(1, 6);
            c = randInt(1, 3);
            let base = (op === '+') ? a + b : a * b;
            if (base > 10) continue;
            answer = Math.pow(base, c);
            if (answer > 1000) continue;
            question = `(${a} ${op} ${b})^${c}`;
            ok = true;
        }
        return { question, answer };
    }
}

// Управление таймером
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
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

// Отображение вопроса
function showQuestion() {
    if (currentIndex >= TOTAL_QUESTIONS) {
        endGame();
        return;
    }
    const q = questions[currentIndex];
    questionText.textContent = `${q.question} = ?`;
    progress.textContent = `Вопрос ${currentIndex + 1} из ${TOTAL_QUESTIONS}`;
    answerInput.value = '';
    answerInput.focus();
}

// Проверка ответа
function checkAnswer() {
    if (!gameActive) return;
    if (currentIndex >= TOTAL_QUESTIONS) {
        endGame();
        return;
    }

    const inputVal = answerInput.value.trim();
    if (inputVal === '') {
        progress.textContent = 'Введите ответ!';
        return;
    }
    const userAnswer = Number(inputVal);
    if (isNaN(userAnswer) || !Number.isInteger(userAnswer)) {
        progress.textContent = 'Введите целое число!';
        answerInput.value = '';
        return;
    }

    const correct = questions[currentIndex].answer;
    if (userAnswer === correct) {
        correctCount++;
        progress.textContent = 'Верно!';
    } else {
        progress.textContent = `Неверно! Правильный ответ: ${correct}`;
    }

    currentIndex++;
    if (currentIndex >= TOTAL_QUESTIONS) {
        setTimeout(endGame, 800);
    } else {
        setTimeout(showQuestion, 800);
    }
}

// Завершение игры
function endGame() {
    gameActive = false;
    stopTimer();
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = minutes > 0 ? `${minutes} мин ${seconds} сек` : `${seconds} сек`;

    questionText.textContent = `Игра окончена! Правильных: ${correctCount} из ${TOTAL_QUESTIONS}`;
    progress.textContent = `Время: ${timeStr}`;
    answerInput.disabled = true;
    submitBtn.disabled = true;
}

// Выход из игры
function exitGame() {
    gameActive = false;
    stopTimer();
    startTime = null;
    timerDisplay.textContent = '00:00';
    complexityButtons.classList.remove('hidden');
    playZone.classList.add('hidden');
    questions = [];
    currentIndex = 0;
    correctCount = 0;
    currentComplexity = null;
    complexityH3.textContent = 'уровень сложности:';
    answerInput.disabled = false;
    submitBtn.disabled = false;
    answerInput.value = '';
    progress.textContent = `Вопрос 1 из ${TOTAL_QUESTIONS}`;
    questionText.textContent = '5 + 3 = ?';
}

// Обработчики событий
document.getElementById('Easy').addEventListener('click', () => {
    complexityH3.textContent = 'Уровень: Лёгкий';
    startGame('easy');
});
document.getElementById('Normal').addEventListener('click', () => {
    complexityH3.textContent = 'Уровень: Средний';
    startGame('medium');
});
document.getElementById('Hard').addEventListener('click', () => {
    complexityH3.textContent = 'Уровень: Сложный';
    startGame('hard');
});

submitBtn.addEventListener('click', checkAnswer);

resetBtn.addEventListener('click', () => {
    if (currentComplexity) {
        startGame(currentComplexity);
    } else {
        exitGame();
    }
});

exitBtn.addEventListener('click', exitGame);

answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (!submitBtn.disabled) {
            submitBtn.click();
        }
    }
});