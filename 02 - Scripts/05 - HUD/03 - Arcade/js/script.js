/* ============================================
    SEÇÃO 1: SELEÇÃO DE ELEMENTOS DO DOM
    ============================================
    Aqui pegamos referências dos elementos HTML que vamos manipular
*/

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');           // Contexto 2D para desenhar no canvas
const healthBar = document.getElementById('health-bar');     // Barra verde da vida
const scoreDisplay = document.getElementById('score');        // Número da pontuação
const timeDisplay = document.getElementById('time');          // Número do tempo

/* ============================================
    SEÇÃO 2: VARIÁVEIS GLOBAIS DO JOGO
    ============================================
    Estas variáveis armazenam o estado atual do jogo
*/

let playerHealth = 100;    // Vida do jogador (0-100%)
let playerScore = 0;       // Pontuação atual do jogador
let gameTime = 0;          // Tempo decorrido em segundos
let gameRunning = true;    // Flag para controlar se o jogo está rodando

/* ============================================
    SEÇÃO 3: FUNÇÕES DE DESENHO NO CANVAS
    ============================================
*/

/**
 * FUNÇÃO: drawGame()
 * PROPÓSITO: Desenha todos os elementos visuais do jogo no canvas
 * DESCRIÇÃO: Esta função é chamada a cada frame para atualizar a tela
 */
function drawGame() {
    // Passo 1: Limpar toda a tela (como apagar um quadro)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Passo 2: Definir estilo do texto
    ctx.fillStyle = 'white';        // Cor branca
    ctx.font = '20px Arial';        // Fonte e tamanho
    ctx.textAlign = 'center';       // Alinhamento central
    
    // Passo 3: Desenhar texto informativo no centro
    ctx.fillText('Área do Jogo - Canvas', canvas.width/2, canvas.height/2 - 20);
    ctx.fillText('Aqui você desenharia o jogador, inimigos, etc.', canvas.width/2, canvas.height/2 + 20);
    
    // Passo 4: Desenhar um retângulo como exemplo de elemento do jogo
    ctx.fillStyle = '#4CAF50';      // Cor verde
    ctx.fillRect(canvas.width/2 - 25, canvas.height/2 + 40, 50, 30);  // Retângulo simples
}

/* ============================================
    SEÇÃO 4: SISTEMA DE ATUALIZAÇÃO DA HUD
    ============================================
*/

/**
 * FUNÇÃO: updateHUD()
 * PROPÓSITO: Atualiza todos os elementos da interface do usuário
 * DESCRIÇÃO: Sincroniza os valores das variáveis com os elementos visuais
 */
function updateHUD() {
    // Atualizar barra de vida (largura proporcional à vida restante)
    healthBar.style.width = playerHealth + '%';
    
    // Mudar cor da barra baseada na vida restante
    if (playerHealth > 50) {
        healthBar.style.backgroundColor = '#00ff00';  // Verde: vida alta
    } else if (playerHealth > 20) {
        healthBar.style.backgroundColor = '#ffff00';  // Amarelo: vida média
    } else {
        healthBar.style.backgroundColor = '#ff0000';  // Vermelho: vida baixa
    }
    
    // Atualizar display da pontuação
    scoreDisplay.textContent = playerScore;
    
    // Atualizar display do tempo
    timeDisplay.textContent = gameTime;
    
    // Verificar game over
    if (playerHealth <= 0) {
        gameRunning = false;
        alert('Game Over! Sua pontuação final: ' + playerScore);
    }
}

/* ============================================
    SEÇÃO 5: LOOP PRINCIPAL DO JOGO
    ============================================
*/

/**
 * FUNÇÃO: gameLoop()
 * PROPÓSITO: Função principal que roda continuamente durante o jogo
 * DESCRIÇÃO: Incrementa tempo, desenha o jogo e atualiza a HUD
 */
function gameLoop() {
    if (gameRunning) {
        gameTime++;           // Incrementar contador de tempo
        drawGame();          // Redesenhar elementos do jogo
        updateHUD();         // Atualizar interface do usuário
        
        // Programar próxima execução em 1 segundo
        setTimeout(gameLoop, 1000);
    }
}

/* ============================================
    SEÇÃO 6: FUNÇÕES DE GAMEPLAY
    ============================================
*/

/**
 * FUNÇÃO: addPoints(points)
 * PROPÓSITO: Adicionar pontos à pontuação do jogador
 * PARÂMETROS: points - quantidade de pontos a adicionar
 */
function addPoints(points) {
    playerScore += points;    // Somar pontos ao total
    updateHUD();             // Atualizar display imediatamente
    console.log(`+${points} pontos! Total: ${playerScore}`);
}

/**
 * FUNÇÃO: loseHealth(damage)
 * PROPÓSITO: Reduzir a vida do jogador
 * PARÂMETROS: damage - quantidade de dano a aplicar
 */
function loseHealth(damage) {
    // Reduzir vida, mas nunca deixar ficar negativa
    playerHealth = Math.max(0, playerHealth - damage);
    updateHUD();             // Atualizar display imediatamente
    console.log(`-${damage} vida! Vida restante: ${playerHealth}%`);
}

/**
 * FUNÇÃO: resetGame()
 * PROPÓSITO: Reiniciar o jogo com valores iniciais
 */
function resetGame() {
    playerHealth = 100;      // Restaurar vida completa
    playerScore = 0;         // Zerar pontuação
    gameTime = 0;           // Zerar cronômetro
    gameRunning = true;     // Reativar o jogo
    updateHUD();            // Atualizar todos os displays
    console.log('Jogo reiniciado!');
}

/* ============================================
    SEÇÃO 7: INICIALIZAÇÃO DO JOGO
    ============================================
*/

/**
 * Iniciar o jogo quando a página carregar
 */
console.log('🎮 Jogo iniciado! Use os botões para testar o sistema.');
console.log('📚 Este é um exemplo didático de estrutura de jogo web.');

// Primeira atualização da HUD
updateHUD();

// Iniciar o loop principal do jogo
gameLoop();

/* ============================================
    SEÇÃO 8: FUNÇÕES ADICIONAIS (EXTRAS PARA APRENDIZADO)
    ============================================
*/

/**
 * Exemplo de como detectar teclas pressionadas
 * (útil para controles do jogador)
 */
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case ' ':  // Barra de espaço
            addPoints(5);
            break;
        case 'Enter':  // Enter
            loseHealth(10);
            break;
        case 'r':  // Tecla R
            resetGame();
            break;
    }
});

// Informar controles no console
console.log('⌨️ Controles do teclado:');
console.log('   Espaço: +5 pontos');
console.log('   Enter: -10 vida');
console.log('   R: resetar jogo');