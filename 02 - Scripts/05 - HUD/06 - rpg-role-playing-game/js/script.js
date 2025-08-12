/* ==========================================
   TUTORIAL: SISTEMA DE RPG COM HUD - JAVASCRIPT
   ==========================================
   
   Este arquivo JavaScript controla toda a lógica de um sistema
   básico de RPG com interface HUD interativa.
   
   FUNCIONALIDADES:
   - Sistema de status do jogador (vida, mana, experiência, ouro)
   - Atualização dinâmica da interface HUD
   - Sistema de combate básico
   - Sistema de regeneração e recompensas
   - Loop principal do jogo
   
   SEÇÕES:
   1. Seleção de Elementos DOM
   2. Configurações e Variáveis do Jogo
   3. Funções de Interface (HUD)
   4. Sistema de Status do Jogador
   5. Funções de Gameplay
   6. Sistema de Canvas e Desenho
   7. Loop Principal do Jogo
*/

console.log("🎮 Iniciando Tutorial: Sistema de RPG com HUD");
console.log("📚 Arquivo: script.js - Sistema completo de jogo RPG");

/* ==========================================
   1. SELEÇÃO DE ELEMENTOS DOM
   ========================================== */

// ELEMENTOS DO CANVAS
// Seleciona o canvas onde o jogo será desenhado
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
console.log("✅ Canvas do jogo selecionado");

// ELEMENTOS DA INTERFACE HUD
// Seleciona todas as barras de status da interface
const healthBar = document.getElementById('health-bar');
const manaBar = document.getElementById('mana-bar');
const expBar = document.getElementById('exp-bar');

// Seleciona os elementos de texto das barras
const healthText = document.getElementById('health-text');
const manaText = document.getElementById('mana-text');
const expText = document.getElementById('exp-text');
const goldDisplay = document.getElementById('gold-display');

console.log("✅ Elementos da HUD selecionados");

/* ==========================================
   2. CONFIGURAÇÕES E VARIÁVEIS DO JOGO
   ========================================== */

// STATUS DO JOGADOR
// Objeto que contém todos os atributos do jogador
const player = {
    // Status de combate
    health: 100,        // Vida atual do jogador (0-100)
    maxHealth: 100,     // Vida máxima do jogador
    mana: 100,          // Mana atual do jogador (0-100)
    maxMana: 100,       // Mana máxima do jogador
    
    // Sistema de progressão
    experience: 0,      // Experiência atual (0-100)
    maxExperience: 100, // Experiência necessária para subir de nível
    level: 1,           // Nível atual do jogador
    
    // Recursos
    gold: 0,            // Quantidade de ouro possuída
    
    // Posição no canvas (para futuras implementações)
    x: 400,             // Posição horizontal
    y: 200              // Posição vertical
};

// CONFIGURAÇÕES DO JOGO
const gameConfig = {
    // Taxa de regeneração automática
    healthRegenRate: 1,     // Vida recuperada por segundo
    manaRegenRate: 2,       // Mana recuperada por segundo
    
    // Limites de dano
    minDamage: 5,           // Dano mínimo por ataque
    maxDamage: 20,          // Dano máximo por ataque
    
    // Sistema de experiência
    expPerAction: 10,       // EXP ganha por ação
    goldPerAction: 25       // Ouro ganho por ação
};

console.log("⚙️ Configurações do jogador inicializadas:", player);

/* ==========================================
   3. FUNÇÕES DE INTERFACE (HUD)
   ========================================== */

/**
 * FUNÇÃO: updateHUD()
 * DESCRIÇÃO: Atualiza toda a interface do usuário com os valores atuais
 * PARÂMETROS: Nenhum
 * RETORNO: void
 */
function updateHUD() {
    // ATUALIZAR BARRA DE VIDA
    // Calcula a porcentagem de vida atual
    const healthPercentage = (player.health / player.maxHealth) * 100;
    healthBar.style.width = healthPercentage + '%';
    healthText.textContent = `${player.health}/${player.maxHealth}`;
    
    // ATUALIZAR BARRA DE MANA  
    // Calcula a porcentagem de mana atual
    const manaPercentage = (player.mana / player.maxMana) * 100;
    manaBar.style.width = manaPercentage + '%';
    manaText.textContent = `${player.mana}/${player.maxMana}`;
    
    // ATUALIZAR BARRA DE EXPERIÊNCIA
    // Calcula a porcentagem de experiência atual
    const expPercentage = (player.experience / player.maxExperience) * 100;
    expBar.style.width = expPercentage + '%';
    expText.textContent = `${player.experience}/${player.maxExperience}`;
    
    // ATUALIZAR DISPLAY DE OURO
    goldDisplay.textContent = player.gold.toLocaleString();
    
    // Log para debug (pode ser removido em produção)
    console.log(`📊 HUD atualizada - Vida: ${player.health}, Mana: ${player.mana}, EXP: ${player.experience}, Ouro: ${player.gold}`);
}

/* ==========================================
   4. SISTEMA DE STATUS DO JOGADOR
   ========================================== */

/**
 * FUNÇÃO: loseHealth()
 * DESCRIÇÃO: Remove vida do jogador com validação de limites
 * PARÂMETROS: damage (number) - quantidade de dano recebido
 * RETORNO: boolean - true se o jogador ainda está vivo
 */
function loseHealth(damage) {
    console.log(`⚔️ Jogador recebeu ${damage} de dano`);
    
    // Subtrai o dano da vida atual
    player.health -= damage;
    
    // Garante que a vida não fique negativa
    if (player.health < 0) {
        player.health = 0;
        console.log("💀 Jogador foi derrotado!");
        alert("GAME OVER! Você foi derrotado!");
    }
    
    // Atualiza a interface
    updateHUD();
    
    // Retorna se o jogador ainda está vivo
    return player.health > 0;
}

