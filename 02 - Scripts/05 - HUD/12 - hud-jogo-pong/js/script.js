/*
========================================
🚀 CÓDIGO JAVASCRIPT - LÓGICA DO JOGO
========================================
Aqui está toda a programação que faz o jogo funcionar
*/

// ====================
// 📋 SELEÇÃO DE ELEMENTOS DO DOM
// ====================
// Pegamos os elementos HTML que vamos usar no JavaScript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');

// ====================
// ⚙️ CONFIGURAÇÕES INICIAIS DO JOGO
// ====================
// Variáveis que controlam o estado inicial do jogo
let player1Name = 'Player 1';        // Nome padrão do jogador 1
let player2Name = 'Player 2';        // Nome padrão do jogador 2
let player1Score = 0;                // Pontuação inicial do jogador 1
let player2Score = 0;                // Pontuação inicial do jogador 2

// Dimensões dos elementos do jogo
const paddleWidth = 10;              // Largura das raquetes
const paddleHeight = 100;            // Altura das raquetes
const ballSize = 10;                 // Tamanho da bola
const paddleSpeed = 6;               // Velocidade das raquetes

// ====================
// 🎮 OBJETOS DO JOGO
// ====================
// Definimos as posições e propriedades dos elementos do jogo

// Raquete do jogador 1 (lado esquerdo)
const player1 = { 
    x: 10,                                              // Posição horizontal
    y: canvas.height / 2 - paddleHeight / 2,          // Posição vertical (centralizada)
    dy: 0                                              // Velocidade vertical
};

// Raquete do jogador 2 (lado direito)
const player2 = { 
    x: canvas.width - 20,                             // Posição horizontal
    y: canvas.height / 2 - paddleHeight / 2,          // Posição vertical (centralizada)
    dy: 0                                             // Velocidade vertical
};

// Bola do jogo
const ball = { 
    x: canvas.width / 2,                              // Posição horizontal (centro)
    y: canvas.height / 2,                             // Posição vertical (centro)
    dx: 5,                                            // Velocidade horizontal
    dy: 4                                             // Velocidade vertical
};

// ====================
// ⌨️ CONTROLE DO TECLADO
// ====================
// Objeto para rastrear quais teclas estão sendo pressionadas
const keys = {};

// Detecta quando uma tecla é pressionada
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

// Detecta quando uma tecla é solta
document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// ====================
// 🎨 FUNÇÃO DE DESENHO
// ====================
// Esta função desenha todos os elementos visuais do jogo
function draw() {
    // Limpar o canvas (apagar tudo da tela)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Definir cor branca para desenhar
    ctx.fillStyle = '#fff';

    // Desenhar linha central pontilhada
    ctx.setLineDash([5, 15]);           // Padrão pontilhado
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.setLineDash([]);                // Voltar para linha sólida

    // Desenhar raquete do jogador 1 (esquerda)
    ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);

    // Desenhar raquete do jogador 2 (direita)
    ctx.fillRect(player2.x, player2.y, paddleWidth, paddleHeight);

    // Desenhar a bola
    ctx.fillRect(ball.x, ball.y, ballSize, ballSize);

    // Desenhar o placar (HUD) na tela
    ctx.font = '20px Arial';
    ctx.fillText(`${player1Name}: ${player1Score}`, 20, 30);
    ctx.fillText(`${player2Name}: ${player2Score}`, canvas.width - 200, 30);

    // Desenhar instruções de controle
    ctx.font = '12px Arial';
    ctx.fillStyle = '#888';
    ctx.fillText('W/S', player1.x, canvas.height - 10);
    ctx.fillText('↑/↓', player2.x - 10, canvas.height - 10);
}

// ====================
// 🏃‍♂️ FUNÇÃO DE MOVIMENTO DAS RAQUETES
// ====================
// Controla o movimento das raquetes baseado nas teclas pressionadas
function updatePaddles() {
    // Movimento do Player 1 (teclas W e S)
    if (keys['w'] && player1.y > 0) {
        player1.y -= paddleSpeed;    // Move para cima
    }
    if (keys['s'] && player1.y < canvas.height - paddleHeight) {
        player1.y += paddleSpeed;    // Move para baixo
    }

    // Movimento do Player 2 (setas do teclado)
    if (keys['arrowup'] && player2.y > 0) {
        player2.y -= paddleSpeed;    // Move para cima
    }
    if (keys['arrowdown'] && player2.y < canvas.height - paddleHeight) {
        player2.y += paddleSpeed;    // Move para baixo
    }
}

