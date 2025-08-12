/* ========================================
    TUTORIAL: SISTEMA DE JOGO EDUCATIVO
    
    Este script demonstra os conceitos fundamentais
    de desenvolvimento de jogos em JavaScript:
    
    1. Manipulação do DOM
    2. Sistema de HUD (Interface)
    3. Loop de jogo
    4. Gerenciamento de estado
    5. Animações e efeitos visuais
======================================== */

// ========================================
// ETAPA 1: SELEÇÃO DOS ELEMENTOS DO DOM
// ========================================

// Elemento canvas onde desenharemos o jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Elementos da interface (HUD)
const healthDisplay = document.getElementById('health');
const energyDisplay = document.getElementById('energy');
const weaponDisplay = document.getElementById('weapon');
const healthBar = document.getElementById('healthBar');
const energyBar = document.getElementById('energyBar');

// ========================================
// ETAPA 2: VARIÁVEIS DE ESTADO DO JOGO
// ========================================

// Estado do jogador
let gameState = {
    player: {
        health: 100,        // Vida atual (0-100)
        maxHealth: 100,     // Vida máxima
        energy: 50,         // Energia atual (0-100)
        maxEnergy: 100,     // Energia máxima
        weapon: 'Blaster',  // Arma equipada
        x: 100,             // Posição X no canvas
        y: 200,             // Posição Y no canvas
        size: 30            // Tamanho do jogador
    },
    
    // Configurações visuais
    colors: {
        player: '#00ff41',
        background: '#001122',
        ui: '#00ccff'
    }
};

// ========================================
// ETAPA 3: FUNÇÕES DE DESENHO NO CANVAS
// ========================================

/**
 * Função principal de desenho do jogo
 * Responsável por limpar o canvas e desenhar todos os elementos
 */
function drawGame() {
    // Limpar todo o canvas (preparar para novo frame)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar o jogador
    drawPlayer();
    
    // Desenhar elementos decorativos
    drawBackground();
    
    // Desenhar informações de debug (opcional)
    drawDebugInfo();
}

/**
 * Desenha o personagem do jogador no canvas
 */
function drawPlayer() {
    const player = gameState.player;
    
    // Salvar o estado atual do contexto
    ctx.save();
    
    // Desenhar o corpo do jogador
    ctx.fillStyle = gameState.colors.player;
    ctx.fillRect(
        player.x - player.size/2, 
        player.y - player.size/2, 
        player.size, 
        player.size
    );
    
    // Desenhar um contorno
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        player.x - player.size/2, 
        player.y - player.size/2, 
        player.size, 
        player.size
    );
    
    // Restaurar o estado do contexto
    ctx.restore();
}

/**
 * Desenha elementos decorativos de fundo
 */
function drawBackground() {
    // Desenhar algumas estrelas simples
    ctx.fillStyle = '#ffffff';
    for(let i = 0; i < 20; i++) {
        const x = (i * 40) % canvas.width;
        const y = (i * 30) % canvas.height;
        ctx.fillRect(x, y, 2, 2);
    }
}

/**
 * Desenha informações de debug (posição, FPS, etc.)
 */
function drawDebugInfo() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Courier New';
    ctx.fillText(`Pos: (${gameState.player.x}, ${gameState.player.y})`, 10, canvas.height - 20);
    ctx.fillText(`Vida: ${gameState.player.health}/${gameState.player.maxHealth}`, 10, canvas.height - 40);
}

// ========================================
// ETAPA 4: SISTEMA DE INTERFACE (HUD)
// ========================================

/**
 * Atualiza todos os elementos da interface do usuário
 * Esta função é chamada sempre que o estado do jogo muda
 */
function updateHUD() {
    const player = gameState.player;
    
    // Atualizar texto da vida
    healthDisplay.textContent = player.health;
    
    // Atualizar barra de vida visual
    const healthPercentage = (player.health / player.maxHealth) * 100;
    healthBar.style.width = healthPercentage + '%';
    
    // Atualizar texto da energia
    energyDisplay.textContent = player.energy;
    
    // Atualizar barra de energia visual
    const energyPercentage = (player.energy / player.maxEnergy) * 100;
    energyBar.style.width = energyPercentage + '%';
    
    // Atualizar arma equipada
    weaponDisplay.textContent = player.weapon;
    
    // Adicionar efeitos visuais baseados no estado
    updateVisualEffects();
}

/**
 * Adiciona efeitos visuais baseados no estado atual
 */
function updateVisualEffects() {
    const player = gameState.player;
    
    // Efeito de vida baixa
    if(player.health <= 20) {
        healthDisplay.style.animation = 'blink 0.5s infinite';
        healthBar.style.boxShadow = '0 0 10px red';
    } else {
        healthDisplay.style.animation = 'none';
        healthBar.style.boxShadow = 'none';
    }
    
    // Efeito de energia baixa
    if(player.energy <= 10) {
        energyDisplay.style.animation = 'blink 0.5s infinite';
    } else {
        energyDisplay.style.animation = 'none';
    }
}

// ========================================
// ETAPA 5: LÓGICA DE JOGO E SIMULAÇÕES
// ========================================

/**
 * Simula o jogador recebendo dano
 * @param {number} amount - Quantidade de dano a receber
 */
function simulateDamage() {
    const damage = 10;
    gameState.player.health = Math.max(0, gameState.player.health - damage);
    updateHUD();
    
    // Efeito visual de dano
    flashEffect('red');
    
    console.log(`Jogador recebeu ${damage} de dano. Vida atual: ${gameState.player.health}`);
}

