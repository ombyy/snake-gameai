let snakeHead = []; 
let box = 20;
let position = { x: 0, y: 0 };
let gameArea = document.getElementById('gameArea');
let direction = null;
let gameInterval;
let timer = 0;
let timerInterval;
let food = document.getElementById('food');
let foodPosition = { x: 0, y: 0 };

document.addEventListener('keydown', keyDown);

function keyDown(e) {
    if (e.key === 'd' || e.key === 'D') {
        direction = 'RIGHT';
    } else if (e.key === 'a' || e.key === 'A') {
        direction = 'LEFT';
    } else if (e.key === 'w' || e.key === 'W') {
        direction = 'UP';
    } else if (e.key === 's' || e.key === 'S') {
        direction = 'DOWN';
    }
}

function initializeSnake() {
    try {
        let initialSegment = document.createElement('div');
        initialSegment.classList.add('snake-head');
        let initialPosition = {
            x: (gameArea.clientWidth / 2) - (box / 2),
            y: (gameArea.clientHeight / 2) - (box / 2)
        };
        position = initialPosition;
        initialSegment.style.left = position.x + 'px';
        initialSegment.style.top = position.y + 'px';
        initialSegment.classList.add('visible');
        gameArea.appendChild(initialSegment); 
        snakeHead.push(initialSegment); 
        console.log('Snake initialized:', snakeHead);
    } catch (error) {
        console.error('Error initializing snake:', error);
    }
}

function startTimer() {
    timer = 0;
    updateTimerDisplay();
    timerInterval = setInterval(function() {
        timer++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    let formattedTime = 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0');
    document.getElementById('timer').innerText = formattedTime;
}

function placeFood() {
    let maxX = gameArea.clientWidth - food.clientWidth;
    let maxY = gameArea.clientHeight - food.clientHeight;
    foodPosition.x = Math.floor(Math.random() * maxX);
    foodPosition.y = Math.floor(Math.random() * maxY);
    food.style.left = foodPosition.x + 'px';
    food.style.top = foodPosition.y + 'px';
    food.style.display = 'block';
}

function checkFoodCollision() {
    if (position.x < foodPosition.x + food.clientWidth &&
        position.x + snakeHead[0].clientWidth > foodPosition.x &&
        position.y < foodPosition.y + food.clientHeight &&
        position.y + snakeHead[0].clientHeight > foodPosition.y) {
        return true;
    }
    return false;
}

function handleFoodCollision() {
    if (checkFoodCollision()) {
        growSnake(); 
        placeFood(); 
    }
}

function growSnake() {
    try {
        const lastSegment = snakeHead[snakeHead.length - 1];
        const newSegment = document.createElement('div');
        newSegment.className = 'snake-segment';
        newSegment.style.width = box + 'px';
        newSegment.style.height = box + 'px';
        newSegment.style.left = lastSegment.style.left;
        newSegment.style.top = lastSegment.style.top;
        gameArea.appendChild(newSegment);
        snakeHead.push(newSegment); 
        console.log('Snake grew:', snakeHead);
    } catch (error) {
        console.error('Error growing snake:', error);
    }
}

function moveSnake() {
    try {
        if (direction === 'RIGHT') {
            position.x += box;
        } else if (direction === 'LEFT') {
            position.x -= box;
        } else if (direction === 'UP') {
            position.y -= box;
        } else if (direction === 'DOWN') {
            position.y += box;
        }

        let gameAreaRect = gameArea.getBoundingClientRect();

        
        if (position.x >= gameAreaRect.width) position.x = gameAreaRect.width - box;
        if (position.y < 0) position.y = 0;
        if (position.y >= gameAreaRect.height) position.y = gameAreaRect.height - box;

        for (let i = snakeHead.length - 1; i > 0; i--) {
            snakeHead[i].style.left = snakeHead[i - 1].style.left;
            snakeHead[i].style.top = snakeHead[i - 1].style.top;
        }
        if (snakeHead.length > 0) {
            snakeHead[0].style.left = position.x + 'px';
            snakeHead[0].style.top = position.y + 'px';
        }

        console.log('Snake moved:', snakeHead);
        handleFoodCollision(); 
    } catch (error) {
        console.error('Error moving snake:', error);
    }
}

function clearsnake() {
    for (let i = 0; i < snakeHead.length; i++) {
        gameArea.removeChild(snakeHead[i]);
    }
    snakeHead = [];
}

function resettmer() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '00:00';
}

document.getElementById('startButton').addEventListener('click', function() {
    clearsnake();
    resettmer();
    initializeSnake();
    direction = null;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, 200);
    startTimer();
    placeFood();
});