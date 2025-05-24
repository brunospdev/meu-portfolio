// Get DOM elements
const whiteCar = document.getElementById('white');
const redCar = document.getElementById('red');
const resultDiv = document.getElementById('result');
const brancoBtn = document.getElementById('branco');
const vermelhoBtn = document.getElementById('vermelho');
const resetButton = document.getElementById('resetar');
const accelerateButton = document.getElementById('acelerar');
const decelerateButton = document.getElementById('desacelerar');
const body = document.body;
const carAudio = document.querySelector('audio'); 


const INITIAL_CAR_SIZE = 70;
const MIN_CAR_SIZE = 30;
const MAX_CAR_SIZE = 120;

let whiteCarSize = INITIAL_CAR_SIZE;
let redCarSize = INITIAL_CAR_SIZE;

let whiteCarLeft = 205;
let redCarRight = 205;

function getAdjustedPosition(basePos, currentSize, initialSize) {
    return basePos - (currentSize - initialSize) / 2;
}

let selectedCar = null;

function playCarSound() {

    if (carAudio.paused) {
        carAudio.play().catch(e => console.error("Erro ao tocar áudio:", e));
    }
}


function stopCarSound() {
    carAudio.pause();
    carAudio.currentTime = 0; 
}

// Function to select a car
function selectCar(car, name, color) {
    selectedCar = car;
    resultDiv.textContent = name;

    if (car === whiteCar) {
        body.style.backgroundColor = 'gray';
    } else {
        body.style.backgroundColor = color;
    }

    resetButton.style.display = 'block';
    accelerateButton.style.display = 'block';
    decelerateButton.style.display = 'block';

    whiteCarSize = INITIAL_CAR_SIZE;
    redCarSize = INITIAL_CAR_SIZE;
    updateCarDisplay(whiteCar, whiteCarSize, true);
    updateCarDisplay(redCar, redCarSize, false);

    playCarSound(); 
}


whiteCar.addEventListener('click', () => selectCar(whiteCar, 'Shu Todoroki', 'white'));
redCar.addEventListener('click', () => selectCar(redCar, 'Mcqueen', 'darkred'));

// Event listeners for color circle clicks
brancoBtn.addEventListener('click', () => selectCar(whiteCar, 'Shu Todoroki', 'white'));
vermelhoBtn.addEventListener('click', () => selectCar(redCar, 'Mcqueen', 'darkred'));

function updateCarDisplay(carElement, size, isLeftCar) {
    carElement.style.width = `${size}px`;
    carElement.style.height = `${size}px`;

    if (isLeftCar) {
        carElement.style.left = `${getAdjustedPosition(whiteCarLeft, size, INITIAL_CAR_SIZE)}px`;
    } else {
        carElement.style.right = `${getAdjustedPosition(redCarRight, size, INITIAL_CAR_SIZE)}px`;
    }
}


function accelerate() {
    if (selectedCar === whiteCar) {
        if (whiteCarSize > MIN_CAR_SIZE) {
            whiteCarSize -= 5;
            updateCarDisplay(whiteCar, whiteCarSize, true);
        }
    } else if (selectedCar === redCar) {
        if (redCarSize > MIN_CAR_SIZE) {
            redCarSize -= 5;
            updateCarDisplay(redCar, redCarSize, false);
        }
    }
}


function decelerate() {
    if (selectedCar === whiteCar) {
        if (whiteCarSize < MAX_CAR_SIZE) {
            whiteCarSize += 5;
            updateCarDisplay(whiteCar, whiteCarSize, true);
        }
    } else if (selectedCar === redCar) {
        if (redCarSize < MAX_CAR_SIZE) {
            redCarSize += 5;
            updateCarDisplay(redCar, redCarSize, false);
        }
    }
}


accelerateButton.addEventListener('click', accelerate);
decelerateButton.addEventListener('click', decelerate);


document.addEventListener('keydown', (event) => {
    if (selectedCar) {
        if (event.key === 'ArrowUp') {
            accelerate();
        } else if (event.key === 'ArrowDown') {
            decelerate();
        }
    }
});

resetButton.addEventListener('click', () => {
    selectedCar = null;
    resultDiv.textContent = '?';
    body.style.backgroundColor = 'black';

    whiteCarSize = INITIAL_CAR_SIZE;
    redCarSize = INITIAL_CAR_SIZE;
    updateCarDisplay(whiteCar, whiteCarSize, true);
    updateCarDisplay(redCar, redCarSize, false);

    resetButton.style.display = 'none';
    accelerateButton.style.display = 'none';
    decelerateButton.style.display = 'none';

    stopCarSound(); 
});

resetButton.style.display = 'none';
accelerateButton.style.display = 'none';
decelerateButton.style.display = 'none';
