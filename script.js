let snakeHead = []; 
let box = 20;
let position = { x: 0, y: 0 };
let gameArea = document.getElementById('gameArea');
let direction = null;
let gameInterval;
let timer = 0;
let timerInterval;
let scoreInterval;
let enemySpawnInterval; // Variable to store the interval ID
let food = document.getElementById('food');
let foodItems = []; // Array to store multiple food items

// Hide the initial food element
food.style.display = 'none';

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
        console.log(timer);
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

function placeFood(numFoodItems = 3) { 
    // Clear existing food items
    foodItems.forEach(item => gameArea.removeChild(item));
    foodItems = [];

    for (let i = 0; i < numFoodItems; i++) {
        let foodItem = food.cloneNode(true); // Clone the existing food element
        let maxX = gameArea.clientWidth - box;
        let maxY = gameArea.clientHeight - box;
        let foodX = Math.floor(Math.random() * maxX);
        let foodY = Math.floor(Math.random() * maxY);
        foodItem.style.left = foodX + 'px';
        foodItem.style.top = foodY + 'px';
        foodItem.style.display = 'block';
        gameArea.appendChild(foodItem);
        foodItems.push(foodItem); // Add the food item to the array
    }
}

function checkFoodCollision() {
    for (let foodItem of foodItems) {
        let foodX = parseInt(foodItem.style.left, 10);
        let foodY = parseInt(foodItem.style.top, 10);
        if (position.x < foodX + box &&
            position.x + snakeHead[0].clientWidth > foodX &&
            position.y < foodY + box &&
            position.y + snakeHead[0].clientHeight > foodY) {
            gameArea.removeChild(foodItem); // Remove the eaten food item
            foodItems = foodItems.filter(item => item !== foodItem); // Remove the item from the array
            return true;
        }
    }
    return false;
}