/**
 * Simula o jogador sendo curado
 * @param {number} amount - Quantidade de cura a receber
 */
function simulateHealing() {
    const healing = 20;
    gameState.player.health = Math.min(
        gameState.player.maxHealth, 
        gameState.player.health + healing
    );
    updateHUD();
    
    // Efeito visual de cura
    flashEffect('green');
    
    console.log(`Jogador foi curado em ${healing}. Vida atual: ${gameState.player.health}`);
}

/**
 * Simula o uso de energia
 */
function simulateEnergyUse() {
    const energyCost = 15;
    if(gameState.player.energy >= energyCost) {
        gameState.player.energy -= energyCost;
        updateHUD();
        
        // Efeito visual de uso de energia
        flashEffect('blue');
        
        console.log(`Energia usada: ${energyCost}. Energia atual: ${gameState.player.energy}`);
    } else {
        console.log('Energia insuficiente!');
        flashEffect('orange');
    }
}

/**
 * Simula a recarga de energia
 */
function simulateEnergyRecharge() {
    const recharge = 25;
    gameState.player.energy = Math.min(
        gameState.player.maxEnergy, 
        gameState.player.energy + recharge
    );
    updateHUD();
    
    // Efeito visual de recarga
    flashEffect('cyan');
    
    console.log(`Energia recarregada: ${recharge}. Energia atual: ${gameState.player.energy}`);
}

/**
 * Troca a arma equipada
 * @param {string} newWeapon - Nome da nova arma
 */
function changeWeapon(newWeapon) {
    gameState.player.weapon = newWeapon;
    updateHUD();
    
    console.log(`Arma trocada para: ${newWeapon}`);
}

/**
 * Reseta o jogo para o estado inicial
 */
function resetGame() {
    gameState.player.health = gameState.player.maxHealth;
    gameState.player.energy = 50;
    gameState.player.weapon = 'Blaster';
    updateHUD();
    
    console.log('Jogo resetado para o estado inicial');
}

// ========================================
// ETAPA 6: EFEITOS VISUAIS E ANIMAÇÕES
// ========================================

/**
 * Cria um efeito de flash na tela
 * @param {string} color - Cor do flash
 */
function flashEffect(color) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = color;
    overlay.style.opacity = '0.3';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    
    document.body.appendChild(overlay);
    
    // Remover o overlay após a animação
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 150);
}

// ========================================
// ETAPA 7: LOOP PRINCIPAL DO JOGO
// ========================================

/**
 * Loop principal do jogo - executa continuamente
 * Esta é a função mais importante: ela atualiza e desenha o jogo
 */
function gameLoop() {
    // 1. Atualizar a lógica do jogo
    updateGameLogic();
    
    // 2. Desenhar tudo no canvas
    drawGame();
    
    // 3. Atualizar a interface
    updateHUD();
    
    // 4. Solicitar o próximo frame
    requestAnimationFrame(gameLoop);
}

/**
 * Atualiza a lógica do jogo (movimento, física, etc.)
 */
function updateGameLogic() {
    // Aqui você pode adicionar lógica de movimento,
    // detecção de colisões, inteligência artificial, etc.
    
    // Exemplo: movimento automático do jogador
    // gameState.player.x += 1;
    // if(gameState.player.x > canvas.width) gameState.player.x = 0;
}

// ========================================
// ETAPA 8: INICIALIZAÇÃO DO JOGO
// ========================================

/**
 * Função de inicialização - executa quando a página carrega
 */
function initializeGame() {
    console.log('🎮 Iniciando o jogo educativo...');
    
    // Configurar estado inicial
    updateHUD();
    
    // Adicionar estilos CSS dinâmicos para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
        }
    `;
    document.head.appendChild(style);
    
    // Iniciar o loop do jogo
    gameLoop();
    
    console.log('✅ Jogo inicializado com sucesso!');
    console.log('💡 Dica: Abra o Console (F12) para ver as mensagens de debug');
}

// ========================================
// ETAPA 9: INICIAR O JOGO
// ========================================

// Aguardar a página carregar completamente antes de iniciar
window.addEventListener('load', initializeGame);

/* ========================================
    NOTAS EDUCATIVAS PARA OS ALUNOS:
    
    1. DOM (Document Object Model): 
        - Representa a estrutura HTML da página
        - Permite manipular elementos via JavaScript
        
    2. Canvas: 
        - Elemento HTML para desenhar gráficos
        - Usamos o contexto 2D para desenhar formas e imagens
        
    3. Game Loop: 
        - Ciclo contínuo que atualiza e desenha o jogo
        - Usa requestAnimationFrame para sincronizar com o monitor
        
    4. Estado do Jogo: 
        - Object que armazena todas as informações do jogo
        - Facilita a organização e manutenção do código
        
    5. HUD (Head-Up Display): 
        - Interface que mostra informações ao jogador
        - Deve ser atualizada sempre que o estado muda
        
    6. Eventos: 
        - Permitem responder a ações do usuário
        - Botões, teclas, movimento do mouse, etc.
        
    7. Animações: 
        - Criadas mudando propriedades ao longo do tempo
        - CSS transitions e JavaScript podem ser combinados
        
    EXERCÍCIOS PROPOSTOS:
    - Adicionar movimento com as setas do teclado
    - Criar um sistema de pontuação
    - Implementar diferentes tipos de armas
    - Adicionar inimigos simples
    - Criar um sistema de níveis
======================================== */