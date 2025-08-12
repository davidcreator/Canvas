/* ========================================
    CÓDIGO JAVASCRIPT - LÓGICA DO JOGO
======================================== */

// =====================================
// 1. SELEÇÃO DE ELEMENTOS DO DOM
// =====================================

// Obtém referências aos elementos HTML que iremos manipular
const canvas = document.getElementById('gameCanvas');        // Canvas para desenhar o jogo
const ctx = canvas.getContext('2d');                        // Contexto 2D do canvas
const speedDisplay = document.getElementById('speed');       // Display da velocidade
const timeDisplay = document.getElementById('time');         // Display do tempo
const lapsDisplay = document.getElementById('laps');         // Display das voltas
const positionDisplay = document.getElementById('position'); // Display da posição

// =====================================
// 2. VARIÁVEIS GLOBAIS DO JOGO
// =====================================

// Estados principais do jogo
let speed = 0;          // Velocidade atual do jogador (km/h)
let gameTime = 0;       // Tempo decorrido desde o início (segundos)
let laps = 1;           // Número da volta atual
let position = 1;       // Posição atual na corrida (1º, 2º, etc.)
let gameRunning = true; // Estado do jogo (rodando/pausado)

// Variáveis para o loop do jogo
let gameInterval;       // Referência do intervalo do jogo

// =====================================
// 3. FUNÇÕES DE DESENHO NO CANVAS
// =====================================

/**
 * Função para desenhar todos os elementos visuais do jogo
 * Esta função é chamada a cada frame para atualizar a tela
 */
function drawGame() {
    // Limpa todo o canvas para o próximo frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o fundo da pista
    drawTrack();
    
    // Desenha o carro do jogador
    drawPlayerCar();
    
    // Desenha elementos decorativos
    drawSpeedLines();
}

/**
 * Desenha a pista de corrida
 */
function drawTrack() {
    // Desenha as faixas da pista
    ctx.strokeStyle = '#FFFF00';  // Cor amarela para as linhas
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 20]);    // Linha tracejada
    
    // Linha central da pista
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    
    // Bordas da pista
    ctx.setLineDash([]);          // Linha sólida
    ctx.strokeStyle = '#FFFFFF';  // Cor branca
    ctx.lineWidth = 2;
    
    // Borda superior
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(canvas.width, 50);
    ctx.stroke();
    
    // Borda inferior
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 50);
    ctx.lineTo(canvas.width, canvas.height - 50);
    ctx.stroke();
}

/**
 * Desenha o carro do jogador
 */
function drawPlayerCar() {
    const carX = 100;                    // Posição X do carro
    const carY = canvas.height / 2 - 15; // Posição Y do carro (centralizado)
    
    // Corpo do carro (retângulo azul)
    ctx.fillStyle = '#007bff';
    ctx.fillRect(carX, carY, 60, 30);
    
    // Janelas do carro (retângulo mais claro)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(carX + 10, carY + 5, 40, 20);
    
    // Rodas do carro
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(carX + 15, carY + 35, 8, 0, Math.PI * 2);  // Roda traseira
    ctx.arc(carX + 45, carY + 35, 8, 0, Math.PI * 2);  // Roda dianteira
    ctx.fill();
}

/**
 * Desenha linhas de velocidade (efeito visual)
 */
