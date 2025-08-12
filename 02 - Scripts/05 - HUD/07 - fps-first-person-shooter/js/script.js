// ===== 1. SELEÇÃO DE ELEMENTOS DO DOM =====
// Aqui capturamos todos os elementos HTML que vamos manipular
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const healthBar = document.getElementById('health-bar');
const ammoBar = document.getElementById('ammo-bar');
const weaponDisplay = document.getElementById('weapon');
const goldDisplay = document.getElementById('gold');

// ===== 2. VARIÁVEIS GLOBAIS DO JOGO =====
// Estas variáveis controlam o estado atual do jogador
let playerHealth = 100;     // Vida do jogador (0-100)
let playerMaxHealth = 100;  // Vida máxima do jogador
let playerAmmo = 100;       // Munição atual (0-100)
let playerMaxAmmo = 100;    // Munição máxima
let playerWeapon = 'Pistola'; // Arma equipada
let playerGold = 0;         // Quantidade de ouro

// Posição do jogador no canvas
let playerX = 400;  // Posição X (horizontal)
let playerY = 200;  // Posição Y (vertical)

// ===== 3. FUNÇÃO PRINCIPAL DE DESENHO DO JOGO =====
function drawGame() {
    // Limpa todo o canvas para redesenhar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o fundo do jogo (opcional)
    drawBackground();
    
    // Desenha o jogador
    drawPlayer();
    
    // Aqui você pode adicionar:
    // - drawEnemies(); (desenhar inimigos)
    // - drawItems(); (desenhar itens)
    // - drawScenery(); (desenhar cenário)
}

// ===== 4. FUNÇÃO PARA DESENHAR O FUNDO =====
function drawBackground() {
    // Gradiente simples para o fundo
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#001122');
    gradient.addColorStop(1, '#003366');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ===== 5. FUNÇÃO PARA DESENHAR O JOGADOR =====
function drawPlayer() {
    // Desenha o jogador como um círculo azul
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(playerX, playerY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Adiciona uma borda branca
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Adiciona texto indicativo
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('JOGADOR', playerX, playerY - 30);
}

// ===== 6. FUNÇÃO PARA ATUALIZAR A HUD =====
function updateHUD() {
    // Calcula as porcentagens para as barras
    const healthPercentage = (playerHealth / playerMaxHealth) * 100;
    const ammoPercentage = (playerAmmo / playerMaxAmmo) * 100;
    
    // Atualiza a largura das barras baseada na porcentagem
    healthBar.style.width = healthPercentage + '%';
    ammoBar.style.width = ammoPercentage + '%';
    
    // Muda a cor da barra de vida baseada no valor
    if (healthPercentage > 50) {
        healthBar.style.backgroundColor = '#4CAF50'; // Verde
    } else if (healthPercentage > 25) {
        healthBar.style.backgroundColor = '#FFC107'; // Amarelo
    } else {
        healthBar.style.backgroundColor = '#F44336'; // Vermelho
    }
    
    // Atualiza os textos na HUD
    weaponDisplay.textContent = playerWeapon;
    goldDisplay.textContent = playerGold;
}

// ===== 7. LOOP PRINCIPAL DO JOGO =====
function gameLoop() {
    drawGame();    // Desenha todos os elementos visuais
    updateHUD();   // Atualiza a interface do usuário
    
    // Solicita a próxima animação (60 FPS aproximadamente)
    requestAnimationFrame(gameLoop);
}

// ===== 8. FUNÇÕES DE CONTROLE DO JOGADOR =====

// Função para o jogador receber dano
function loseHealth(damage) {
    playerHealth -= damage;
    
    // Garante que a vida não fique negativa
    if (playerHealth < 0) {
        playerHealth = 0;
        console.log('💀 Jogador morreu!');
    }
    
    console.log(`❤️ Vida atual: ${playerHealth}/${playerMaxHealth}`);
    updateHUD();
}

// Função para usar munição
function useAmmo(amount) {
    playerAmmo -= amount;
    
    // Garante que a munição não fique negativa
    if (playerAmmo < 0) {
        playerAmmo = 0;
        console.log('🔫 Sem munição!');
    }
    
    console.log(`🔫 Munição atual: ${playerAmmo}/${playerMaxAmmo}`);
    updateHUD();
}

// Função para trocar de arma
function changeWeapon(newWeapon) {
    playerWeapon = newWeapon;
    
    // Diferentes armas têm diferentes capacidades de munição
    switch(newWeapon) {
        case 'Pistola':
            playerMaxAmmo = 100;
            break;
        case 'Rifle':
            playerMaxAmmo = 150;
            break;
        case 'Shotgun':
            playerMaxAmmo = 75;
            break;
    }
    
    // Recarrega a munição para a nova arma
    playerAmmo = playerMaxAmmo;
    
    console.log(`⚔️ Arma trocada para: ${newWeapon}`);
    updateHUD();
}

// Função para ganhar ouro
function gainGold(amount) {
    playerGold += amount;
    console.log(`💰 Ouro ganho: +${amount} (Total: ${playerGold})`);
    updateHUD();
}

// Função para curar o jogador
function healPlayer(amount) {
    playerHealth += amount;
    
    // Garante que a vida não ultrapasse o máximo
    if (playerHealth > playerMaxHealth) {
        playerHealth = playerMaxHealth;
    }
    
    console.log(`💚 Vida curada: +${amount} (Total: ${playerHealth})`);
    updateHUD();
}

// Função para recarregar munição
function reloadAmmo() {
    playerAmmo = playerMaxAmmo;
    console.log(`🔄 Munição recarregada: ${playerAmmo}`);
    updateHUD();
}

// Função para resetar o jogo
function resetGame() {
    playerHealth = playerMaxHealth;
    playerAmmo = playerMaxAmmo;
    playerWeapon = 'Pistola';
    playerGold = 0;
    
    console.log('🔄 Jogo resetado!');
    updateHUD();
}

// ===== 9. CONTROLES DO TECLADO =====
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            playerY = Math.max(20, playerY - 10); // Move para cima
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            playerY = Math.min(canvas.height - 20, playerY + 10); // Move para baixo
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            playerX = Math.max(20, playerX - 10); // Move para esquerda
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            playerX = Math.min(canvas.width - 20, playerX + 10); // Move para direita
            break;
        case ' ':
            event.preventDefault(); // Previne scroll da página
            useAmmo(1); // Dispara (usa munição)
            break;
        case 'r':
        case 'R':
            reloadAmmo(); // Recarrega
            break;
    }
});

// ===== 10. INICIALIZAÇÃO DO JOGO =====
console.log('🎮 Jogo de RPG Didático iniciado!');
console.log('Controles:');
console.log('- WASD ou setas: mover jogador');
console.log('- Espaço: disparar');
console.log('- R: recarregar');

// Atualiza a HUD inicial
updateHUD();

// Inicia o loop principal do jogo
gameLoop();