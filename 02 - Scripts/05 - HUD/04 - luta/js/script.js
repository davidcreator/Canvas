// ====================================
// 1. SELEÇÃO DOS ELEMENTOS DO DOM
// ====================================

// Elementos do canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Elementos da HUD (Interface do usuário)
const player1HealthBar = document.getElementById('player1-health-bar');
const player2HealthBar = document.getElementById('player2-health-bar');
const timeDisplay = document.getElementById('time');

// ====================================
// 2. VARIÁVEIS DE ESTADO DO JOGO
// ====================================

// Vida dos jogadores (0 a 100)
let player1Health = 100;
let player2Health = 100;

// Tempo de jogo em segundos
let gameTime = 99;

// Controle do loop do jogo
let gameRunning = true;

// ====================================
// 3. FUNÇÕES DE DESENHO NO CANVAS
// ====================================

/**
 * Desenha os elementos visuais do jogo no canvas
 * Esta função é chamada a cada frame do jogo
 */
function drawGame() {
    // Limpar o canvas completamente
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar o fundo do jogo
    drawBackground();
    
    // Desenhar os personagens (simulação)
    drawPlayers();
    
    // Aqui você pode adicionar mais elementos:
    // - Cenários
    // - Efeitos especiais  
    // - Projéteis
    // - Animações
}

/**
 * Desenha o fundo do jogo
 */
function drawBackground() {
    // Gradiente para simular um cenário
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Linha do chão
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 50);
    ctx.lineTo(canvas.width, canvas.height - 50);
    ctx.stroke();
}

/**
 * Desenha os jogadores como retângulos simples
 * Em um jogo real, aqui estariam sprites ou modelos 3D
 */
function drawPlayers() {
    // Player 1 (esquerda) - Azul
    ctx.fillStyle = player1Health > 0 ? '#0066ff' : '#333';
    ctx.fillRect(100, canvas.height - 120, 50, 70);
    
    // Player 2 (direita) - Vermelho  
    ctx.fillStyle = player2Health > 0 ? '#ff0066' : '#333';
    ctx.fillRect(650, canvas.height - 120, 50, 70);
    
    // Labels dos jogadores
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('P1', 125, canvas.height - 130);
    ctx.fillText('P2', 675, canvas.height - 130);
}

// ====================================
// 4. FUNÇÕES DE ATUALIZAÇÃO DA HUD
// ====================================

/**
 * Atualiza todos os elementos da interface do usuário
 */
function updateHUD() {
    updateHealthBars();
    updateTimer();
}

/**
 * Atualiza as barras de vida dos jogadores
 * A largura da barra representa a porcentagem de vida restante
 */
function updateHealthBars() {
    // Atualizar Player 1
    player1HealthBar.style.width = player1Health + '%';
    
    // Mudar cor conforme a vida diminui
    if (player1Health > 50) {
        player1HealthBar.style.backgroundColor = '#00FF00'; // Verde
    } else if (player1Health > 25) {
        player1HealthBar.style.backgroundColor = '#FFAA00'; // Laranja
    } else {
        player1HealthBar.style.backgroundColor = '#FF0000'; // Vermelho
    }
    
    // Atualizar Player 2
    player2HealthBar.style.width = player2Health + '%';
    
    // Mudar cor conforme a vida diminui
    if (player2Health > 50) {
        player2HealthBar.style.backgroundColor = '#00FF00'; // Verde
    } else if (player2Health > 25) {
        player2HealthBar.style.backgroundColor = '#FFAA00'; // Laranja
    } else {
        player2HealthBar.style.backgroundColor = '#FF0000'; // Vermelho
    }
}

/**
 * Atualiza o display do tempo de jogo
 */
function updateTimer() {
    timeDisplay.textContent = gameTime;
    
    // Mudar cor quando o tempo está acabando
    if (gameTime <= 10) {
        timeDisplay.style.color = '#FF0000'; // Vermelho
    } else if (gameTime <= 30) {
        timeDisplay.style.color = '#FFAA00'; // Laranja
    } else {
        timeDisplay.style.color = '#FFD700'; // Dourado
    }
}

