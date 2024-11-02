let snakeHead = []; 
let box = 20;
let position = { x: 0, y: 0 };
let gameArea = document.getElementById('gameArea');
let direction = null;
let gameInterval;
let timer = 0;
let timerInterval;
let scoreInterval;
let enemySpawnInterval; 
let food = document.getElementById('food');
let foodItems = []; 


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

    // Set up a timer to spawn megafood after 30 seconds
    setTimeout(() => {
        console.log('30 seconds passed, spawning megafood');
        spawnMegaFood();
    }, 30000); // 30 seconds in milliseconds
}

function spawnMegaFood() {
    let megaFood = document.createElement('div');
    megaFood.classList.add('megafood');
    megaFood.style.width = '30px';
    megaFood.style.height = '30px';
    let maxX = gameArea.clientWidth - 30;
    let maxY = gameArea.clientHeight - 30;
    let megaFoodX = Math.floor(Math.random() * maxX);
    let megaFoodY = Math.floor(Math.random() * maxY);
    megaFood.style.left = megaFoodX + 'px';
    megaFood.style.top = megaFoodY + 'px';
    gameArea.appendChild(megaFood);
    console.log('Megafood spawned at:', megaFoodX, megaFoodY);
}

function updateTimerDisplay() {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    let formattedTime = 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0');
    document.getElementById('timer').innerText = 'Survival: ' + formattedTime;
}

function placeFood(numFoodItems = 20) { 
    
    foodItems.forEach(item => gameArea.removeChild(item));
    foodItems = [];

    for (let i = 0; i < numFoodItems; i++) {
        let foodItem = food.cloneNode(true); 
        let maxX = gameArea.clientWidth - box;
        let maxY = gameArea.clientHeight - box;
        let foodX = Math.floor(Math.random() * maxX);
        let foodY = Math.floor(Math.random() * maxY);
        foodItem.style.left = foodX + 'px';
        foodItem.style.top = foodY + 'px';
        foodItem.style.display = 'block';
        gameArea.appendChild(foodItem);
        foodItems.push(foodItem); 
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
            gameArea.removeChild(foodItem); 
            foodItems = foodItems.filter(item => item !== foodItem); 
            return true;
        }
    }
    return false;
}

function handleFoodCollision() {
    if (checkFoodCollision()) {
        growSnake();
        if (foodItems.length === 0) {
            placeFood();
        }
        updateScore();
    }

    // Check for collision with megafood
    let megaFood = document.querySelector('.megafood');
    if (megaFood) {
        let megaFoodX = parseInt(megaFood.style.left, 10);
        let megaFoodY = parseInt(megaFood.style.top, 10);
        if (position.x < megaFoodX + box &&
            position.x + snakeHead[0].clientWidth > megaFoodX &&
            position.y < megaFoodY + box &&
            position.y + snakeHead[0].clientHeight > megaFoodY) {
            gameArea.removeChild(megaFood);
            growSnake(3); // Grow the snake by 3 segments
            updateScore(30); // Increase the score by 30 points
        }
    }
}

function updateScore(points = 10) {
    let scoreElement = document.getElementById('score');
    let scoreText = scoreElement.innerText;
    let score = parseInt(scoreText.split(': ')[1], 10);
    if (isNaN(score)) {
        score = 0;
    }
    score += points;
    scoreElement.innerText = 'Score: ' + score;

    displayscoreonchar(points > 0 ? `+${points}` : `${points}`);
}

function NegupdateScore(points = -10) {
    let scoreElement = document.getElementById('score');
    let scoreText = scoreElement.innerText;
    let score = parseInt(scoreText.split(': ')[1], 10);
    if (isNaN(score)) {
        score = 0;
    }
    score += points;
    scoreElement.innerText = 'Score: ' + score;

    displayscoreonchar(points > 0 ? `+${points}` : `${points}`);
}

function growSnake(times = 1) {
    try {
        for (let t = 0; t < times; t++) {
            const lastSegment = snakeHead[snakeHead.length - 1];
            const newSegment = document.createElement('div');
            newSegment.className = 'snake-segment';
            newSegment.style.width = box + 'px';
            newSegment.style.height = box + 'px';

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
        }
    } catch (error) {
        console.error('Error growing snake:', error);
    }
}

