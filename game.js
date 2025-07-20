const canvas = document.getElementById('pong-canvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_MARGIN = 10;
const PADDLE_SPEED = 5;

// Ball settings
const BALL_SIZE = 12;
const BALL_SPEED = 5;

// Game state
let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

// Score
let leftScore = 0;
let rightScore = 0;

// Mouse control (left paddle)
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within bounds
    leftPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, leftPaddleY));
});

// AI control (right paddle)
function updateAIPaddle() {
    // Simple AI: Move towards ball's Y position
    let target = ballY + BALL_SIZE / 2 - PADDLE_HEIGHT / 2;
    if (rightPaddleY < target) {
        rightPaddleY += PADDLE_SPEED;
        if (rightPaddleY > target) rightPaddleY = target;
    } else if (rightPaddleY > target) {
        rightPaddleY -= PADDLE_SPEED;
        if (rightPaddleY < target) rightPaddleY = target;
    }
    // Clamp within bounds
    rightPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddleY));
}

// Ball movement and collision
function updateBall() {
    ballX += ballVX;
    ballY += ballVY;

    // Top/bottom wall collision
    if (ballY <= 0) {
        ballY = 0;
        ballVY = -ballVY;
    }
    if (ballY + BALL_SIZE >= HEIGHT) {
        ballY = HEIGHT - BALL_SIZE;
        ballVY = -ballVY;
    }

    // Left paddle collision
    if (
        ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE > leftPaddleY &&
        ballY < leftPaddleY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
        ballVX = -ballVX;
        // Add random Y velocity for bounce variation
        ballVY += (Math.random() - 0.5) * 2;
    }

    // Right paddle collision
    if (
        ballX + BALL_SIZE >= WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE > rightPaddleY &&
        ballY < rightPaddleY + PADDLE_HEIGHT
    ) {
        ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballVX = -ballVX;
        ballVY += (Math.random() - 0.5) * 2;
    }

    // Score check
    if (ballX < 0) {
        rightScore++;
        resetBall(-1);
    } else if (ballX + BALL_SIZE > WIDTH) {
        leftScore++;
        resetBall(1);
    }
}

// Reset ball position and direction
function resetBall(direction) {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    ballVX = BALL_SPEED * direction;
    ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Drawing
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Middle line
    ctx.strokeStyle = '#00ff99';
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Left paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(PADDLE_MARGIN, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Right paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillStyle = '#00ff99';
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Score
    ctx.font = '32px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(leftScore, WIDTH / 4, 40);
    ctx.fillText(rightScore, WIDTH * 3 / 4, 40);
}

// Game loop
function loop() {
    updateAIPaddle();
    updateBall();
    draw();
    requestAnimationFrame(loop);
}

// Start game
loop();