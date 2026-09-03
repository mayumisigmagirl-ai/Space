const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// =====================================================
// SPACE 2D - 1.00 - 2026
// Sistema Solar 2D
// =====================================================

canvas.width = 1200;
canvas.height = 700;

// -----------------------------------------------------
// JOGADOR
// -----------------------------------------------------

const player = {
    x: 0,
    y: -150,
    speed: 8,
    size: 8
};

// -----------------------------------------------------
// CÂMERA
// -----------------------------------------------------

const camera = {
    x: 0,
    y: 0,
    zoom: 1
};

// -----------------------------------------------------
// PLANETAS
// Distâncias são aumentadas para facilitar a exploração.
// -----------------------------------------------------

const planets = [
    {
        name: "Mercúrio",
        x: 180,
        y: 0,
        radius: 10,
        color: "#8c8c8c"
    },
    {
        name: "Vênus",
        x: 300,
        y: 0,
        radius: 15,
        color: "#d9a441"
    },
    {
        name: "Terra",
        x: 430,
        y: 0,
        radius: 17,
        color: "#2874d0"
    },
    {
        name: "Marte",
        x: 560,
        y: 0,
        radius: 13,
        color: "#c14432"
    },
    {
        name: "Júpiter",
        x: 800,
        y: 0,
        radius: 35,
        color: "#c89b72"
    },
    {
        name: "Saturno",
        x: 1050,
        y: 0,
        radius: 30,
        color: "#d6bd7a",
        rings: true
    },
    {
        name: "Urano",
        x: 1300,
        y: 0,
        radius: 23,
        color: "#75d6d6"
    },
    {
        name: "Netuno",
        x: 1500,
        y: 0,
        radius: 22,
        color: "#4169e1"
    }
];

// -----------------------------------------------------
// ESTRELAS
// -----------------------------------------------------

const stars = [];

for (let i = 0; i < 1000; i++) {
    stars.push({
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 3000 - 1500,
        size: Math.random() * 2 + 0.5
    });
}

// -----------------------------------------------------
// TECLAS
// -----------------------------------------------------

const keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// -----------------------------------------------------
// MOVIMENTO
// -----------------------------------------------------

function updatePlayer() {

    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
    }

    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
    }

    // Limite do Sistema Solar
    player.x = Math.max(-2000, Math.min(2000, player.x));
    player.y = Math.max(-1500, Math.min(1500, player.y));
}

// -----------------------------------------------------
// CÂMERA
// -----------------------------------------------------

function updateCamera() {
    camera.x += (player.x - camera.x) * 0.08;
    camera.y += (player.y - camera.y) * 0.08;
}

// -----------------------------------------------------
// COORDENADAS DO MUNDO → TELA
// -----------------------------------------------------

function worldToScreen(x, y) {

    return {
        x: (x - camera.x) * camera.zoom + canvas.width / 2,
        y: (y - camera.y) * camera.zoom + canvas.height / 2
    };
}

// -----------------------------------------------------
// FUNDO
// -----------------------------------------------------

function drawBackground() {

    ctx.fillStyle = "#02030a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {

        const position = worldToScreen(star.x, star.y);

        if (
            position.x < -10 ||
            position.x > canvas.width + 10 ||
            position.y < -10 ||
            position.y > canvas.height + 10
        ) {
            continue;
        }

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();
        ctx.arc(
            position.x,
            position.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

// -----------------------------------------------------
// SOL
// -----------------------------------------------------

function drawSun() {

    const sun = worldToScreen(0, 0);

    // Brilho
    const glow = ctx.createRadialGradient(
        sun.x,
        sun.y,
        20,
        sun.x,
        sun.y,
        130
    );

    glow.addColorStop(0, "rgba(255,255,180,0.8)");
    glow.addColorStop(0.4, "rgba(255,170,0,0.25)");
    glow.addColorStop(1, "rgba(255,100,0,0)");

    ctx.fillStyle = glow;

    ctx.beginPath();
    ctx.arc(sun.x, sun.y, 130, 0, Math.PI * 2);
    ctx.fill();

    // Sol
    ctx.fillStyle = "#ffcc33";

    ctx.beginPath();
    ctx.arc(sun.x, sun.y, 55, 0, Math.PI * 2);
    ctx.fill();
}

// -----------------------------------------------------
// ÓRBITAS
// -----------------------------------------------------

function drawOrbits() {

    ctx.lineWidth = 1;

    for (const planet of planets) {

        ctx.strokeStyle = "rgba(100,150,255,0.15)";

        ctx.beginPath();

        ctx.ellipse(
            canvas.width / 2,
            canvas.height / 2,
            Math.abs(planet.x) * camera.zoom,
            Math.abs(planet.x) * camera.zoom * 0.35,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }
}

// -----------------------------------------------------
// PLANETAS
// -----------------------------------------------------

function drawPlanet(planet) {

    const position = worldToScreen(
        planet.x,
        planet.y
    );

    const radius = planet.radius * camera.zoom;

    // Não desenha se estiver muito longe
    if (
        position.x < -100 ||
        position.x > canvas.width + 100 ||
        position.y < -100 ||
        position.y > canvas.height + 100
    ) {
        return;
    }

    // Anéis de Saturno
    if (planet.rings) {

        ctx.strokeStyle = "#c8b77a";
        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.ellipse(
            position.x,
            position.y,
            radius * 1.8,
            radius * 0.55,
            -0.2,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

    // Planeta
    ctx.fillStyle = planet.color;

    ctx.beginPath();

    ctx.arc(
        position.x,
        position.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Sombra
    const shadow = ctx.createRadialGradient(
        position.x - radius * 0.4,
        position.y - radius * 0.4,
        1,
        position.x,
        position.y,
        radius
    );

    shadow.addColorStop(0, "rgba(255,255,255,0.3)");
    shadow.addColorStop(1, "rgba(0,0,0,0.5)");

    ctx.fillStyle = shadow;

    ctx.beginPath();

    ctx.arc(
        position.x,
        position.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Nome
    if (radius > 8) {

        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            planet.name,
            position.x,
            position.y + radius + 20
        );
    }
}

// -----------------------------------------------------
// JOGADOR
// -----------------------------------------------------

function drawPlayer() {

    const position = worldToScreen(
        player.x,
        player.y
    );

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.arc(
        position.x,
        position.y,
        player.size,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Pequeno brilho
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 15;

    ctx.fillStyle = "#00ffff";

    ctx.beginPath();

    ctx.arc(
        position.x,
        position.y,
        player.size / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;
}

// -----------------------------------------------------
// INTERFACE
// -----------------------------------------------------

function drawInterface() {

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(15, 15, 280, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "SPACE 2D - 1.00 - 2026",
        30,
        40
    );

    ctx.font = "13px Arial";

    ctx.fillText(
        "WASD / Setas: explorar",
        30,
        62
    );

    ctx.fillText(
        "Sistema Solar",
        30,
        82
    );
}

// -----------------------------------------------------
// DESENHO
// -----------------------------------------------------

function draw() {

    drawBackground();

    drawOrbits();

    drawSun();

    for (const planet of planets) {
        drawPlanet(planet);
    }

    drawPlayer();

    drawInterface();
}

// -----------------------------------------------------
// LOOP DO JOGO
// -----------------------------------------------------

function gameLoop() {

    updatePlayer();
    updateCamera();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();