function moveSnake() {
    try {
        let segmentPositions = snakeHead.map(segment => ({
            x: parseInt(segment.style.left, 10),
            y: parseInt(segment.style.top, 10)
        }));

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
        if (position.x < 0) position.x = 0;
        if (position.y < 0) position.y = 0;
        if (position.y >= gameAreaRect.height) position.y = gameAreaRect.height - box;

        snakeHead[0].style.left = position.x + 'px';
        snakeHead[0].style.top = position.y + 'px';

        for (let i = snakeHead.length - 1; i > 0; i--) {
            snakeHead[i].style.left = segmentPositions[i - 1].x + 'px';
            snakeHead[i].style.top = segmentPositions[i - 1].y + 'px';
        }

        handleFoodCollision(); 
        zen();

        if (checkSelfCollision()) {
            gameOver();
        }

        if (handleEnemyCollision()) {
            NegupdateScore();
        }

        
        let zenText = document.getElementById('zenText');
        if (zenText.style.display === 'block') {
            displayscoreonchar(zenText.innerText);
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
            createEffect(enemyX, enemyY); 
            gameArea.removeChild(enemy); 
            if (snakeHead.length > 1) {
                let lastSegment = snakeHead.pop(); 
                gameArea.removeChild(lastSegment);
            } else {
                gameOver(); 
            }
            return true;
        }
    }
    return false;
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    clearInterval(scoreInterval);
    clearInterval(enemySpawnInterval);
    clearsnake();
    clearscore();
    resettmer();
    clearEnemies();
    direction = null;
}

function gameOver() {
    createEffect(position.x, position.y); 
    alert('BIG SLAM! unlucky, Your score is ' + document.getElementById('score').innerText.split(': ')[1]);
    resetGame();
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
    clearInterval(enemySpawnInterval); 
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => gameArea.removeChild(enemy));
}

function resettmer() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '00:00';
}

function startScoreInterval() {
    scoreInterval = setInterval(() => updateScore(10), 10000); 
}

function clearScoreInterval() {
    clearInterval(scoreInterval);
}

function enemyspawninterval(interval = 10000, numEnemies = 1) {
    clearInterval(enemySpawnInterval); // Clear any existing interval
    enemySpawnInterval = setInterval(() => spawnenemy(numEnemies), interval);
}

function zen(offsetX = -90, offsetY = -90) {
    let zenDiv = document.getElementById('zen');
    let snakeHeadX = parseInt(snakeHead[0].style.left, 10);
    let snakeHeadY = parseInt(snakeHead[0].style.top, 10);

    
    if (direction === 'LEFT') {
        zenDiv.style.transform = 'scaleX(-1)'; 
    } else if (direction === 'RIGHT') {
        zenDiv.style.transform = 'scaleX(1)'; 
    }

   
    zenDiv.style.left = (snakeHeadX + offsetX) + 'px';
    zenDiv.style.top = (snakeHeadY + offsetY) + 'px';
    
    console.log('Zen moved to:', snakeHeadX + offsetX, snakeHeadY + offsetY);
}

let isDisplayingScore = false;

