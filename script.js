const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Nave
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 70,
    width: 40,
    height: 40,
    speed: 5
};

// Teclas pressionadas
const keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

// Desenha a nave
function drawPlayer() {
    ctx.fillStyle = "#00ffff";

    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();

    ctx.fill();
}

// Atualiza o jogo
function update() {
    if (keys["ArrowLeft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["ArrowRight"] || keys["d"]) {
        player.x += player.speed;
    }

    // Impede a nave de sair da tela
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

// Desenha tudo
function draw() {
    // Fundo
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
}

// Loop principal
function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();

