// ========================================
// SEÇÃO 1: SELEÇÃO DE ELEMENTOS DOM
// ========================================

/* Aqui capturamos referências aos elementos HTML que vamos manipular */
const canvas = document.getElementById('gameCanvas');         // Canvas principal
const ctx = canvas.getContext('2d');                        // Contexto 2D para desenhar
const healthBar = document.getElementById('health-bar');     // Barra de vida
const healthText = document.getElementById('health-text');   // Texto da vida
const ammoCount = document.getElementById('ammo-count');     // Contador de munição
const minimapCanvas = document.getElementById('minimap');    // Canvas do mini-mapa
const minimapCtx = minimapCanvas.getContext('2d');          // Contexto do mini-mapa

// ========================================
// SEÇÃO 2: VARIÁVEIS DO ESTADO DO JOGO
// ========================================

/* Variáveis que controlam o estado atual do jogo */
let gameState = {
    player: {
        health: 100,        // Vida do jogador (0-100)
        maxHealth: 100,     // Vida máxima
        ammo: 10,          // Munição atual
        x: 400,            // Posição X no canvas
        y: 200,            // Posição Y no canvas
        size: 20           // Tamanho do jogador
    },
    enemies: [],           // Array para inimigos (futuro)
    bullets: [],           // Array para projéteis (futuro)
    gameRunning: true      // Estado do jogo
};

// ========================================
// SEÇÃO 3: FUNÇÕES DE DESENHO
// ========================================

/**
 * FUNÇÃO: drawGame()
 * PROPÓSITO: Desenha todos os elementos visuais no canvas principal
 * DESCRIÇÃO: Esta função é chamada a cada frame para atualizar a tela
 */
function drawGame() {
    // PASSO 1: Limpar o canvas (remover frame anterior)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // PASSO 2: Desenhar o fundo do jogo
    ctx.fillStyle = '#001122'; // Azul escuro
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // PASSO 3: Desenhar grade de referência (opcional - para debug)
    drawGrid();
    
    // PASSO 4: Desenhar o jogador
    drawPlayer();
    
    // PASSO 5: Desenhar outros elementos (inimigos, projéteis, etc.)
    // Aqui você adicionaria outras funções de desenho conforme o jogo cresce
}

/**
 * FUNÇÃO: drawGrid()
 * PROPÓSITO: Desenha uma grade de referência no canvas
 * DESCRIÇÃO: Útil para visualizar coordenadas durante desenvolvimento
 */
function drawGrid() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // Linhas verticais
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Linhas horizontais
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

/**
 * FUNÇÃO: drawPlayer()
 * PROPÓSITO: Desenha o jogador no canvas
 * DESCRIÇÃO: Representa o jogador como um quadrado azul
 */
function drawPlayer() {
    const player = gameState.player;
    
    // Configurar cor baseada na vida
    if (player.health > 60) {
        ctx.fillStyle = '#00AA00'; // Verde se vida > 60%
    } else if (player.health > 30) {
        ctx.fillStyle = '#FFAA00'; // Laranja se vida entre 30-60%
    } else {
        ctx.fillStyle = '#AA0000'; // Vermelho se vida < 30%
    }
    
    // Desenhar o jogador como um quadrado
    ctx.fillRect(
        player.x - player.size/2,  // X centralizado
        player.y - player.size/2,  // Y centralizado
        player.size,               // Largura
        player.size                // Altura
    );
    
    // Desenhar borda
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        player.x - player.size/2,
        player.y - player.size/2,
        player.size,
        player.size
    );
}

/**
 * FUNÇÃO: drawMinimap()
 * PROPÓSITO: Desenha o mini-mapa
 * DESCRIÇÃO: Versão em miniatura do jogo mostrando posição do jogador
 */
function drawMinimap() {
    // PASSO 1: Limpar mini-mapa
    minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    
    // PASSO 2: Desenhar fundo
    minimapCtx.fillStyle = '#001122';
    minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    
    // PASSO 3: Calcular posição do jogador no mini-mapa
    const scaleX = minimapCanvas.width / canvas.width;   // Escala X
    const scaleY = minimapCanvas.height / canvas.height; // Escala Y
    
    const playerMinimapX = gameState.player.x * scaleX;
    const playerMinimapY = gameState.player.y * scaleY;
    
    // PASSO 4: Desenhar jogador no mini-mapa
    minimapCtx.fillStyle = '#00FF00'; // Verde brilhante
    minimapCtx.fillRect(
        playerMinimapX - 2,
        playerMinimapY - 2,
        4, 4
    );
    
    // PASSO 5: Desenhar borda do mini-mapa
    minimapCtx.strokeStyle = '#FFFFFF';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(0, 0, minimapCanvas.width, minimapCanvas.height);
}

// ========================================
// SEÇÃO 4: FUNÇÕES DE ATUALIZAÇÃO DA HUD
// ========================================

/**
 * FUNÇÃO: updateHUD()
 * PROPÓSITO: Atualiza todos os elementos da interface do usuário
 * DESCRIÇÃO: Sincroniza os valores do jogo com os elementos visuais
 */
function updateHUD() {
    updateHealthBar();
    updateAmmoCount();
}

/**
 * FUNÇÃO: updateHealthBar()
 * PROPÓSITO: Atualiza a barra de vida visual
 * DESCRIÇÃO: Ajusta largura e cor da barra baseada na vida atual
 */
