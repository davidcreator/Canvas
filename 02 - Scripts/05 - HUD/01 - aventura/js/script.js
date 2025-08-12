/* ================================================
    JAVASCRIPT - LÓGICA DO JOGO
    ================================================ */

// =====================================
// 1. SELEÇÃO DOS ELEMENTOS DO DOM
// =====================================

// Elementos principais do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Elementos da interface (HUD)
const playerNameInput = document.getElementById('player-name');
const lifeBar = document.getElementById('life-bar');
const coinCount = document.getElementById('coin-count');
const timeCount = document.getElementById('time-count');

// =====================================
// 2. VARIÁVEIS DE ESTADO DO JOGO
// =====================================

let playerName = 'Aventureiro';     // Nome do jogador
let playerLife = 100;               // Vida do jogador (0-100)
let coins = 0;                      // Número de moedas coletadas
let gameTime = 0;                   // Tempo de jogo em segundos
let gameRunning = true;             // Estado do jogo

// Variáveis para efeitos visuais
let coinEffects = [];               // Array para armazenar efeitos de moeda
let lastTime = 0;                   // Para controlar o tempo

// =====================================
// 3. CLASSES E OBJETOS DO JOGO
// =====================================

// Classe para efeitos visuais das moedas
class CoinEffect {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 30;             // Duração do efeito
        this.size = 20;
    }

    // Método para desenhar o efeito
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / 30;
        ctx.fillStyle = '#ffdf00';
        ctx.font = `${this.size}px Arial`;
        ctx.fillText('+1', this.x, this.y);
        ctx.restore();
    }

    // Método para atualizar o efeito
    update() {
        this.y -= 2;                // Movimento para cima
        this.life--;                // Reduz a vida do efeito
        this.size += 0.5;           // Aumenta o tamanho
        return this.life > 0;       // Retorna se ainda está vivo
    }
}

// =====================================
// 4. FUNÇÕES DE DESENHO
// =====================================

/**
 * Função principal para desenhar todos os elementos do jogo
 */
function draw() {
    // Limpar o canvas completamente
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar fundo do jogo
    drawBackground();
    
    // Desenhar elementos do jogo
    drawPlayer();
    drawCoins();
    
    // Desenhar efeitos visuais
    drawEffects();
    
    // Desenhar informações na tela
    drawGameInfo();
}

/**
 * Desenha o fundo do jogo com gradiente
 */
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#001122');
    gradient.addColorStop(1, '#003366');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Desenha o personagem do jogador
 */
function drawPlayer() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Corpo do jogador (círculo azul)
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Rosto do jogador
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('😊', centerX, centerY + 5);

    // Nome do jogador abaixo
    ctx.fillStyle = 'yellow';
    ctx.font = '14px Arial';
    ctx.fillText(playerName, centerX, centerY + 50);
}

/**
 * Desenha moedas espalhadas pelo cenário
 */
function drawCoins() {
    ctx.fillStyle = '#FFD700';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';

    // Desenhar algumas moedas fixas como exemplo
    const coinPositions = [
        {x: 100, y: 100}, {x: 700, y: 100},
        {x: 100, y: 300}, {x: 700, y: 300},
        {x: 400, y: 80}, {x: 200, y: 200}
    ];

    coinPositions.forEach(pos => {
        ctx.fillText('🪙', pos.x, pos.y);
    });
}

/**
 * Desenha todos os efeitos visuais ativos
 */
function drawEffects() {
    // Atualizar e desenhar efeitos de moeda
    coinEffects = coinEffects.filter(effect => {
        effect.draw();
        return effect.update();
    });
}

/**
 * Desenha informações adicionais na tela
 */
function drawGameInfo() {
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    // Status do jogo
    const status = gameRunning ? 'Jogando' : 'Game Over';
    ctx.fillText(`Status: ${status}`, 10, canvas.height - 20);
}

// =====================================
// 5. FUNÇÕES DE ATUALIZAÇÃO DO HUD
// =====================================

/**
 * Atualiza todos os elementos da interface do usuário
 */
function updateHUD() {
    updateLifeBar();
    updateCoinDisplay();
    updateTimeDisplay();
}

/**
 * Atualiza a barra de vida com base na vida atual
 */
function updateLifeBar() {
    // Garantir que a vida está entre 0 e 100
    playerLife = Math.max(0, Math.min(100, playerLife));
    
    // Atualizar largura da barra
    lifeBar.style.width = playerLife + '%';
    
    // Mudar cor baseada na vida restante
    if (playerLife > 60) {
        lifeBar.style.background = 'linear-gradient(90deg, #00ff00, #88ff88)';
    } else if (playerLife > 30) {
        lifeBar.style.background = 'linear-gradient(90deg, #ffff00, #ffaa00)';
    } else {
        lifeBar.style.background = 'linear-gradient(90deg, #ff0000, #ff6666)';
    }
}

/**
 * Atualiza a exibição de moedas
 */
function updateCoinDisplay() {
    coinCount.textContent = coins;
    
    // Efeito de destaque quando coletou moeda
    if (coins > 0 && coins % 5 === 0) {
        coinCount.style.color = '#00ff00';
        setTimeout(() => {
            coinCount.style.color = '#ffff00';
        }, 200);
    }
}

/**
 * Atualiza a exibição do tempo
 */
function updateTimeDisplay() {
    timeCount.textContent = Math.floor(gameTime);
}

// =====================================
// 6. FUNÇÕES DE GAMEPLAY
// =====================================

