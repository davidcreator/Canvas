/* ====== SCRIPT PRINCIPAL DO JOGO ====== */
/* Este código JavaScript controla toda a lógica do jogo */

// Espera o HTML carregar completamente antes de executar
document.addEventListener("DOMContentLoaded", () => {
    
    /* ====== REFERÊNCIAS DOS ELEMENTOS DA INTERFACE ====== */
    // Busca elementos HTML para poder modificá-los
    const livesCount = document.getElementById("lives-count");
    const scoreCount = document.getElementById("score-count");
    const powerUpsList = document.getElementById("power-ups-list");
    const gameCanvas = document.getElementById("gameCanvas");
    
    // Obtém o contexto 2D do canvas para desenhar
    const ctx = gameCanvas.getContext("2d");
    
    /* ====== VARIÁVEIS DE ESTADO DO JOGO ====== */
    // Estas variáveis controlam o estado atual do jogo
    let lives = 3;                    // Número de vidas do jogador
    let score = 0;                    // Pontuação atual
    let powerUps = [];                // Array com power-ups coletados
    let selectedWeapon = 1;           // Arma atualmente selecionada
    let gameRunning = true;           // Controla se o jogo está ativo
    
    /* ====== FUNÇÃO PARA ATUALIZAR A INTERFACE ====== */
    // Sincroniza os valores das variáveis com o que aparece na tela
    function updateUI() {
        // Atualiza texto dos elementos HTML
        livesCount.textContent = lives;
        scoreCount.textContent = score.toLocaleString(); // Formata números grandes
        
        // Mostra power-ups ou "Nenhum" se vazio
        powerUpsList.textContent = powerUps.length > 0 ? powerUps.join(", ") : "Nenhum";
        
        // Destaca a arma selecionada
        updateWeaponSelection();
    }
    
    /* ====== SISTEMA DE SELEÇÃO DE ARMAS ====== */
    // Atualiza visualmente qual arma está selecionada
    function updateWeaponSelection() {
        // Remove destaque de todos os slots
        for (let i = 1; i <= 9; i++) {
            const weaponSlot = document.getElementById(`weapon${i}`);
            weaponSlot.style.backgroundColor = "#333";
            weaponSlot.style.color = "#ccc";
        }
        
        // Destaca a arma selecionada
        const currentWeapon = document.getElementById(`weapon${selectedWeapon}`);
        currentWeapon.style.backgroundColor = "#007acc";
        currentWeapon.style.color = "#fff";
    }
    
    /* ====== FUNÇÕES DE GAMEPLAY ====== */
    
    // Incrementa a pontuação do jogador
    function incrementScore(points) {
        score += points;
        console.log(`Pontos adicionados: ${points}. Total: ${score}`);
        updateUI(); // Atualiza a interface
    }
    
    // Remove uma vida do jogador
    function loseLife() {
        if (lives > 0) {
            lives -= 1;
            console.log(`Vida perdida! Vidas restantes: ${lives}`);
            
            // Verifica game over
            if (lives === 0) {
                gameOver();
            }
        }
        updateUI();
    }
    
    // Adiciona um power-up à coleção
    function addPowerUp(powerUp) {
        powerUps.push(powerUp);
        console.log(`Power-up coletado: ${powerUp}`);
        updateUI();
    }
    
    // Remove um power-up específico
    function removePowerUp(powerUp) {
        const index = powerUps.indexOf(powerUp);
        if (index > -1) {
            powerUps.splice(index, 1);
            console.log(`Power-up removido: ${powerUp}`);
            updateUI();
        }
    }
    
    // Gerencia o fim de jogo
    function gameOver() {
        gameRunning = false;
        alert(`Game Over! Pontuação final: ${score}`);
        // Aqui você pode adicionar lógica para reiniciar o jogo
    }
    
    /* ====== SISTEMA DE CONTROLES ====== */
    
    // Escuta teclas pressionadas
    document.addEventListener("keydown", (event) => {
        const key = event.key;
        
        // Teclas 1-9 selecionam armas
        if (key >= "1" && key <= "9") {
            selectedWeapon = parseInt(key);
            console.log(`Arma ${selectedWeapon} selecionada`);
            updateUI();
        }
        
        // Tecla Espaço para atirar (exemplo)
        if (key === " ") {
            event.preventDefault(); // Impede scroll da página
            console.log(`Atirando com arma ${selectedWeapon}!`);
            // Aqui você adicionaria lógica de disparo
        }
    });
    
    // Permite clicar nos slots de armas
    for (let i = 1; i <= 9; i++) {
        const weaponSlot = document.getElementById(`weapon${i}`);
        weaponSlot.addEventListener("click", () => {
            selectedWeapon = i;
            console.log(`Arma ${i} selecionada via clique`);
            updateUI();
        });
    }
    
    /* ====== FUNÇÃO DE DESENHO NO CANVAS ====== */
    // Esta função desenha elementos visuais no jogo
    function drawGame() {
        // Limpa o canvas
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        // Desenha um exemplo simples (você pode expandir isso)
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(100, 100, 50, 50); // Quadrado verde de exemplo
        
        // Texto de exemplo no canvas
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Arial";
        ctx.fillText("Área de Jogo - Desenvolva seu jogo aqui!", 50, 50);
    }
    
    /* ====== LOOP PRINCIPAL DO JOGO ====== */
    // Esta função executa continuamente para animar o jogo
    function gameLoop() {
        if (gameRunning) {
            drawGame();                    // Desenha elementos do jogo
            requestAnimationFrame(gameLoop); // Agenda próxima execução
        }
    }
    
    /* ====== FUNÇÕES DE TESTE PARA APRENDIZADO ====== */
    // Estas funções ajudam a testar o sistema
    
    // Simula ganhar pontos
    setTimeout(() => incrementScore(100), 2000);
    setTimeout(() => incrementScore(250), 4000);
    
    // Simula coletar power-ups
    setTimeout(() => addPowerUp("Velocidade"), 3000);
    setTimeout(() => addPowerUp("Força"), 5000);
    
    /* ====== INICIALIZAÇÃO ====== */
    // Configura tudo para começar o jogo
    console.log("Jogo inicializado! Use as teclas 1-9 para selecionar armas.");
    console.log("Pressione Espaço para atirar (funcionalidade de exemplo).");
    
    updateUI();    // Primeira atualização da interface
    gameLoop();    // Inicia o loop principal do jogo
});