/**
 * FUNÇÃO: restoreHealth()
 * DESCRIÇÃO: Restaura vida do jogador até o máximo
 * PARÂMETROS: amount (number) - quantidade de vida a restaurar
 * RETORNO: void
 */
function restoreHealth(amount) {
    console.log(`❤️ Jogador recuperou ${amount} de vida`);
    
    // Adiciona vida sem ultrapassar o máximo
    player.health = Math.min(player.health + amount, player.maxHealth);
    
    // Atualiza a interface
    updateHUD();
}

/**
 * FUNÇÃO: useMana()
 * DESCRIÇÃO: Consome mana do jogador para habilidades
 * PARÂMETROS: cost (number) - custo de mana da habilidade
 * RETORNO: boolean - true se havia mana suficiente
 */
function useMana(cost) {
    // Verifica se há mana suficiente
    if (player.mana < cost) {
        console.log(`💙 Mana insuficiente! Necessário: ${cost}, Atual: ${player.mana}`);
        alert("Mana insuficiente!");
        return false;
    }
    
    console.log(`💙 Jogador usou ${cost} de mana`);
    
    // Subtrai o custo da mana atual
    player.mana -= cost;
    
    // Garante que a mana não fique negativa
    if (player.mana < 0) {
        player.mana = 0;
    }
    
    // Atualiza a interface
    updateHUD();
    
    return true;
}

/**
 * FUNÇÃO: restoreMana()
 * DESCRIÇÃO: Restaura mana do jogador
 * PARÂMETROS: amount (number) - quantidade de mana a restaurar
 * RETORNO: void
 */
function restoreMana(amount) {
    console.log(`💙 Jogador recuperou ${amount} de mana`);
    
    // Adiciona mana sem ultrapassar o máximo
    player.mana = Math.min(player.mana + amount, player.maxMana);
    
    // Atualiza a interface
    updateHUD();
}

/* ==========================================
   5. FUNÇÕES DE GAMEPLAY
   ========================================== */

/**
 * FUNÇÃO: gainExperience()
 * DESCRIÇÃO: Adiciona experiência e verifica se subiu de nível
 * PARÂMETROS: amount (number) - quantidade de experiência ganha
 * RETORNO: void
 */
function gainExperience(amount) {
    console.log(`⭐ Jogador ganhou ${amount} de experiência`);
    
    // Adiciona experiência
    player.experience += amount;
    
    // Verifica se subiu de nível
    if (player.experience >= player.maxExperience) {
        levelUp();
    }
    
    // Atualiza a interface
    updateHUD();
}

/**
 * FUNÇÃO: gainGold()
 * DESCRIÇÃO: Adiciona ouro ao inventário do jogador
 * PARÂMETROS: amount (number) - quantidade de ouro ganha
 * RETORNO: void
 */
function gainGold(amount) {
    console.log(`🪙 Jogador ganhou ${amount} de ouro`);
    
    // Adiciona ouro
    player.gold += amount;
    
    // Atualiza a interface
    updateHUD();
}

/**
 * FUNÇÃO: levelUp()
 * DESCRIÇÃO: Sistema de aumento de nível
 * PARÂMETROS: Nenhum
 * RETORNO: void
 */
function levelUp() {
    console.log(`🎉 LEVEL UP! Nível ${player.level} → ${player.level + 1}`);
    
    // Aumenta o nível
    player.level++;
    
    // Reset da experiência
    player.experience = 0;
    
    // Aumenta atributos ao subir de nível
    player.maxHealth += 10;
    player.maxMana += 10;
    player.health = player.maxHealth; // Vida completa ao subir de nível
    player.mana = player.maxMana;     // Mana completa ao subir de nível
    
    // Notifica o jogador
    alert(`🎉 LEVEL UP! Agora você está no nível ${player.level}!\n+10 Vida Máxima\n+10 Mana Máxima`);
    
    // Atualiza a interface
    updateHUD();
}

/**
 * FUNÇÃO: resetStats()
 * DESCRIÇÃO: Reseta todos os status do jogador
 * PARÂMETROS: Nenhum
 * RETORNO: void
 */
function resetStats() {
    console.log("🔄 Resetando status do jogador");
    
    // Reseta todos os valores para o padrão
    player.health = 100;
    player.maxHealth = 100;
    player.mana = 100;
    player.maxMana = 100;
    player.experience = 0;
    player.maxExperience = 100;
    player.level = 1;
    player.gold = 0;
    
    // Atualiza a interface
    updateHUD();
    
    console.log("✅ Status resetado com sucesso");
}

/* ==========================================
   6. SISTEMA DE CANVAS E DESENHO
   ========================================== */

/**
 * FUNÇÃO: drawGame()
 * DESCRIÇÃO: Desenha todos os elementos visuais no canvas
 * PARÂMETROS: Nenhum
 * RETORNO: void
 */
function drawGame() {
    // LIMPAR O CANVAS
    // Remove todo o conteúdo anterior do canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // DESENHAR FUNDO DECORATIVO
    // Cria um padrão de grade para o fundo
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
    
    // DESENHAR PERSONAGEM
    // Desenha um círculo representando o jogador
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(player.x, player.y, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // DESENHAR INFORMAÇÕES DO JOGADOR NO CANVAS
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Nível ${player.level}`, player.x - 25, player.y - 30);
    
    // DESENHAR TÍTULO DO JOGO
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Sistema de RPG com HUD', canvas.width / 2, 50);
    
    // DESENHAR INSTRUÇÕES
    ctx.fillStyle = '#ccc';
    ctx.font = '14px Arial';
    ctx.fillText('Use as setas para mover', canvas.width / 2, canvas.height - 20);
}