// ====================================
// 5. LÓGICA PRINCIPAL DO JOGO
// ====================================

/**
 * Loop principal do jogo
 * Esta função roda continuamente enquanto o jogo está ativo
 */
function gameLoop() {
    // Verificar se o jogo ainda está rodando
    if (!gameRunning) return;
    
    // Atualizar elementos visuais
    drawGame();
    
    // Atualizar interface
    updateHUD();
    
    // Verificar condições de fim de jogo
    checkGameEnd();
    
    // Chamar o próximo frame
    requestAnimationFrame(gameLoop);
}

/**
 * Contador de tempo que roda separadamente
 */
function timeCounter() {
    if (gameRunning && gameTime > 0) {
        gameTime--;
    }
    
    // Continuar contando se o jogo está ativo
    if (gameRunning) {
        setTimeout(timeCounter, 1000); // 1 segundo
    }
}

// ====================================
// 6. FUNÇÕES DE CONTROLE DO JOGO
// ====================================

/**
 * Função para simular dano aos jogadores
 * @param {number} player - 1 ou 2 (qual jogador)
 * @param {number} damage - quantidade de dano (0-100)
 */
function loseHealth(player, damage) {
    if (player === 1) {
        // Não deixar a vida ir abaixo de 0
        player1Health = Math.max(0, player1Health - damage);
        console.log(`Player 1 perdeu ${damage} de vida. Vida atual: ${player1Health}`);
    } else if (player === 2) {
        // Não deixar a vida ir abaixo de 0
        player2Health = Math.max(0, player2Health - damage);
        console.log(`Player 2 perdeu ${damage} de vida. Vida atual: ${player2Health}`);
    }
    
    // Atualizar imediatamente a interface
    updateHUD();
}

/**
 * Verifica se o jogo deve terminar
 */
function checkGameEnd() {
    // Verificar se algum jogador morreu
    if (player1Health <= 0) {
        endGame('Player 2 Venceu!');
    } else if (player2Health <= 0) {
        endGame('Player 1 Venceu!');
    } else if (gameTime <= 0) {
        // Tempo acabou - decidir vencedor pela vida
        if (player1Health > player2Health) {
            endGame('Player 1 Venceu por pontos!');
        } else if (player2Health > player1Health) {
            endGame('Player 2 Venceu por pontos!');
        } else {
            endGame('Empate!');
        }
    }
}

/**
 * Termina o jogo e mostra o resultado
 * @param {string} message - mensagem do resultado
 */
function endGame(message) {
    gameRunning = false;
    
    // Mostrar mensagem na tela
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    
    console.log('Jogo terminado:', message);
}

/**
 * Reinicia o jogo com valores iniciais
 */
function resetGame() {
    // Resetar variáveis
    player1Health = 100;
    player2Health = 100;
    gameTime = 99;
    gameRunning = true;
    
    // Atualizar interface
    updateHUD();
    
    // Reiniciar loops
    gameLoop();
    timeCounter();
    
    console.log('Jogo reiniciado!');
}

// ====================================
// 7. INICIALIZAÇÃO DO JOGO
// ====================================

/**
 * Função que roda quando a página carrega
 */
function initGame() {
    console.log('Iniciando jogo de luta...');
    
    // Configurar canvas
    canvas.focus();
    
    // Iniciar loops do jogo
    gameLoop();
    timeCounter();
    
    // Mostrar mensagem inicial
    console.log('Jogo iniciado! Use os botões para testar.');
}

// Iniciar o jogo quando a página carregar
window.addEventListener('load', initGame);

// ====================================
// 8. EVENTOS E CONTROLES FUTUROS
// ====================================

// Aqui você pode adicionar:
// - Controles de teclado
// - Detecção de colisão
// - Sistema de combos
// - Efeitos sonoros
// - Múltiplas fases

// Exemplo de controles de teclado (comentado):
/*
document.addEventListener('keydown', function(event) {
    switch(event.code) {
        case 'KeyA': // A - Player 1 ataque
            loseHealth(2, 5);
            break;
        case 'KeyL': // L - Player 2 ataque  
            loseHealth(1, 5);
            break;
    }
});
*/