function handleFoodCollision() {
    if (checkFoodCollision()) {
        growSnake(); 
        if (foodItems.length === 0) {
            placeFood(); // Replenish food items if all are eaten
        }
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

function NegupdateScore(points = -10) {
    let scoreElement = document.getElementById('score');
    let scoreText = scoreElement.innerText;
    let score = parseInt(scoreText.split(': ')[1], 10); // Extract the current score number
    if (isNaN(score)) {
        score = 0; // Initialize score if it's NaN
    }
    score += points;
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
        zen();
        handleFoodCollision(); 

        // Check for self-collision
        if (checkSelfCollision()) {
            gameOver();
        }

        // Check for enemy collision and remove the enemy if a collision is detected
        if (handleEnemyCollision()) {
            NegupdateScore(); // Decrease the score when an enemy is hit
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

function handleEnemyCollision() {
    let enemies = document.querySelectorAll('.enemy');
    for (let enemy of enemies) {
        let enemyX = parseInt(enemy.style.left, 10);
        let enemyY = parseInt(enemy.style.top, 10);
        if (position.x < enemyX + box &&
            position.x + snakeHead[0].clientWidth > enemyX &&
            position.y < enemyY + box &&
            position.y + snakeHead[0].clientHeight > enemyY) {
            createEffect(enemyX, enemyY); // Create an effect at the enemy position
            gameArea.removeChild(enemy); // Remove the enemy element
            if (snakeHead.length > 1) {
                let lastSegment = snakeHead.pop(); // Remove the last segment of the snake
                gameArea.removeChild(lastSegment);
            } else {
                gameOver(); // End the game if the snake has only one segment left
            }
            return true;
        }
    }
    return false;
}

function gameOver() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearInterval(scoreInterval);
    createEffect(position.x, position.y); // Create an effect at the snake head position
    clearEnemies(); // Clear enemies
    alert('BIG SLAM! unlucky, Your score is ' + document.getElementById('score').innerText.split(': ')[1]);
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

function clearEnemies() {
    clearInterval(enemySpawnInterval); // Stop the enemy spawn interval
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => gameArea.removeChild(enemy));
}

function resettmer() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '00:00';
}

function startScoreInterval() {
    scoreInterval = setInterval(() => updateScore(10), 10000); // Add 10 to score every 10 seconds
}

function clearScoreInterval() {
    clearInterval(scoreInterval);
}

function enemyspawninterval() {
    enemySpawnInterval = setInterval(spawnenemy, 10000); // Call spawnenemy every second
}

function zen(offsetX = -90, offsetY = -90) {
    let zenDiv = document.getElementById('zen');
    let snakeHeadX = parseInt(snakeHead[0].style.left, 10);
    let snakeHeadY = parseInt(snakeHead[0].style.top, 10);

    // Determine the direction of movement
    if (direction === 'LEFT') {
        zenDiv.style.transform = 'scaleX(-1)'; // Flip horizontally
    } else if (direction === 'RIGHT') {
        zenDiv.style.transform = 'scaleX(1)'; // Return to normal
    }

    // Move the zen div to the offset position relative to the snake head
    zenDiv.style.left = (snakeHeadX + offsetX) + 'px';
    zenDiv.style.top = (snakeHeadY + offsetY) + 'px';
    
    console.log('Zen moved to:', snakeHeadX + offsetX, snakeHeadY + offsetY);
}

function spawnenemy() {
    let enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.width = '150px'; /* Match the width defined in CSS */
    enemy.style.height = '75px'; /* Match the height defined in CSS */
    let maxX = gameArea.clientWidth - 150; /* Adjust for the new width */
    let maxY = gameArea.clientHeight - 50; /* Adjust for the new height */
    let enemyX = Math.floor(Math.random() * maxX);
    let enemyY = Math.floor(Math.random() * maxY);
    enemy.style.left = enemyX + 'px';
    enemy.style.top = enemyY + 'px';
    gameArea.appendChild(enemy);
    console.log('Enemy spawned at:', enemyX, enemyY); 

    // Move the enemy towards the snake at regular intervals
    setInterval(() => moveEnemyTowardsSnake(enemy), 15);

    // Remove the enemy after 5 seconds with effect
    setTimeout(() => {
        if (gameArea.contains(enemy)) {
            createEffect(enemyX, enemyY);
            gameArea.removeChild(enemy);
            console.log('Enemy removed after 5 seconds:', enemyX, enemyY);
        }
    }, 5000);
}


function createEffect(x, y) {
    let effect = document.createElement('div');
    effect.classList.add('effect');
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    gameArea.appendChild(effect);

    // Remove the effect after the animation completes
    setTimeout(() => {
        if (gameArea.contains(effect)) {
            gameArea.removeChild(effect);
        }
    }, 500); // Match the duration of the effect animation
}

function moveEnemyTowardsSnake(enemy) {
    let enemyX = parseInt(enemy.style.left, 10);
    let enemyY = parseInt(enemy.style.top, 10);
    let snakeHeadX = parseInt(snakeHead[0].style.left, 10);
    let snakeHeadY = parseInt(snakeHead[0].style.top, 10);

    if (enemyX < snakeHeadX) {
        enemyX += 1; // Move right
        enemy.style.transform = 'scaleX(1)'; // Return to normal
    } else if (enemyX > snakeHeadX) {
        enemyX -= 1; // Move left
        enemy.style.transform = 'scaleX(-1)'; // Flip horizontally
    }

    if (enemyY < snakeHeadY) {
        enemyY += 1; // Move down
    } else if (enemyY > snakeHeadY) {
        enemyY -= 1; // Move up
    }

    enemy.style.left = enemyX + 'px';
    enemy.style.top = enemyY + 'px';
}

document.getElementById('startButton').addEventListener('click', function() {
    clearsnake();
    resettmer();
    clearScoreInterval();
    clearscore();
    initializeSnake();
    clearEnemies();
    direction = null;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, 200);
    zen();
    startTimer();
    placeFood();
    startScoreInterval();
    enemyspawninterval(); // Start the enemy spawn interval
});

document.getElementById('resetButton').addEventListener('click', function() {
    clearScoreInterval(); // Clear the score interval
    clearInterval(gameInterval);
    clearsnake();
    resettmer();
    clearscore();
    clearEnemies(); // Clear enemies
});