function drawSpeedLines() {
    if (speed > 0) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;  // Transparência
        
        // Desenha várias linhas horizontais para simular movimento
        for (let i = 0; i < 10; i++) {
            const y = Math.random() * canvas.height;
            const length = (speed / 100) * 50;  // Comprimento baseado na velocidade
            
            ctx.beginPath();
            ctx.moveTo(200, y);
            ctx.lineTo(200 + length, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;  // Restaura a opacidade
    }
}

// =====================================
// 4. FUNÇÕES DE ATUALIZAÇÃO DO HUD
// =====================================

/**
 * Atualiza todos os elementos da interface do usuário (HUD)
 * Esta função sincroniza os valores das variáveis com o display
 */
function updateHUD() {
    // Atualiza a velocidade exibida
    speedDisplay.textContent = Math.round(speed);

    // Atualiza o tempo de jogo
    timeDisplay.textContent = gameTime;

    // Atualiza a contagem de voltas (formato: atual/total)
    lapsDisplay.textContent = `${laps}/3`;

    // Atualiza a posição do jogador
    positionDisplay.textContent = position;
}

// =====================================
// 5. LOOP PRINCIPAL DO JOGO
// =====================================

/**
 * Função principal que executa continuamente durante o jogo
 * Responsável por atualizar a lógica e redesenhar a tela
 */
function gameLoop() {
    if (gameRunning) {
        // Atualiza a lógica do jogo
        updateGameLogic();
        
        // Desenha todos os elementos visuais
        drawGame();
        
        // Atualiza a interface do usuário
        updateHUD();
    }
}

/**
 * Atualiza a lógica interna do jogo
 */
function updateGameLogic() {
    // Simula diminuição gradual da velocidade (atrito)
    if (speed > 0) {
        speed -= 0.5;  // Reduz velocidade gradualmente
        if (speed < 0) speed = 0;  // Não permite velocidade negativa
    }
}

/**
 * Atualiza o contador de tempo (chamado a cada segundo)
 */
function updateTimer() {
    if (gameRunning) {
        gameTime++;
        updateHUD();
    }
}

// =====================================
// 6. FUNÇÕES DE CONTROLE DO JOGO
// =====================================

/**
 * Aumenta a velocidade do jogador
 * @param {number} amount - Quantidade a ser adicionada à velocidade
 */
function increaseSpeed(amount) {
    speed += amount;
    
    // Limita a velocidade máxima
    const MAX_SPEED = 200;
    if (speed > MAX_SPEED) {
        speed = MAX_SPEED;
    }
    
    updateHUD();
    console.log(`Velocidade aumentada para: ${speed} km/h`);
}

/**
 * Diminui a velocidade do jogador
 * @param {number} amount - Quantidade a ser subtraída da velocidade
 */
function decreaseSpeed(amount) {
    speed -= amount;
    
    // Não permite velocidade negativa
    if (speed < 0) {
        speed = 0;
    }
    
    updateHUD();
    console.log(`Velocidade reduzida para: ${speed} km/h`);
}

/**
 * Simula a conclusão de uma volta
 */
function completeLap() {
    const MAX_LAPS = 3;
    
    if (laps < MAX_LAPS) {
        laps++;
        console.log(`Volta ${laps} completada!`);
        
        // Se completou todas as voltas
        if (laps === MAX_LAPS) {
            alert('Parabéns! Você completou a corrida! 🏆');
        }
    } else {
        alert('Corrida já finalizada!');
    }
    
    updateHUD();
}

/**
 * Muda a posição do jogador na corrida
 * @param {number} newPosition - Nova posição (1-5)
 */
function changePosition(newPosition) {
    // Valida se a posição está dentro dos limites
    if (newPosition >= 1 && newPosition <= 5) {
        position = newPosition;
        console.log(`Nova posição: ${position}º lugar`);
        
        // Feedback visual baseado na posição
        if (position === 1) {
            console.log('🥇 Você está em primeiro lugar!');
        } else if (position <= 3) {
            console.log('🏁 Boa posição! Continue assim!');
        } else {
            console.log('⚡ Acelere para melhorar sua posição!');
        }
    }
    
    updateHUD();
}

/**
 * Reinicia o jogo para os valores iniciais
 */
function resetGame() {
    // Reseta todas as variáveis para o estado inicial
    speed = 0;
    gameTime = 0;
    laps = 1;
    position = 1;
    gameRunning = true;
    
    console.log('🔄 Jogo reiniciado!');
    
    // Atualiza a interface
    updateHUD();
    drawGame();
}

// =====================================
// 7. INICIALIZAÇÃO DO JOGO
// =====================================

/**
 * Função de inicialização do jogo
 * É executada quando a página carrega
 */
function initGame() {
    console.log('🎮 Iniciando o jogo...');
    
    // Desenha o estado inicial
    drawGame();
    updateHUD();
    
    // Configura o loop principal do jogo (60 FPS)
    gameInterval = setInterval(gameLoop, 1000 / 60);
    
    // Configura o timer do jogo (atualiza a cada segundo)
    setInterval(updateTimer, 1000);
    
    console.log('✅ Jogo iniciado com sucesso!');
    console.log('💡 Use os botões abaixo para interagir com o jogo');
    console.log('🎯 Objetivo: Complete 3 voltas o mais rápido possível!');
}

// =====================================
// 8. INICIALIZAÇÃO AUTOMÁTICA
// =====================================

// Inicia o jogo automaticamente quando a página carregar
window.addEventListener('load', initGame);

// Limpa os intervalos quando a página for fechada (boa prática)
window.addEventListener('beforeunload', function() {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
});

/* ========================================
    NOTAS EDUCACIONAIS PARA OS ALUNOS:
    
    Este exemplo demonstra conceitos importantes:
    
    1. **Estrutura HTML**: Como organizar elementos
    2. **CSS**: Estilização e posicionamento
    3. **JavaScript**: Lógica, funções e interatividade
    4. **Canvas**: Desenho 2D em tempo real
    5. **Game Loop**: Ciclo principal de jogos
    6. **DOM Manipulation**: Atualização de elementos
    7. **Event Handling**: Resposta a ações do usuário
    8. **State Management**: Controle de estados do jogo
    
    Próximos passos para melhorar:
    - Adicionar controles de teclado
    - Implementar física mais realista
    - Adicionar sons e música
    - Criar oponentes controlados por IA
    - Implementar sistema de pontuação
======================================== */