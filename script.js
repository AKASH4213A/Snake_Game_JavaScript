const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start")
const modal = document.querySelector(".modal");
const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const restartButton = document.querySelector(".btn-restart");
const startGameModal = document.querySelector(".start-game");
const gameOverModel = document.querySelector(".game-over");


let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`;
highScoreElement.innerText = highScore;


const blockHeight = 50;
const blockWidth = 50;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalId = null;

const blocks = [];
let snake = [{ x: 0, y: 0 },];

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

let direction = 'right'

// for(let i = 0; i < rows * cols; i++)
// {
//     const block = document.createElement('div');
//     block.classList.add("block")
//     board.appendChild(block);

// }

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `${row}-${col}`
        blocks[`${row}-${col}`] = block;
    }
}

function render() {

    let head = null
    blocks[`${food.x}-${food.y}`].classList.add("food");
    if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }
    else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    // collision logic 
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        // alert("Game Over");
        clearInterval(intervalId);

        modal.style.display = "flex";
        startGameModal.style.display = "none";
        gameOverModel.style.display = "flex";
        return;
    }


    // consuming food logic 
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");

        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);
        score += 10;
        scoreElement.innerText = score;

        if(score > highScore)
        {
            highScore = score;
            highScoreElement.innerText = highScore;
            localStorage.setItem("highScore",highScore.toString());
        }

    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    snake.unshift(head);
    snake.pop();

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}

// intervalId = setInterval(() => {

//     render();
// }, 400);

startButton.addEventListener("click", () => {
    modal.style.display = "none";
    intervalId = setInterval(() => render(), 400);
    timerIntervalId = setInterval(() => {
        // destructuring the time //
        let[min,sec] = time.split("-").map(Number)
        if(sec == 59){
            min += 1;
            sec = 0;
        }
        else{
            sec += 1;
        }

        time = `${min}-${sec}`;
        timeElement.innerText = time;
    },1000)
});

restartButton.addEventListener("click", restartGame);

function restartGame() {

    score  = 0;
    time = `00-00`;

    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;


    clearInterval(timerIntervalId);
    clearInterval(intervalId);
    timerIntervalId = null;
    intervalId = null;

    direction = "left";
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    blocks[`${food.x}-${food.y}`].classList.remove("food");

    modal.style.display = "none";

    snake = [{ x: 1, y: 3 }];

    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

    intervalId = setInterval(() => render(), 400);
    timerIntervalId = setInterval(() => {

    let [min, sec] = time.split("-").map(Number);

    if (sec === 59) {
        min++;
        sec = 0;
    } else {
        sec++;
    }

    time = `${min}-${sec}`;
    timeElement.innerText = time;

}, 1000);
}



// for keyboard inputs // 
addEventListener("keydown", (eve) => {
    if (eve.key === "ArrowUp") {
        direction = 'up';
    }
    else if (eve.key === "ArrowDown") {
        direction = "down";
    }
    else if (eve.key === "ArrowLeft") {
        direction = "left";
    }
    else if (eve.key === "ArrowRight") {
        direction = "right";
    }
})