// ==========================================
// SEÇÃO JAVASCRIPT 1: INICIALIZAÇÃO
// ==========================================
// Aguarda o carregamento completo da página antes de executar o código

document.addEventListener("DOMContentLoaded", () => {
    console.log("🎮 Sistema do jogo iniciado!");

    // ==========================================
    // SEÇÃO 2: REFERÊNCIAS DOS ELEMENTOS HTML
    // ==========================================
    // Conecta o JavaScript aos elementos da interface

    const livesCount = document.getElementById("lives-count");      // Elemento que mostra as vidas
    const scoreCount = document.getElementById("score-count");      // Elemento que mostra a pontuação
    const powerUpsList = document.getElementById("power-ups-list"); // Elemento que mostra os power-ups
    const currentHealth = document.getElementById("current-health"); // Barra de saúde visual
    const canvas = document.getElementById("gameCanvas");           // Área de desenho do jogo
    const ctx = canvas.getContext("2d");                          // Contexto para desenhar no canvas

    // ==========================================
    // SEÇÃO 3: VARIÁVEIS DE ESTADO DO JOGO
    // ==========================================
    // Armazena todas as informações importantes do jogo

    let estadoJogo = {
        vidas: 3,           // Número de vidas do jogador
        pontuacao: 0,       // Pontos acumulados
        powerUps: [],       // Lista de power-ups coletados
        saude: 100,         // Saúde atual (0-100)
        saudeMaxima: 100    // Saúde máxima possível
    };

    // ==========================================
    // SEÇÃO 4: FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO
    // ==========================================
    // Sincroniza os dados do jogo com a interface visual

    function atualizarInterface() {
        console.log("🔄 Atualizando interface do usuário...");
        
        // Atualiza o contador de vidas
        livesCount.textContent = estadoJogo.vidas;
        
        // Atualiza a pontuação
        scoreCount.textContent = estadoJogo.pontuacao.toLocaleString('pt-BR');
        
        // Atualiza a lista de power-ups
        if (estadoJogo.powerUps.length > 0) {
            powerUpsList.textContent = estadoJogo.powerUps.join(", ");
        } else {
            powerUpsList.textContent = "Nenhum";
        }
        
        // Atualiza a barra de saúde visualmente
        const porcentagemSaude = (estadoJogo.saude / estadoJogo.saudeMaxima) * 100;
        currentHealth.style.width = porcentagemSaude + "%";
        
        // Muda a cor da barra baseada na saúde
        if (porcentagemSaude > 60) {
            currentHealth.style.background = "linear-gradient(90deg, #00ff00, #7fff00)"; // Verde
        } else if (porcentagemSaude > 30) {
            currentHealth.style.background = "linear-gradient(90deg, #ffff00, #ffa500)"; // Amarelo
        } else {
            currentHealth.style.background = "linear-gradient(90deg, #ff0000, #ff6666)"; // Vermelho
        }
    }

    // ==========================================
    // SEÇÃO 5: FUNÇÕES DE GAMEPLAY
    // ==========================================
    // Funções que modificam o estado do jogo

    // Função para aumentar a pontuação
    function adicionarPontos(pontos) {
        console.log(`✨ +${pontos} pontos adicionados!`);
        estadoJogo.pontuacao += pontos;
        atualizarInterface();
        
        // Efeito visual opcional
        mostrarTextoFlutuante(`+${pontos}`, "green");
    }

    // Função para o jogador perder uma vida
    function perderVida() {
        if (estadoJogo.vidas > 0) {
            estadoJogo.vidas -= 1;
            console.log(`💔 Vida perdida! Vidas restantes: ${estadoJogo.vidas}`);
            
            if (estadoJogo.vidas === 0) {
                console.log("💀 Game Over!");
                alert("Game Over! Clique em 'Reiniciar' para jogar novamente.");
            }
        } else {
            console.log("⚠️ Tentativa de perder vida, mas já está em 0");
        }
        atualizarInterface();
    }

    // Função para adicionar um power-up
    function coletarPowerUp(nomePowerUp) {
        console.log(`🚀 Power-up coletado: ${nomePowerUp}`);
        estadoJogo.powerUps.push(nomePowerUp);
        atualizarInterface();
        
        // Efeito visual
        mostrarTextoFlutuante(`${nomePowerUp} coletado!`, "blue");
    }

    // Função para modificar a saúde (positivo = cura, negativo = dano)
    function modificarSaude(quantidade) {
        const saudeAnterior = estadoJogo.saude;
        estadoJogo.saude = Math.max(0, Math.min(estadoJogo.saudeMaxima, estadoJogo.saude + quantidade));
        
        if (quantidade > 0) {
            console.log(`💚 Curou ${quantidade} pontos de saúde`);
            mostrarTextoFlutuante(`+${quantidade} HP`, "green");
        } else {
            console.log(`💔 Recebeu ${Math.abs(quantidade)} de dano`);
            mostrarTextoFlutuante(`${quantidade} HP`, "red");
        }
        
        // Se a saúde chegou a zero, perde uma vida
        if (estadoJogo.saude === 0 && saudeAnterior > 0) {
            estadoJogo.saude = estadoJogo.saudeMaxima; // Restaura saúde
            perderVida(); // Perde uma vida
        }
        
        atualizarInterface();
    }

    // ==========================================
    // SEÇÃO 6: FUNÇÕES DE DEMONSTRAÇÃO
    // ==========================================
    // Funções conectadas aos botões para testar o sistema

    window.demonstrarPontuacao = function() {
        adicionarPontos(100);
    };

    window.demonstrarDano = function() {
        modificarSaude(-25); // Remove 25 pontos de saúde
    };

    window.demonstrarCura = function() {
        modificarSaude(20); // Adiciona 20 pontos de saúde
    };

    window.demonstrarPowerUp = function() {
        const powerUpsDisponiveis = ["Velocidade", "Escudo", "Tiro Duplo", "Super Pulo", "Invisibilidade"];
        const powerUpAleatorio = powerUpsDisponiveis[Math.floor(Math.random() * powerUpsDisponiveis.length)];
        coletarPowerUp(powerUpAleatorio);
    };

    window.demonstrarPerderVida = function() {
        perderVida();
    };

    // Função para reiniciar o jogo
    window.reiniciarJogo = function() {
        console.log("🔄 Reiniciando jogo...");
        estadoJogo = {
            vidas: 3,
            pontuacao: 0,
            powerUps: [],
            saude: 100,
            saudeMaxima: 100
        };
        atualizarInterface();
        limparCanvas();
        mostrarTextoFlutuante("Jogo Reiniciado!", "white");
    };

    // ==========================================
    // SEÇÃO 7: FUNÇÕES DE EFEITOS VISUAIS
    // ==========================================

    function mostrarTextoFlutuante(texto, cor) {
        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configura o texto
        ctx.font = "24px Arial";
        ctx.fillStyle = cor;
        ctx.textAlign = "center";
        
        // Desenha o texto no centro do canvas
        ctx.fillText(texto, canvas.width / 2, canvas.height / 2);
        
        // Remove o texto após 1 segundo
        setTimeout(() => {
            limparCanvas();
        }, 1000);
    }

    function limparCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenha uma mensagem de boas-vindas
        ctx.font = "18px Arial";
        ctx.fillStyle = "#666";
        ctx.textAlign = "center";
        ctx.fillText("🎮 Área do Jogo", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText("Use os botões abaixo para testar as funcionalidades", canvas.width / 2, canvas.height / 2 + 20);
    }

    // ==========================================
    // SEÇÃO 8: INICIALIZAÇÃO FINAL
    // ==========================================

    // Atualiza a interface pela primeira vez
    atualizarInterface();
    
    // Desenha a mensagem inicial no canvas
    limparCanvas();
    
    console.log("✅ Sistema inicializado com sucesso!");
});