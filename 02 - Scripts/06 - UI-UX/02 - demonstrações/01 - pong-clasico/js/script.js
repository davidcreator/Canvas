/**
 * =============================================================================
 * PONG GAME - VERSÃO EDUCACIONAL
 * =============================================================================
 * 
 * Este é um jogo clássico do Pong desenvolvido em JavaScript puro.
 * O objetivo é rebater a bola com as raquetes e marcar pontos.
 * 
 * Controles:
 * - Jogador 1: Setas para cima/baixo
 * - Jogador 2 (modo multiplayer): W/S
 * 
 * Funcionalidades:
 * - Três níveis de dificuldade
 * - Modo single player (vs IA) e multiplayer
 * - Power-ups que aceleram a bola
 * - Sistema de pausa e reinicialização
 * =============================================================================
 */

// =============================================================================
// 1. ELEMENTOS DOM E CONFIGURAÇÕES INICIAIS
// =============================================================================

// Obter referências dos elementos HTML
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// =============================================================================
// 2. VARIÁVEIS GLOBAIS DO JOGO
// =============================================================================

// Configurações das raquetes (paddles)
let paddleWidth = 10;      // Largura das raquetes
let paddleHeight = 100;    // Altura das raquetes

// Posições das raquetes (coordenada Y - vertical)
let playerY = (canvas.height - paddleHeight) / 2;    // Jogador 1 (esquerda)
let aiY = (canvas.height - paddleHeight) / 2;        // IA (direita)
let player2Y = (canvas.height - paddleHeight) / 2;   // Jogador 2 (direita)

// Configurações da bola
let ballX = canvas.width / 2;   // Posição X da bola (horizontal)
let ballY = canvas.height / 2;  // Posição Y da bola (vertical)
let ballSpeedX = 4;             // Velocidade horizontal da bola
let ballSpeedY = 4;             // Velocidade vertical da bola

// Sistema de pontuação
let playerScore = 0;  // Pontos do jogador 1
let aiScore = 0;      // Pontos do oponente (IA ou jogador 2)

// Configurações do jogo
let difficulty = 'medium';    // Dificuldade: 'easy', 'medium', 'hard'
let gameMode = 'single';      // Modo: 'single' (vs IA) ou 'multi' (vs jogador)
let gamePaused = false;       // Estado de pausa do jogo

// Sistema de power-ups
let powerUps = [];           // Array com todos os power-ups ativos
let powerUpActive = false;   // Controla se há power-up na tela

// =============================================================================
// 3. FUNÇÕES DE CONTROLE DO JOGO
// =============================================================================

/**
 * Inicia o jogo com a dificuldade e modo selecionados
 * @param {string} selectedDifficulty - 'easy', 'medium' ou 'hard'
 * @param {string} mode - 'single' ou 'multi'
 */
function startGame(selectedDifficulty, mode) {
    // Definir configurações escolhidas
    difficulty = selectedDifficulty;
    gameMode = mode;
    
    // Alterar interface: esconder menu e mostrar jogo
    document.querySelector('.menu').style.display = 'none';
    canvas.style.display = 'block';
    document.querySelector('.game-controls').style.display = 'flex';
    
    // Preparar o jogo
    resetBall();
    gameLoop();
}

/**
 * Reseta a posição e velocidade da bola para o centro
 */
function resetBall() {
    ballX = canvas.width / 2;    // Centro horizontal
    ballY = canvas.height / 2;   // Centro vertical
    ballSpeedX = 4;              // Velocidade inicial horizontal
    ballSpeedY = 4;              // Velocidade inicial vertical
}

/**
 * Reinicia o jogo completamente (zera placar e reposiciona bola)
 */
function resetGame() {
    playerScore = 0;  // Zerar pontuação do jogador
    aiScore = 0;      // Zerar pontuação do oponente
    resetBall();      // Reposicionar bola
}

/**
 * Alterna entre pausar e despausar o jogo
 */
function pauseGame() {
    gamePaused = !gamePaused;  // Inverter estado de pausa
    
    // Se despausou, continuar o loop do jogo
    if (!gamePaused) {
        gameLoop();
    }
}

// =============================================================================
// 4. LOOP PRINCIPAL DO JOGO
// =============================================================================