/**
 * Simula a coleta de uma moeda
 * @param {number} x - Posição X onde a moeda foi coletada
 * @param {number} y - Posição Y onde a moeda foi coletada
 */
function collectCoin(x, y) {
    coins++;
    playerLife = Math.min(100, playerLife + 2); // Restaura 2 pontos de vida
    
    // Criar efeito visual
    coinEffects.push(new CoinEffect(x, y));
    
    // Atualizar interface
    updateHUD();
    
    // Som simulado (você pode adicionar áudio real)
    console.log('🪙 Moeda coletada! Total:', coins);
}

/**
 * Reduz a vida do jogador com o tempo
 */
function decreaseLifeOverTime() {
    if (gameRunning && playerLife > 0) {
        playerLife -= 0.5; // Perde 0.5 de vida por segundo
        
        if (playerLife <= 0) {
            gameOver();
        }
    }
}

/**
 * Função executada quando o jogo acaba
 */
function gameOver() {
    gameRunning = false;
    alert(`Game Over, ${playerName}!\n\nEstatísticas finais:\n🪙 Moedas coletadas: ${coins}\n⏱️ Tempo jogado: ${Math.floor(gameTime)}s`);
    
    // Reiniciar jogo
    setTimeout(() => {
        resetGame();
    }, 2000);
}

/**
 * Reinicia o jogo com valores iniciais
 */
function resetGame() {
    playerLife = 100;
    coins = 0;
    gameTime = 0;
    gameRunning = true;
    coinEffects = [];
    updateHUD();
    console.log('🔄 Jogo reiniciado!');
}

// =====================================
// 7. LOOP PRINCIPAL DO JOGO
// =====================================

/**
 * Loop principal que executa continuamente
 * @param {number} currentTime - Tempo atual em milissegundos
 */
function gameLoop(currentTime) {
    // Calcular delta time (tempo decorrido)
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Atualizar tempo de jogo (converter para segundos)
    gameTime += deltaTime / 1000;

    // Reduzir vida a cada segundo
    if (Math.floor(gameTime) !== Math.floor(gameTime - deltaTime / 1000)) {
        decreaseLifeOverTime();
    }

    // Atualizar interface
    updateHUD();
    
    // Desenhar tudo na tela
    draw();

    // Continuar o loop se o jogo estiver rodando
    if (gameRunning || playerLife > 0) {
        requestAnimationFrame(gameLoop);
    }
}

// =====================================
// 8. EVENT LISTENERS (EVENTOS)
// =====================================

/**
 * Event listener para mudanças no nome do jogador
 */
playerNameInput.addEventListener('input', function(evento) {
    const novoNome = evento.target.value.trim();
    playerName = novoNome || 'Aventureiro';
    console.log('👤 Nome do jogador alterado para:', playerName);
});

/**
 * Event listener para cliques no canvas
 */
canvas.addEventListener('click', function(evento) {
    // Obter posição do clique relativa ao canvas
    const rect = canvas.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;
    
    console.log('🖱️ Clique detectado em:', x, y);
    
    // Simular coleta de moeda no local do clique
    collectCoin(x, y);
});

/**
 * Event listener para teclas do teclado
 */
document.addEventListener('keydown', function(evento) {
    switch(evento.key) {
        case 'r':
        case 'R':
            resetGame();
            console.log('🔄 Jogo reiniciado via teclado');
            break;
        case ' ':
            evento.preventDefault();
            // Barra de espaço para coletar moeda no centro
            collectCoin(canvas.width / 2, canvas.height / 2);
            break;
    }
});

// =====================================
// 9. INICIALIZAÇÃO DO JOGO
// =====================================

/**
 * Função para inicializar o jogo
 */
function initializeGame() {
    console.log('🎮 Iniciando jogo...');
    
    // Configurações iniciais
    updateHUD();
    
    // Dar foco ao campo de nome
    playerNameInput.focus();
    
    // Iniciar o loop principal
    requestAnimationFrame(gameLoop);
    
    console.log('✅ Jogo inicializado com sucesso!');
}

// Inicializar quando a página carregar completamente
window.addEventListener('load', initializeGame);

// =====================================
// 10. FUNÇÕES DE DEBUG (DESENVOLVIMENTO)
// =====================================

/**
 * Função para adicionar moedas (debug)
 */
function debugAddCoins(quantidade = 10) {
    coins += quantidade;
    updateHUD();
    console.log(`🔧 DEBUG: Adicionadas ${quantidade} moedas`);
}

/**
 * Função para alterar vida (debug)
 */
function debugSetLife(novaVida) {
    playerLife = Math.max(0, Math.min(100, novaVida));
    updateHUD();
    console.log(`🔧 DEBUG: Vida alterada para ${playerLife}`);
}

// Disponibilizar funções de debug no console
window.debugAddCoins = debugAddCoins;
window.debugSetLife = debugSetLife;

/* ================================================
    FIM DO SCRIPT - JOGO PRONTO PARA USO!
    ================================================
    
    COMO USAR:
    1. Abra este arquivo em um navegador
    2. Digite seu nome no campo
    3. Clique no canvas para coletar moedas
    4. Use 'R' para reiniciar o jogo
    5. Use 'Espaço' para coletar moeda no centro
    
    PARA APRENDER:
    - Estude cada seção numerada
    - Experimente modificar valores
    - Use o console do navegador (F12)
    - Teste as funções de debug
    
    ================================================ */
