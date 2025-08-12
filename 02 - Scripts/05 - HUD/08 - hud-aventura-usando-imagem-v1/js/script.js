/* 
========================================
SELEÇÃO DE ELEMENTOS DO DOM
========================================
Obtém referências dos elementos HTML que serão manipulados
*/
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // Contexto 2D para desenhar no canvas
const healthDisplay = document.getElementById('health'); // Elemento que mostra a vida
const coinsDisplay = document.getElementById('coins'); // Elemento que mostra as moedas
const timeDisplay = document.getElementById('time'); // Elemento que mostra o tempo

/* 
========================================
VARIÁVEIS GLOBAIS DO JOGO
========================================
Armazenam o estado atual do jogo
*/
let playerHealth = 3; // Vida inicial do jogador (máximo 3)
let playerCoins = 0; // Moedas iniciais do jogador
let gameTime = 0; // Tempo de jogo em segundos
let gameRunning = true; // Controla se o jogo está rodando

/* 
========================================
FUNÇÃO: DESENHAR O JOGO
========================================
Responsável por renderizar todos os elementos visuais no canvas
*/
function drawGame() {
    // Limpar todo o canvas (preparar para novo frame)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar fundo com gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#001122');
    gradient.addColorStop(1, '#003366');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar um personagem simples (quadrado azul)
    ctx.fillStyle = '#4CAF50'; // Cor verde
    ctx.fillRect(50, canvas.height - 80, 40, 40); // Posição x, y, largura, altura

    // Desenhar algumas moedas pelo cenário
    for (let i = 0; i < 5; i++) {
        const x = 200 + i * 120;
        const y = canvas.height - 100 + Math.sin(gameTime * 0.1 + i) * 10; // Movimento flutuante
        
        // Círculo dourado para representar moeda
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Símbolo $ na moeda
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('$', x, y + 4);
    }

    // Desenhar texto informativo
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Use os botões abaixo para testar o jogo!', 20, 30);
    
    // Mostrar status do jogo
    if (playerHealth <= 0) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        gameRunning = false;
    }
}

/* 
========================================
FUNÇÃO: ATUALIZAR HUD
========================================
Atualiza os elementos da interface com os valores atuais
*/
function updateHUD() {
    // Atualizar display de vida
    healthDisplay.textContent = playerHealth;
    
    // Mudar cor baseada na vida restante
    if (playerHealth <= 1) {
        healthDisplay.style.color = '#ff4444'; // Vermelho quando crítico
    } else if (playerHealth <= 2) {
        healthDisplay.style.color = '#ffaa00'; // Laranja quando baixo
    } else {
        healthDisplay.style.color = 'white'; // Branco quando normal
    }

    // Atualizar display de moedas
    coinsDisplay.textContent = playerCoins;

    // Atualizar display de tempo
    timeDisplay.textContent = gameTime;
}

/* 
========================================
FUNÇÃO: LOOP PRINCIPAL DO JOGO
========================================
Executa continuamente para manter o jogo funcionando
*/
function gameLoop() {
    if (gameRunning) {
        gameTime++; // Incrementar tempo a cada segundo
    }
    
    drawGame(); // Desenhar todos os elementos do jogo
    updateHUD(); // Atualizar interface do usuário

    // Agendar próxima execução do loop (60 FPS)
    requestAnimationFrame(gameLoop);
}

/* 
========================================
FUNÇÃO: PERDER VIDA
========================================
Reduz a vida do jogador quando chamada
*/
function loseHealth() {
    if (playerHealth > 0) {
        playerHealth--; // Diminuir vida
        console.log(`Vida perdida! Vida atual: ${playerHealth}`);
        
        // Efeito visual de dano (opcional)
        canvas.style.filter = 'brightness(50%) sepia(100%) hue-rotate(300deg)';
        setTimeout(() => {
            canvas.style.filter = 'none';
        }, 200);
    }
    
    updateHUD(); // Atualizar interface
}

/* 
========================================
FUNÇÃO: GANHAR MOEDAS
========================================
Adiciona moedas ao total do jogador
*/
function gainCoins(amount = 1) {
    playerCoins += amount; // Adicionar moedas
    console.log(`Moedas coletadas! Total: ${playerCoins}`);
    
    // Efeito visual de coleta (opcional)
    canvas.style.filter = 'brightness(120%) saturate(150%)';
    setTimeout(() => {
        canvas.style.filter = 'none';
    }, 300);
    
    updateHUD(); // Atualizar interface
}

/* 
========================================
FUNÇÃO: REINICIAR JOGO
========================================
Reseta todas as variáveis para o estado inicial
*/
function resetGame() {
    playerHealth = 3; // Restaurar vida completa
    playerCoins = 0; // Zerar moedas
    gameTime = 0; // Zerar tempo
    gameRunning = true; // Reativar jogo
    
    console.log('Jogo reiniciado!');
    updateHUD(); // Atualizar interface
}

/* 
========================================
CONTROLES DE TECLADO (OPCIONAL)
========================================
Permite interação via teclado
*/
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'h': // Tecla H para perder vida
        case 'H':
            loseHealth();
            break;
        case 'c': // Tecla C para ganhar moedas
        case 'C':
            gainCoins(5);
            break;
        case 'r': // Tecla R para reiniciar
        case 'R':
            resetGame();
            break;
    }
});

/* 
========================================
INICIALIZAÇÃO DO JOGO
========================================
Executa quando a página carrega
*/
console.log('Jogo de Aventura com HUD - Iniciando...');
console.log('Controles: H = perder vida, C = ganhar moedas, R = reiniciar');

updateHUD(); // Configurar interface inicial
gameLoop(); // Iniciar loop principal do jogo