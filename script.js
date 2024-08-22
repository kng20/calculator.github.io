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

document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (event.altKey) {
        if (key === '8') { // Alt + 8 para '*'
            handleButtonClick('*');
        } else if (key === '9') { // Alt + 9 para otra función (ejemplo)
            handleButtonClick('(');
        }
    } else {
        if (!isNaN(key)) {
            handleButtonClick(key); // Si es un número
        } else if (key === '.') {
            handleButtonClick('.'); // Punto decimal
        } else if (key === 'Enter' || key === '=') {
            handleButtonClick('='); // Enter o '=' para calcular
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            handleButtonClick('AC'); // Escape o 'C' para limpiar la calculadora
        } else if (key === '+') {
            handleButtonClick('+'); // Suma
        } else if (key === '-') {
            handleButtonClick('-'); // Resta
        } else if (key === '*' || key === 'x') {
            handleButtonClick('*'); // Multiplicación
        } else if (key === '/' || key === '÷') {
            handleButtonClick('/'); // División
        } else if (key === '%') {
            handleButtonClick('%'); // Porcentaje
        } else if (key === '±') {
            handleButtonClick('±'); // Signo +/-
        }
    }

    event.preventDefault(); // Evita que las teclas realicen acciones por defecto
});

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
    if (op === '±') {
        currentValue = `${parseFloat(currentValue) * -1}`;
        updateDisplay();
        return;
    }

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

