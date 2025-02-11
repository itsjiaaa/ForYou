document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lockBoard = false;

    function flipCard() {
        if (lockBoard || this === firstCard) return;
        this.classList.add("flipped");
        this.textContent = this.dataset.emoji;

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.textContent = "";
            secondCard.textContent = "";
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    (function shuffle() {
        cards.forEach(card => {
            let randomPos = Math.floor(Math.random() * 30);
            card.style.order = randomPos;
        });
    })();

    cards.forEach(card => card.addEventListener("click", flipCard));
});

function showContent(id) {
    // Hide all contents
    document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
    
    // Show the selected content
    document.getElementById(id).classList.add('active');
    
    // Specifically handle the 'gift' section
    if (id === 'gift') {
        document.getElementById('gift').style.display = 'flex'; // Show gift section
    } else {
        document.getElementById('gift').style.display = 'none'; // Hide gift section
    }
}

// Maze Game Logic
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 40;
const cols = Math.floor(canvas.width / tileSize);
const rows = Math.floor(canvas.height / tileSize);

const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

let player = { x: 1, y: 1 };
const goal = { x: cols - 2, y: rows - 2 };

// ฟังก์ชั่นสร้างเส้นทางโดยใช้ DFS
function createPathDFS(x, y) {
    let stack = [[x, y]];
    let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[y][x] = true;

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    while (stack.length > 0) {
        let [cx, cy] = stack.pop();
        maze[cy][cx] = 0;

        directions.sort(() => Math.random() - 0.5);

        for (let [dx, dy] of directions) {
            let nx = cx + dx * 2, ny = cy + dy * 2;
            if (nx > 0 && ny > 0 && nx < cols - 1 && ny < rows - 1 && !visited[ny][nx]) {
                maze[cy + dy][cx + dx] = 0;
                maze[ny][nx] = 0;
                visited[ny][nx] = true;
                stack.push([nx, ny]);
            }
        }
    }
}

function ensurePathToGoal() {
    createPathDFS(1, 1);
    maze[goal.y][goal.x] = 0; // ทำให้แน่ใจว่าจุดหมายเป็นช่องว่าง
}

// ฟังก์ชั่นวาดเขาวงกต
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? "#7fb3e2" : "#ffffff";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.fillText("👶", player.x * tileSize + tileSize / 2, player.y * tileSize + tileSize / 1.5);
    ctx.fillText("❤️", goal.x * tileSize + tileSize / 2, goal.y * tileSize + tileSize / 1.5);
}

// ฟังก์ชั่นเคลื่อนที่ของตัวละคร
function movePlayer(event) {
    let newX = player.x;
    let newY = player.y;

    if (event.key === "ArrowUp") newY--;
    if (event.key === "ArrowDown") newY++;
    if (event.key === "ArrowLeft") newX--;
    if (event.key === "ArrowRight") newX++;

    if (maze[newY] && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        drawMaze();
        checkWin();
    }
}

// ฟังก์ชั่นตรวจสอบการชนะ
function checkWin() {
    if (player.x === goal.x && player.y === goal.y) {
        setTimeout(() => alert("🎉 恭喜你！你到达终点了 🎉"), 100);
    }
}

ensurePathToGoal();
drawMaze();
document.addEventListener('keydown', movePlayer);