function updateHealthBar() {
    const player = gameState.player;
    const healthPercent = (player.health / player.maxHealth) * 100;
    
    // Atualizar largura da barra
    healthBar.style.width = healthPercent + '%';
    
    // Atualizar texto da vida
    healthText.textContent = player.health;
    
    // Mudar cor baseada na vida
    if (player.health > 60) {
        healthBar.style.backgroundColor = '#00AA00'; // Verde
    } else if (player.health > 30) {
        healthBar.style.backgroundColor = '#FFAA00'; // Laranja
    } else {
        healthBar.style.backgroundColor = '#AA0000'; // Vermelho
    }
}

/**
 * FUNÇÃO: updateAmmoCount()
 * PROPÓSITO: Atualiza o contador de munição
 * DESCRIÇÃO: Mostra a munição atual do jogador
 */
function updateAmmoCount() {
    ammoCount.textContent = gameState.player.ammo;
    
    // Destacar se munição baixa
    if (gameState.player.ammo <= 2) {
        ammoCount.style.color = '#FF0000'; // Vermelho
        ammoCount.style.fontWeight = 'bold';
    } else {
        ammoCount.style.color = '#FFFFFF'; // Branco
        ammoCount.style.fontWeight = 'normal';
    }
}

// ========================================
// SEÇÃO 5: FUNÇÕES DE GAMEPLAY
// ========================================

/**
 * FUNÇÃO: loseHealth()
 * PROPÓSITO: Reduz a vida do jogador
 * DESCRIÇÃO: Simula dano recebido pelo jogador
 */
function loseHealth() {
    const player = gameState.player;
    player.health = Math.max(0, player.health - 10); // Não vai abaixo de 0
    
    // Verificar se jogador morreu
    if (player.health <= 0) {
        console.log("💀 Jogador morreu!");
        // Aqui você adicionaria lógica de game over
    }
    
    updateHUD();
}

/**
 * FUNÇÃO: gainHealth()
 * PROPÓSITO: Restaura vida do jogador
 * DESCRIÇÃO: Simula coleta de item de cura
 */
function gainHealth() {
    const player = gameState.player;
    player.health = Math.min(player.maxHealth, player.health + 10); // Não passa do máximo
    updateHUD();
}

/**
 * FUNÇÃO: shootBullet()
 * PROPÓSITO: Simula disparo de projétil
 * DESCRIÇÃO: Consome munição e simula tiro
 */
function shootBullet() {
    const player = gameState.player;
    
    if (player.ammo > 0) {
        player.ammo--;
        console.log("💥 Pew! Tiro disparado!");
        // Aqui você adicionaria lógica de projétil
    } else {
        console.log("🚫 Sem munição!");
    }
    
    updateHUD();
}

/**
 * FUNÇÃO: collectAmmo()
 * PROPÓSITO: Adiciona munição ao jogador
 * DESCRIÇÃO: Simula coleta de munição
 */
function collectAmmo() {
    const player = gameState.player;
    player.ammo += 5;
    console.log("📦 Munição coletada! +" + 5);
    updateHUD();
}

/**
 * FUNÇÃO: movePlayer()
 * PROPÓSITO: Move o jogador para posição aleatória
 * DESCRIÇÃO: Demonstra atualização de posição
 */
function movePlayer() {
    const player = gameState.player;
    
    // Gerar nova posição aleatória (dentro dos limites)
    player.x = Math.random() * (canvas.width - player.size) + player.size/2;
    player.y = Math.random() * (canvas.height - player.size) + player.size/2;
    
    console.log(`🚶 Jogador movido para (${Math.floor(player.x)}, ${Math.floor(player.y)})`);
}

// ========================================
// SEÇÃO 6: LOOP PRINCIPAL DO JOGO
// ========================================

/**
 * FUNÇÃO: gameLoop()
 * PROPÓSITO: Loop principal que roda a cada frame
 * DESCRIÇÃO: Coordena todas as atualizações e desenhos do jogo
 * 
 * COMO FUNCIONA:
 * 1. Atualiza lógica do jogo
 * 2. Desenha elementos visuais
 * 3. Atualiza interface
 * 4. Agenda próxima execução
 */
function gameLoop() {
    // PASSO 1: Verificar se jogo está rodando
    if (!gameState.gameRunning) {
        return;
    }
    
    // PASSO 2: Atualizar lógica do jogo
    // (Aqui você adicionaria movimento, colisões, IA, etc.)
    
    // PASSO 3: Desenhar tudo
    drawGame();       // Desenhar canvas principal
    drawMinimap();    // Desenhar mini-mapa
    
    // PASSO 4: Atualizar interface
    updateHUD();      // Atualizar HUD
    
    // PASSO 5: Agendar próximo frame
    requestAnimationFrame(gameLoop);
}

// ========================================
// SEÇÃO 7: INICIALIZAÇÃO DO JOGO
// ========================================

/**
 * FUNÇÃO: initGame()
 * PROPÓSITO: Inicializa o jogo
 * DESCRIÇÃO: Configura estado inicial e começa o loop
 */
function initGame() {
    console.log("🎮 Iniciando jogo...");
    
    // Atualizar HUD inicial
    updateHUD();
    
    // Começar loop do jogo
    gameLoop();
    
    console.log("✅ Jogo iniciado com sucesso!");
}

// ========================================
// SEÇÃO 8: INICIALIZAÇÃO AUTOMÁTICA
// ========================================

// Iniciar o jogo quando a página carregar
window.addEventListener('load', initGame);

// Log para demonstrar que o script foi carregado
console.log("📜 Script carregado! Aguardando inicialização...");