// ====================
// ⚾ FUNÇÃO DE ATUALIZAÇÃO DA BOLA
// ====================
// Controla movimento, colisões e pontuação
function update() {
    // Atualizar movimento das raquetes
    updatePaddles();

    // Mover a bola nas direções X e Y
    ball.x += ball.dx;
    ball.y += ball.dy;

    // ====================
    // 🏗️ DETECÇÃO DE COLISÕES
    // ====================

    // Colisão com paredes superior e inferior
    if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
        ball.dy *= -1;              // Inverte direção vertical
    }

    // Colisão com raquete do Player 1 (esquerda)
    if (ball.x <= player1.x + paddleWidth && 
        ball.y + ballSize >= player1.y && 
        ball.y <= player1.y + paddleHeight && 
        ball.dx < 0) {              // Só se a bola estiver indo para a esquerda
        ball.dx *= -1;              // Inverte direção horizontal
        
        // Adiciona efeito baseado em onde a bola bateu na raquete
        const hitPos = (ball.y - player1.y) / paddleHeight - 0.5;
        ball.dy += hitPos * 3;      // Modifica ângulo da bola
    }

    // Colisão com raquete do Player 2 (direita)
    if (ball.x + ballSize >= player2.x && 
        ball.y + ballSize >= player2.y && 
        ball.y <= player2.y + paddleHeight && 
        ball.dx > 0) {              // Só se a bola estiver indo para a direita
        ball.dx *= -1;              // Inverte direção horizontal
        
        // Adiciona efeito baseado em onde a bola bateu na raquete
        const hitPos = (ball.y - player2.y) / paddleHeight - 0.5;
        ball.dy += hitPos * 3;      // Modifica ângulo da bola
    }

    // ====================
    // 🏆 SISTEMA DE PONTUAÇÃO
    // ====================

    // Player 2 marca ponto (bola saiu pela esquerda)
    if (ball.x <= -ballSize) {
        player2Score++;
        resetBall();
    }

    // Player 1 marca ponto (bola saiu pela direita)
    if (ball.x >= canvas.width + ballSize) {
        player1Score++;
        resetBall();
    }
}

// ====================
// 🔄 FUNÇÃO DE REINICIALIZAÇÃO DA BOLA
// ====================
// Volta a bola para o centro e muda sua direção
function resetBall() {
    ball.x = canvas.width / 2;              // Centraliza horizontalmente
    ball.y = canvas.height / 2;             // Centraliza verticalmente
    
    // Determina direção aleatória para a bola
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;    // Esquerda ou direita
    ball.dy = (Math.random() - 0.5) * 6;             // Ângulo aleatório
}

// ====================
// 🎮 LOOP PRINCIPAL DO JOGO
// ====================
// Esta é a função mais importante - roda continuamente para criar a animação
function gameLoop() {
    update();                    // Atualiza posições e lógica
    draw();                      // Desenha tudo na tela
    requestAnimationFrame(gameLoop); // Agenda próximo frame (60 FPS)
}

// ====================
// 👥 SISTEMA DE NOMES DOS JOGADORES
// ====================
// Event listeners para atualizar nomes quando o usuário digita

// Atualiza nome do Player 1
player1NameInput.addEventListener('input', (evento) => {
    // Se o campo estiver vazio, usa nome padrão
    player1Name = evento.target.value || 'Player 1';
});

// Atualiza nome do Player 2
player2NameInput.addEventListener('input', (evento) => {
    // Se o campo estiver vazio, usa nome padrão
    player2Name = evento.target.value || 'Player 2';
});

// ====================
// 🚀 INICIALIZAÇÃO DO JOGO
// ====================
// Inicia o loop principal que faz o jogo rodar
console.log('🎮 Iniciando o Jogo de Pong...');
console.log('📖 Este é um projeto didático para aprender programação de jogos!');
gameLoop();

/*
========================================
📚 CONCEITOS APRENDIDOS NESTE CÓDIGO:
========================================

1. 🎨 Manipulação do Canvas HTML5
    - Como desenhar formas geométricas
    - Como limpar e redesenhar a tela

2. 🎮 Game Loop (Loop do Jogo)
    - requestAnimationFrame para animações suaves
    - Separação entre lógica (update) e visual (draw)

3. ⌨️ Detecção de Eventos de Teclado
    - keydown e keyup events
    - Rastreamento de múltiplas teclas simultâneas

4. 🏗️ Detecção de Colisões
    - Colisão retangular simples
    - Resposta física às colisões

5. 🎯 Programação Orientada a Objetos (básica)
    - Objetos para representar entidades do jogo
    - Propriedades e métodos organizados

6. 📊 Manipulação de Estado
    - Variáveis para controlar o estado do jogo
    - Atualização dinâmica da interface

========================================
🎓 EXERCÍCIOS PARA PRATICAR:
========================================

1. 🌈 Adicione cores diferentes para cada jogador
2. 🔊 Implemente sons quando a bola bate nas raquetes
3. 🏆 Crie um sistema de "primeiro a X pontos ganha"
4. ⚡ Adicione power-ups que aparecem aleatoriamente
5. 🤖 Implemente uma IA simples para jogar sozinho
6. 📱 Torne o jogo responsivo para diferentes tamanhos de tela

*/