/**
 * Loop principal que executa continuamente durante o jogo
 * Esta função é chamada aproximadamente 60 vezes por segundo
 */
function gameLoop() {
    // Só executar se o jogo não estiver pausado
    if (!gamePaused) {
        moveBall();        // Atualizar posição da bola
        
        // Mover oponente baseado no modo de jogo
        if (gameMode === 'single') {
            moveAI();      // Mover IA
        } else {
            movePlayer2(); // Detectar input do jogador 2
        }
        
        drawEverything();  // Desenhar todos os elementos na tela
        
        // Agendar próxima execução do loop
        requestAnimationFrame(gameLoop);
    }
}

// =============================================================================
// 5. MOVIMENTO DA BOLA
// =============================================================================

/**
 * Controla o movimento da bola e suas colisões
 */
function moveBall() {
    // Atualizar posição baseada na velocidade
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Acelerar gradualmente a bola para aumentar dificuldade
    ballSpeedX *= 1.001;
    ballSpeedY *= 1.001;

    // Colisão com paredes superior e inferior
    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;  // Inverter direção vertical
    }

    // Colisão com raquete esquerda (jogador 1)
    if (ballX <= paddleWidth) {
        // Verificar se a bola está na altura da raquete
        if (ballY > playerY && ballY < playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;  // Rebater bola
        } else {
            // Bola passou da raquete - ponto para o oponente
            aiScore++;
            resetBall();
        }
    }

    // Colisão com raquete direita (IA ou jogador 2)
    if (ballX >= canvas.width - paddleWidth) {
        let rightPaddleY = gameMode === 'single' ? aiY : player2Y;
        
        // Verificar se a bola está na altura da raquete
        if (ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;  // Rebater bola
        } else {
            // Bola passou da raquete - ponto para o jogador 1
            playerScore++;
            resetBall();
        }
    }

    // Sistema de power-ups
    // 1% de chance por frame de criar um power-up
    if (Math.random() < 0.01 && !powerUpActive) {
        spawnPowerUp();
    }
    
    checkPowerUpCollision();
}

// =============================================================================
// 6. INTELIGÊNCIA ARTIFICIAL
// =============================================================================

/**
 * Controla o movimento da raquete da IA baseado na dificuldade
 */
function moveAI() {
    let aiSpeed;
    
    // Definir velocidade da IA baseada na dificuldade
    switch (difficulty) {
        case 'easy':
            aiSpeed = 2;
            break;
        case 'medium':
            aiSpeed = 4;
            break;
        case 'hard':
            aiSpeed = 6;
            break;
        default:
            aiSpeed = 4;
    }

    // Mover IA em direção à bola
    let aiCenter = aiY + paddleHeight / 2;
    
    if (aiCenter < ballY) {
        aiY += aiSpeed;  // Mover para baixo
    } else {
        aiY -= aiSpeed;  // Mover para cima
    }

    // Manter IA dentro dos limites da tela
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - paddleHeight) {
        aiY = canvas.height - paddleHeight;
    }
}

/**
 * Detecta input do segundo jogador (modo multiplayer)
 * Nota: Esta implementação tem limitações - veja comentário abaixo
 */
function movePlayer2() {
    // ATENÇÃO: Esta implementação adiciona múltiplos listeners
    // Em um código profissional, o listener deveria ser adicionado uma única vez
    document.addEventListener('keydown', function(event) {
        if (event.key === 'w' || event.key === 'W') {
            player2Y -= 20;
        } else if (event.key === 's' || event.key === 'S') {
            player2Y += 20;
        }
        
        // Manter jogador 2 dentro dos limites da tela
        if (player2Y < 0) player2Y = 0;
        if (player2Y > canvas.height - paddleHeight) {
            player2Y = canvas.height - paddleHeight;
        }
    });
}

// =============================================================================
// 7. SISTEMA DE RENDERIZAÇÃO
// =============================================================================

/**
 * Desenha todos os elementos do jogo na tela
 */
