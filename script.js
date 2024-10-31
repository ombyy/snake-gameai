let snakeHead = []; 
let box = 20;
let position = { x: 0, y: 0 };
let gameArea = document.getElementById('gameArea');
let direction = null;
let gameInterval;
let timer = 0;
let timerInterval;
let scoreInterval;
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
    document.getElementById('timer').innerText = 'Survival: ' + formattedTime;
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
        updateScore(); // Update the score when food is eaten
    }
}

function updateScore(points = 10) {
    let scoreElement = document.getElementById('score');
    let scoreText = scoreElement.innerText;
    let score = parseInt(scoreText.split(': ')[1], 10); // Extract the current score number
    if (isNaN(score)) {
        score = 0; // Initialize score if it's NaN
    }
    score+= points;
    scoreElement.innerText = 'Score: ' + score;
}

function growSnake() {
    try {
        const lastSegment = snakeHead[snakeHead.length - 1];
        const newSegment = document.createElement('div');
        newSegment.className = 'snake-segment';
        newSegment.style.width = box + 'px';
        newSegment.style.height = box + 'px';

        // Position the new segment based on the direction of the last segment
        let lastSegmentX = parseInt(lastSegment.style.left, 10);
        let lastSegmentY = parseInt(lastSegment.style.top, 10);

        if (direction === 'RIGHT') {
            newSegment.style.left = (lastSegmentX - box) + 'px';
            newSegment.style.top = lastSegmentY + 'px';
        } else if (direction === 'LEFT') {
            newSegment.style.left = (lastSegmentX + box) + 'px';
            newSegment.style.top = lastSegmentY + 'px';
        } else if (direction === 'UP') {
            newSegment.style.left = lastSegmentX + 'px';
            newSegment.style.top = (lastSegmentY + box) + 'px';
        } else if (direction === 'DOWN') {
            newSegment.style.left = lastSegmentX + 'px';
            newSegment.style.top = (lastSegmentY - box) + 'px';
        }

        gameArea.appendChild(newSegment);
        snakeHead.push(newSegment); 
        console.log('Snake grew:', snakeHead);
    } catch (error) {
        console.error('Error growing snake:', error);
    }
}

function moveSnake() {
    try {
        // Store the current positions of all segments
        let segmentPositions = snakeHead.map(segment => ({
            x: parseInt(segment.style.left, 10),
            y: parseInt(segment.style.top, 10)
        }));

        // Update the head position based on the direction
        if (direction === 'RIGHT') {
            position.x += box;
        } else if (direction === 'LEFT') {
            position.x -= box;
        } else if (direction === 'UP') {
            position.y -= box;
        } else if (direction === 'DOWN') {
            position.y += box;
        }

        // Boundary checks to keep the snake head inside the game area
        let gameAreaRect = gameArea.getBoundingClientRect();
        if (position.x >= gameAreaRect.width) position.x = gameAreaRect.width - box;
        if (position.x < 0) position.x = 0; // Added check for left boundary
        if (position.y < 0) position.y = 0;
        if (position.y >= gameAreaRect.height) position.y = gameAreaRect.height - box;

        // Move the head to the new position
        snakeHead[0].style.left = position.x + 'px';
        snakeHead[0].style.top = position.y + 'px';

        // Move each segment to the position of the segment in front of it
        for (let i = snakeHead.length - 1; i > 0; i--) {
            snakeHead[i].style.left = segmentPositions[i - 1].x + 'px';
            snakeHead[i].style.top = segmentPositions[i - 1].y + 'px';
        }

        console.log('Snake moved:', snakeHead);
        handleFoodCollision(); 

        // Check for self-collision
        if (checkSelfCollision()) {
            gameOver();
        }
    } catch (error) {
        console.error('Error moving snake:', error);
    }
}

function checkSelfCollision() {
    for (let i = 1; i < snakeHead.length; i++) {
        if (position.x === parseInt(snakeHead[i].style.left, 10) &&
            position.y === parseInt(snakeHead[i].style.top, 10)) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearInterval(scoreInterval);
    alert('Game Over! Your score is ' + document.getElementById('score').innerText.split(': ')[1]);
}

function clearsnake() {
    for (let i = 0; i < snakeHead.length; i++) {
        gameArea.removeChild(snakeHead[i]);
    }
    snakeHead = [];
}

function clearscore() {
    document.getElementById('score').innerText = 'Score: 0';
}

function resettmer() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '00:00';
}

function startScoreInterval() {
    scoreInterval = setInterval(() => updateScore(10), 10000); // Add 10 to score every 10 seconds
}

function stopscoreInterval() {
    clearInterval(scoreInterval);
}

function clearScoreInterval() {
    clearInterval(scoreInterval);
}

document.getElementById('startButton').addEventListener('click', function() {
    clearsnake();
    resettmer();
    clearscore();
    stopscoreInterval();
    initializeSnake();
    direction = null;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, 200);
    startTimer();
    placeFood();
    startScoreInterval(); // Start the score interval
});

document.getElementById('resetButton').addEventListener('click', function() {
    clearScoreInterval(); // Clear the score interval
    clearInterval(gameInterval);
    clearsnake();
    resettmer();
    clearscore();
});