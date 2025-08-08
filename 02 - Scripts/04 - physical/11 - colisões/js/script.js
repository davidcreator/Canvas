// === CONFIGURAÇÃO INICIAL ===
// Obtém referência do elemento canvas e define contexto 2D para desenho
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// === PROPRIEDADES DA BOLA ===
let ball = {
    x: canvas.width / 2,      // Posição horizontal inicial (centro)
    y: canvas.height / 2,     // Posição vertical inicial (centro)
    dx: 3,                    // Velocidade horizontal (pixels por frame)
    dy: 2,                    // Velocidade vertical (pixels por frame)
    radius: 25,               // Raio da bola em pixels
    color: '#FF6B6B'          // Cor da bola (vermelho coral)
};

// === VARIÁVEIS DE CONTROLE ===
let animationId = null;       // ID da animação para controle
let isRunning = false;        // Estado da simulação (rodando/parada)

// === FUNÇÃO: DESENHAR BOLA ===
// Desenha a bola na posição atual com efeito de gradiente
function drawBall() {
    // Cria gradiente radial para efeito 3D
    const gradient = ctx.createRadialGradient(
        ball.x - 8, ball.y - 8, 0,     // Círculo interno (luz)
        ball.x, ball.y, ball.radius     // Círculo externo (sombra)
    );
    gradient.addColorStop(0, '#FFE5E5');  // Centro claro
    gradient.addColorStop(1, ball.color); // Borda escura

    // Desenha a bola
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Adiciona borda para melhor definição
    ctx.strokeStyle = '#FF4757';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

// === FUNÇÃO: DESENHAR FUNDO ===
// Cria um fundo com grid para melhor visualização do movimento
function drawBackground() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha grid de fundo
    ctx.strokeStyle = '#E8F4FD';
    ctx.lineWidth = 1;
    
    // Linhas verticais
    for (let x = 0; x <= canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Linhas horizontais
    for (let y = 0; y <= canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// === FUNÇÃO: VERIFICAR COLISÕES ===
// Detecta quando a bola atinge as bordas do canvas
function checkCollisions() {
    // Colisão com borda direita ou esquerda
    if (ball.x + ball.dx > canvas.width - ball.radius || 
        ball.x + ball.dx < ball.radius) {
        ball.dx = 0; // Para movimento horizontal
        ball.color = '#4ECDC4'; // Muda cor para indicar colisão
    }
    
    // Colisão com borda superior ou inferior
    if (ball.y + ball.dy > canvas.height - ball.radius || 
        ball.y + ball.dy < ball.radius) {
        ball.dy = 0; // Para movimento vertical
        ball.color = '#45B7D1'; // Muda cor para indicar colisão
    }
}

// === FUNÇÃO: ATUALIZAR SIMULAÇÃO ===
// Função principal que executa a cada frame da animação
function updateSimulation() {
    if (!isRunning) return; // Para se simulação estiver pausada

    drawBackground();      // Desenha o fundo
    drawBall();           // Desenha a bola
    checkCollisions();    // Verifica colisões
    
    // Atualiza posição da bola
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Agenda próximo frame
    animationId = requestAnimationFrame(updateSimulation);
}

// === FUNÇÕES DE CONTROLE ===

// Inicia a simulação
function startSimulation() {
    if (!isRunning) {
        isRunning = true;
        updateSimulation();
    }
}

// Pausa a simulação
function pauseSimulation() {
    isRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

// Reinicia a simulação com valores iniciais
function resetSimulation() {
    pauseSimulation();
    
    // Restaura propriedades iniciais
    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 3,
        dy: 2,
        radius: 25,
        color: '#FF6B6B'
    };
    
    // Redesenha estado inicial
    drawBackground();
    drawBall();
}

// === INICIALIZAÇÃO ===
// Configura estado inicial quando página carrega
window.addEventListener('load', function() {
    drawBackground();
    drawBall();
    
    // Instrução inicial
    ctx.fillStyle = '#2196F3';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('👆 Clique em "Iniciar" para começar a simulação!', 
                canvas.width/2, 50);
});

// === EVENTOS ESPECIAIS ===
// Adiciona interatividade com clique no canvas
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Reposiciona a bola no local do clique
    if (!isRunning) {
        ball.x = clickX;
        ball.y = clickY;
        drawBackground();
        drawBall();
    }
});