function drawEverything() {
    // Limpar tela inteira
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configurar cor padrão (branco)
    ctx.fillStyle = 'white';

    // Desenhar raquete do jogador 1 (esquerda)
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);

    // Desenhar raquete do oponente (direita)
    let rightPaddleY = gameMode === 'single' ? aiY : player2Y;
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Desenhar a bola (círculo)
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2, true);
    ctx.fill();

    // Desenhar linha central pontilhada
    drawCenterLine();

    // Desenhar placar
    ctx.font = '32px Arial';
    ctx.fillText(playerScore, 100, 50);                    // Placar jogador 1
    ctx.fillText(aiScore, canvas.width - 100, 50);         // Placar oponente

    // Desenhar power-ups
    powerUps.forEach(powerUp => {
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.size, powerUp.size);
    });
}

/**
 * Desenha a linha pontilhada no centro da tela
 */
function drawCenterLine() {
    ctx.setLineDash([10, 10]);  // Padrão pontilhado
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);  // Voltar ao padrão sólido
}

// =============================================================================
// 8. SISTEMA DE POWER-UPS
// =============================================================================

/**
 * Cria um novo power-up em posição aleatória
 */
function spawnPowerUp() {
    const powerUp = {
        x: Math.random() * (canvas.width - 20),   // Posição X aleatória
        y: Math.random() * (canvas.height - 20),  // Posição Y aleatória
        size: 20,                                 // Tamanho do power-up
        color: 'yellow'                           // Cor do power-up
    };
    
    powerUps.push(powerUp);    // Adicionar ao array
    powerUpActive = true;      // Marcar como ativo
}

/**
 * Verifica se a bola colidiu com algum power-up
 */
function checkPowerUpCollision() {
    powerUps.forEach((powerUp, index) => {
        // Verificar colisão usando AABB (Axis-Aligned Bounding Box)
        let ballRadius = 10;
        
        if (ballX + ballRadius > powerUp.x && 
            ballX - ballRadius < powerUp.x + powerUp.size && 
            ballY + ballRadius > powerUp.y && 
            ballY - ballRadius < powerUp.y + powerUp.size) {
            
            // Aplicar efeito do power-up (acelerar bola)
            ballSpeedX *= 1.5;
            ballSpeedY *= 1.5;
            
            // Remover power-up coletado
            powerUps.splice(index, 1);
            powerUpActive = false;
        }
    });
}

// =============================================================================
// 9. CONTROLES DO JOGADOR
// =============================================================================

/**
 * Sistema de controle das raquetes
 */
document.addEventListener('keydown', function(event) {
    const moveSpeed = 20;  // Velocidade de movimento das raquetes
    
    // Controles do jogador 1 (setas)
    if (event.key === 'ArrowUp') {
        playerY -= moveSpeed;
    } else if (event.key === 'ArrowDown') {
        playerY += moveSpeed;
    }
    
    // Manter jogador 1 dentro dos limites da tela
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - paddleHeight) {
        playerY = canvas.height - paddleHeight;
    }
    
    // Controles adicionais para pausa (barra de espaço)
    if (event.key === ' ') {
        event.preventDefault();  // Prevenir scroll da página
        pauseGame();
    }
});

// =============================================================================
// 10. INICIALIZAÇÃO
// =============================================================================

/**
 * Código que executa quando a página carrega
 */
document.addEventListener('DOMContentLoaded', function() {
    // Esconder elementos do jogo inicialmente
    canvas.style.display = 'none';
    document.querySelector('.game-controls').style.display = 'none';
    
    console.log('Pong Game carregado! Selecione um modo para começar.');
});

// =============================================================================
// FIM DO CÓDIGO
// =============================================================================

/**
 * EXERCÍCIOS PARA OS ALUNOS:
 * 
 * 1. Fácil: Altere as cores das raquetes e da bola
 * 2. Fácil: Modifique o tamanho das raquetes
 * 3. Médio: Adicione sons para colisões e pontuação
 * 4. Médio: Crie diferentes tipos de power-ups (slow down, bigger paddle, etc.)
 * 5. Difícil: Implemente um menu de fim de jogo quando alguém chega a 10 pontos
 * 6. Difícil: Adicione partículas quando a bola colide com as raquetes
 * 7. Avançado: Crie uma IA mais inteligente que erre propositalmente às vezes
 * 8. Avançado: Implemente física mais realista (ângulo de rebote baseado na posição da colisão)
 */