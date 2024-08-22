// Crear una instancia de Audio para el sonido de clic
const clickSound = new Audio('click-sound.wav');

// Reproducir sonido de clic
function playSound() {
    clickSound.currentTime = 0; // Reinicia el sonido para permitir múltiples clics rápidos
    clickSound.play();
}

// Variables para el estado de la calculadora
let display = document.getElementById('display');
let currentValue = '0';
let operator = null;
let firstOperand = null;
let awaitingSecondOperand = false;

function handleButtonClick(value) {
    playSound(); // Reproducir sonido al hacer clic en cualquier botón

    if (!isNaN(value) || value === '.') {
        appendNumber(value);
    } else if (value === 'AC') {
        clearDisplay();
    } else if (value === '=') {
        calculate();
    } else {
        appendOperator(value);
    }
}

function clearDisplay() {
    currentValue = '0';
    operator = null;
    firstOperand = null;
    awaitingSecondOperand = false;
    updateDisplay();
}

function appendNumber(number) {
    if (awaitingSecondOperand) {
        currentValue = number;
        awaitingSecondOperand = false;
    } else {
        currentValue = currentValue === '0' ? number : currentValue + number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operator && awaitingSecondOperand) {
        operator = op;
        return;
    }

    if (firstOperand === null) {
        firstOperand = parseFloat(currentValue);
    } else if (operator) {
        const result = calculateOperation(firstOperand, parseFloat(currentValue), operator);
        currentValue = `${parseFloat(result.toFixed(10))}`;
        firstOperand = result;
        updateDisplay();
    }

    awaitingSecondOperand = true;
    operator = op;
}

function calculate() {
    if (operator && !awaitingSecondOperand) {
        const result = calculateOperation(firstOperand, parseFloat(currentValue), operator);
        currentValue = `${parseFloat(result.toFixed(10))}`;
        operator = null;
        firstOperand = null;
        awaitingSecondOperand = false;
        updateDisplay();
    }
}

function calculateOperation(first, second, op) {
    switch (op) {
        case '+': return first + second;
        case '-': return first - second;
        case '*': return first * second;
        case '/': return first / second;
        case '%': return first % second;
        case '±': return first * -1;
        default: return second;
    }
}

function updateDisplay() {
    display.textContent = currentValue;
}