// ========== TUTORIAL: SISTEMA DE JOGO COM HUD ==========
// Este script demonstra como criar um sistema básico de jogo
// com interface gráfica (HUD) para exibir informações ao jogador

// ========== SEÇÃO 1: SELEÇÃO DE ELEMENTOS DO DOM ==========
// Primeiro, precisamos "capturar" os elementos HTML que vamos manipular
const canvas = document.getElementById('gameCanvas');     // Área de desenho do jogo
const ctx = canvas.getContext('2d');                     // Contexto 2D para desenhar
const healthDisplay = document.getElementById('health'); // Elemento que mostra a vida
const scoreDisplay = document.getElementById('score');   // Elemento que mostra pontuação
const timeDisplay = document.getElementById('time');     // Elemento que mostra tempo

// ========== SEÇÃO 2: VARIÁVEIS GLOBAIS DO JOGO ==========
// Estas variáveis controlam o estado atual do jogo
let playerHealth = 100;    // Vida do jogador (0 a 100)
let playerScore = 0;       // Pontuação do jogador
let gameTime = 0;          // Tempo decorrido em segundos
let gameRunning = true;    // Controla se o jogo está rodando

// ========== SEÇÃO 3: SISTEMA DE DESENHO NO CANVAS ==========
function drawGame() {
    // Passo 1: Limpar a tela anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Passo 2: Desenhar fundo com gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#001122');    // Azul escuro no topo
    gradient.addColorStop(1, '#000511');    // Quase preto embaixo
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Passo 3: Desenhar elementos decorativos
    drawStars();           // Estrelas no fundo
    drawPlayerShip();      // Nave do jogador
    drawGameInfo();        // Informações centrais

    // Passo 4: Verificar condições do jogo
    if (playerHealth <= 0) {
        drawGameOver();    // Tela de game over
        gameRunning = false;
    }
}

// ========== SEÇÃO 4: FUNÇÕES DE DESENHO ESPECÍFICAS ==========
function drawStars() {
    // Desenhar estrelas decorativas no fundo
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.fillRect(x, y, size, size);
    }
}

function drawPlayerShip() {
    // Desenhar uma nave simples no centro
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(centerX - 20, centerY - 10, 40, 20);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(centerX - 15, centerY - 5, 30, 10);
}

function drawGameInfo() {
    // Informações centrais na tela
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Use os botões abaixo para testar o sistema!', canvas.width / 2, 50);
}

function drawGameOver() {
    // Tela de fim de jogo
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '24px Arial';
    ctx.fillText('Pontuação Final: ' + playerScore, canvas.width / 2, canvas.height / 2 + 50);
}

// ========== SEÇÃO 5: SISTEMA DE ATUALIZAÇÃO DA HUD ==========
function updateHUD() {
    // Esta função atualiza os valores exibidos na interface
    
    // Atualizar vida (com cores diferentes baseadas na quantidade)
    healthDisplay.textContent = playerHealth;
    if (playerHealth > 70) {
        healthDisplay.style.color = '#2ecc71';  // Verde quando vida alta
    } else if (playerHealth > 30) {
        healthDisplay.style.color = '#f39c12';  // Amarelo quando vida média
    } else {
        healthDisplay.style.color = '#e74c3c';  // Vermelho quando vida baixa
    }

    // Atualizar pontuação
    scoreDisplay.textContent = playerScore.toLocaleString(); // Formato com vírgulas

    // Atualizar tempo
    timeDisplay.textContent = gameTime;

    // Fazer a HUD piscar quando vida crítica
    if (playerHealth <= 20) {
        document.querySelector('.hud').style.animation = 'blink 0.5s infinite';
    } else {
        document.querySelector('.hud').style.animation = 'none';
    }
}

// ========== SEÇÃO 6: LOOP PRINCIPAL DO JOGO ==========
function gameLoop() {
    // Este é o "coração" do jogo - executa continuamente
    
    if (gameRunning) {
        gameTime++;        // Incrementa tempo a cada segundo
        drawGame();        // Desenha tudo na tela
        updateHUD();       // Atualiza interface
        
        // Adicionar pontos automaticamente (simulação de gameplay)
        if (gameTime % 5 === 0) { // A cada 5 segundos
            addPoints(10);
        }
    }

    // Chamar novamente após 1 segundo (1000 milissegundos)
    setTimeout(gameLoop, 1000);
}

// ========== SEÇÃO 7: FUNÇÕES DE GAMEPLAY ==========

// Função para reduzir vida do jogador
function loseHealth(amount) {
    // Math.max garante que a vida nunca seja menor que 0
    playerHealth = Math.max(0, playerHealth - amount);
    updateHUD(); // Atualizar interface imediatamente
    
    // Efeito visual de dano
    document.body.style.backgroundColor = '#330000';
    setTimeout(() => {
        document.body.style.backgroundColor = '#000000';
    }, 200);
}

// Função para adicionar pontos
function addPoints(points) {
    playerScore += points;
    updateHUD(); // Atualizar interface imediatamente
    
    // Efeito visual de pontuação
    scoreDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
        scoreDisplay.style.transform = 'scale(1)';
    }, 200);
}

// Função para reiniciar o jogo
function resetGame() {
    playerHealth = 100;
    playerScore = 0;
    gameTime = 0;
    gameRunning = true;
    updateHUD();
}

// ========== SEÇÃO 8: INICIALIZAÇÃO DO JOGO ==========
// Adicionar estilo de animação para elementos críticos
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
    }
    .hud-value {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);

// Inicializar o jogo
console.log('🎮 Iniciando sistema de jogo...');
updateHUD();    // Primeira atualização da HUD
gameLoop();     // Começar o loop principal

// ========== SEÇÃO 9: EVENTOS ADICIONAIS ==========
// Detectar quando a janela perde foco (jogador saiu da aba)
window.addEventListener('blur', function() {
    console.log('⏸️ Jogo pausado - janela perdeu foco');
});

window.addEventListener('focus', function() {
    console.log('▶️ Jogo retomado - janela em foco');
});

// Log de inicialização para debug
console.log('✅ Sistema carregado com sucesso!');
console.log('📊 Estado inicial:');
console.log('   - Vida:', playerHealth);
console.log('   - Pontuação:', playerScore);
console.log('   - Tempo:', gameTime);