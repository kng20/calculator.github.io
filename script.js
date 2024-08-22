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

// Configurar el modo oscuro por defecto
body.classList.add('dark-mode');
themeToggleButton.textContent = '☀️'; // Mostrar ícono de sol para dark mode

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

    if (firstOperand === null) {
        firstOperand = parseFloat(currentValue);
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, parseFloat(currentValue));
        currentValue = `${parseFloat(result.toFixed(MAX_DISPLAY_DIGITS))}`;
        firstOperand = parseFloat(currentValue);
    }

    awaitingSecondOperand = true;
    operator = op;
    updateDisplay();
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '%': (firstOperand, secondOperand) => firstOperand % secondOperand,
};

function calculate() {
    let result;

    if (operator && !awaitingSecondOperand) {
        result = performCalculation[operator](firstOperand, parseFloat(currentValue));

        currentValue = `${parseFloat(result.toFixed(MAX_DISPLAY_DIGITS))}`;
        operator = null;
        firstOperand = null;
        awaitingSecondOperand = false;

        updateDisplay();
    }
}

function updateDisplay() {
    // Formatear el valor actual con comas
    let formattedValue = parseFloat(currentValue).toLocaleString('en-US', {
        maximumFractionDigits: MAX_DISPLAY_DIGITS
    });

    display.textContent = formattedValue.length > MAX_DISPLAY_DIGITS 
        ? formattedValue.slice(0, MAX_DISPLAY_DIGITS) 
        : formattedValue;
}





