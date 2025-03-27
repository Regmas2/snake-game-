// Get references to the canvas and score elements
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d'); // Context provides drawing methods
const scoreElement = document.getElementById('score');

// Game settings
const grid = 16; // Size of each square in the grid
const canvasSize = 400; // Must match canvas width/height in HTML
let count = 0; // Used for game loop speed control
let score = 0;

// The snake object
const snake = {
    x: 160, // Starting x position (center)
    y: 160, // Starting y position (center)
    dx: grid, // Horizontal speed (move one grid unit right initially)
    dy: 0,    // Vertical speed (0 initially)
    cells: [], // Array to hold the snake's body parts
    maxCells: 4 // Starting length
};

// The food object
const food = {
    x: 320, // Starting x position
    y: 320  // Starting y position
};

// --- Helper Functions ---

// Get random integer in a range (used for placing food)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Place food randomly on the grid
function placeFood() {
    food.x = getRandomInt(0, canvasSize / grid) * grid;
    food.y = getRandomInt(0, canvasSize / grid) * grid;
}

// --- Game Loop ---

function gameLoop() {
    // requestAnimationFrame is smoother than setInterval for animations
    requestAnimationFrame(gameLoop);

    // Slow down game loop (run logic only every 4 frames)
    if (++count < 15) { // Adjust this number to change game speed (lower = faster)
        return;
    }

    count = 0; // Reset frame counter
    context.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas

    moveSnake();
    checkCollisions();
    drawEntities();
}

// --- Movement Logic ---

function moveSnake() {
    // Move snake by updating its position based on velocity
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Keep track of where snake has been. Front of the array is always the head.
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Remove cells as snake moves away from them (maintains length)
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
}

// --- Collision Detection ---

function checkCollisions() {
    // Wall collisions
    if (snake.x < 0 || snake.x >= canvasSize || snake.y < 0 || snake.y >= canvasSize) {
        resetGame();
    }

    // Snake collision with itself
    for (let i = 1; i < snake.cells.length; i++) {
        if (snake.cells[i].x === snake.x && snake.cells[i].y === snake.y) {
            resetGame();
        }
    }

    // Snake eats food
    if (snake.x === food.x && snake.y === food.y) {
        snake.maxCells++; // Grow snake
        score++;          // Increase score
        scoreElement.textContent = score; // Update score display
        placeFood();      // Place new food
    }
}

// --- Drawing ---

function drawEntities() {
    // Draw food (make it red)
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, grid - 1, grid - 1); // Use grid-1 for slight gap

    // Draw snake (make it green)
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {
        // Draw each snake segment
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1); // Use grid-1 for slight gap
    });
}

// --- Game Reset ---

function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    score = 0;
    scoreElement.textContent = score;
    placeFood(); // Place initial food
}

// --- Keyboard Input ---

document.addEventListener('keydown', function(e) {
    // Left arrow key
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Up arrow key
    else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Right arrow key
    else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Down arrow key
    else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// --- Start Game ---
placeFood(); // Place initial food
requestAnimationFrame(gameLoop); // Start the game loop