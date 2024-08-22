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
const MAX_DISPLAY_DIGITS = 12;

// Alternar entre modo oscuro y claro
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

themeToggleButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeToggleButton.textContent = '🌙'; // Cambiar a ícono de luna para light mode
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeToggleButton.textContent = '☀️'; // Cambiar a ícono de sol para dark mode
    }
});

document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (event.altKey) {
        if (key === '8') { // Alt + 8 para '*'
            handleButtonClick('*');
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
        } else if (key === '*') {
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
    // Si estamos esperando el segundo operando, reemplazar el valor actual
    if (awaitingSecondOperand) {
        currentValue = number;
        awaitingSecondOperand = false;
    } else {
        // Si el número es un punto decimal, verificar que no haya ya un punto
        if (number === '.' && currentValue.includes('.')) return;
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
        currentValue = `${result}`;
        firstOperand = result;
    } else {
        firstOperand = parseFloat(currentValue);
    }

    awaitingSecondOperand = true;
    operator = op;
    updateDisplay();
}

function calculate() {
    if (operator && !awaitingSecondOperand) {
        const result = calculateOperation(firstOperand, parseFloat(currentValue), operator);
        currentValue = `${result}`;
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

function formatNumber(number) {
    // Convierte el número a formato decimal con comas y limita el tamaño de la pantalla
    if (isNaN(number)) return '0';
    let numberStr = number.toString();
    
    // Limitar la cantidad de dígitos a mostrar en la pantalla
    if (numberStr.length > MAX_DISPLAY_DIGITS) {
        numberStr = number.toExponential(2); // Usar notación científica si el número es demasiado grande
    }
    
    return numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function updateDisplay() {
    let value = parseFloat(currentValue);
    display.textContent = formatNumber(value);
}