function displayscoreonchar(text) {
    let zenText = document.getElementById('zenText');
    let existingClone = document.getElementById('zenText1');
    let snakeHeadX = parseInt(snakeHead[0].style.left, 10);
    let snakeHeadY = parseInt(snakeHead[0].style.top, 10);

    let textColor = text.startsWith('-') ? 'red' : 'rgb(224, 192, 11)';

    if (zenText.style.display === 'block') {
        if (existingClone) {
            existingClone.style.left = snakeHeadX + 'px';
            existingClone.style.top = (snakeHeadY - 30) + 'px';
            existingClone.innerText = text;
            existingClone.style.color = textColor;
            existingClone.style.display = 'block';
            existingClone.classList.add('animate-move-down-fade-out');

            setTimeout(() => {
                existingClone.style.display = 'none';
                existingClone.classList.remove('animate-move-down-fade-out');
            }, 500);
        } else {
            let newZenText = zenText.cloneNode(true);
            newZenText.id = 'zenText1';
            newZenText.style.left = snakeHeadX + 'px';
            newZenText.style.top = (snakeHeadY - 30) + 'px';
            newZenText.innerText = text;
            newZenText.style.color = textColor;
            newZenText.style.display = 'block';
            newZenText.classList.add('animate-move-down-fade-out');
            gameArea.appendChild(newZenText);

            setTimeout(() => {
                newZenText.style.display = 'none';
                newZenText.classList.remove('animate-move-down-fade-out');
                gameArea.removeChild(newZenText);
            }, 500);
        }
    } else {
        zenText.style.left = snakeHeadX + 'px';
        zenText.style.top = (snakeHeadY - 30) + 'px';
        zenText.innerText = text;
        zenText.style.color = textColor;
        zenText.style.display = 'block';
        zenText.classList.add('animate-move-down-fade-out');

        setTimeout(() => {
            zenText.style.display = 'none';
            zenText.classList.remove('animate-move-down-fade-out');
        }, 500);
    }

    console.log('Score text displayed:', text);
}

function spawnenemy(numEnemies = 1) {
    for (let i = 0; i < numEnemies; i++) {
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.width = '150px';
        enemy.style.height = '75px';
        let maxX = gameArea.clientWidth - 150;
        let maxY = gameArea.clientHeight - 50;
        let enemyX = Math.floor(Math.random() * maxX);
        let enemyY = Math.floor(Math.random() * maxY);
        enemy.style.left = enemyX + 'px';
        enemy.style.top = enemyY + 'px';
        gameArea.appendChild(enemy);
        console.log('Enemy spawned at:', enemyX, enemyY);

        setInterval(() => moveEnemyTowardsSnake(enemy), 15);

        setTimeout(() => {
            if (gameArea.contains(enemy)) {
                createEffect(enemyX, enemyY);
                gameArea.removeChild(enemy);
            }
        }, 5000);
    }
}

function createEffect(x, y) {
    let effect = document.createElement('div');
    effect.classList.add('effect');
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    gameArea.appendChild(effect);

   
    setTimeout(() => {
        if (gameArea.contains(effect)) {
            gameArea.removeChild(effect);
        }
    }, 500); 
}

function moveEnemyTowardsSnake(enemy) {
    let enemyX = parseInt(enemy.style.left, 10);
    let enemyY = parseInt(enemy.style.top, 10);
    let snakeHeadX = parseInt(snakeHead[0].style.left, 10);
    let snakeHeadY = parseInt(snakeHead[0].style.top, 10);

    if (enemyX < snakeHeadX) {
        enemyX += 1; 
        enemy.style.transform = 'scaleX(1)';
    } else if (enemyX > snakeHeadX) {
        enemyX -= 1;
        enemy.style.transform = 'scaleX(-1)'; 
    }

    if (enemyY < snakeHeadY) {
        enemyY += 1; 
    } else if (enemyY > snakeHeadY) {
        enemyY -= 1; 
    }

    enemy.style.left = enemyX + 'px';
    enemy.style.top = enemyY + 'px';
}

document.getElementById('startButton').addEventListener('click', function() {
    resetGame();
    initializeSnake();
    gameInterval = setInterval(moveSnake, 200);
    zen();
    startTimer();
    placeFood();
    startScoreInterval();
    enemyspawninterval(); 
});

document.getElementById('resetButton').addEventListener('click', function() {
    resetGame();
});

document.getElementById('W').addEventListener('click', function() {
    direction = 'UP';
    moveSnake();
});

document.getElementById('A').addEventListener('click', function() {
    direction = 'LEFT';
    moveSnake();
});

document.getElementById('S').addEventListener('click', function() {
    direction = 'DOWN';
    moveSnake();
});

document.getElementById('D').addEventListener('click', function() {
    direction = 'RIGHT';
    moveSnake();
});