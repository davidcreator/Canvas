/* =====================================
    🎮 JOGO DA COBRINHA - CÓDIGO JAVASCRIPT
    
    Este código foi desenvolvido de forma didática
    para facilitar o aprendizado de programação.
    
    AUTOR: Professor
    DATA: 2025
    ===================================== */

// =====================================
// SEÇÃO 1: AGUARDAR CARREGAMENTO DA PÁGINA
// =====================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Jogo da Cobrinha carregado!');
    inicializarJogo();
});

// =====================================
// SEÇÃO 2: ELEMENTOS DOM E VARIÁVEIS GLOBAIS
// =====================================

function inicializarJogo() {
    // 🎯 ELEMENTOS DA INTERFACE
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const botaoIniciar = document.getElementById('start-button');
    const seletorDificuldade = document.getElementById('difficulty');
    const displayPontuacao = document.getElementById('score');
    const statusJogo = document.getElementById('game-status');

    // 🐍 VARIÁVEIS DO ESTADO DO JOGO
    let cobra = [{ x: 200, y: 200 }];  // Posição inicial da cobra
    let direcao = { x: 0, y: 0 };      // Direção atual da cobra
    let comida = { x: 0, y: 0 };       // Posição da comida
    let pontuacao = 0;                 // Pontos do jogador
    let jogoAtivo = false;             // Se o jogo está rodando
    let intervalojogo;                 // Controle do loop do jogo
    let velocidade = 200;              // Velocidade do jogo (ms)

    // 🎨 CONFIGURAÇÕES VISUAIS
    const TAMANHO_CELULA = 20;         // Tamanho de cada célula do grid
    const COR_COBRA = '#27ae60';       // Verde para a cobra
    const COR_COMIDA = '#e74c3c';      // Vermelho para a comida
    const COR_FUNDO = '#ecf0f1';       // Cor de fundo do canvas

    // =====================================
    // SEÇÃO 3: FUNÇÕES PRINCIPAIS DO JOGO
    // =====================================

    /**
     * 🚀 FUNÇÃO: Iniciar o jogo
     * DESCRIÇÃO: Configura e inicia uma nova partida
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function iniciarJogo() {
        console.log('🚀 Iniciando novo jogo...');
        
        // Reseta todas as variáveis para valores iniciais
        reiniciarJogo();
        
        // Define a velocidade baseada na dificuldade escolhida
        definirDificuldade();
        
        // Coloca a primeira comida no canvas
        posicionarComida();
        
        // Atualiza o status na tela
        statusJogo.textContent = 'Jogo em andamento!';
        statusJogo.style.color = '#f39c12';
        
        // Marca o jogo como ativo
        jogoAtivo = true;
        
        // Inicia o loop principal do jogo
        intervalojogo = setInterval(loopPrincipalJogo, velocidade);
    }

    /**
     * 🔄 FUNÇÃO: Reiniciar o jogo
     * DESCRIÇÃO: Volta todas as variáveis ao estado inicial
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function reiniciarJogo() {
        console.log('🔄 Reiniciando jogo...');
        
        // Reseta a cobra para posição inicial (centro da tela)
        cobra = [{ x: 200, y: 200 }];
        
        // Para a cobra (sem movimento)
        direcao = { x: 0, y: 0 };
        
        // Zera a pontuação
        pontuacao = 0;
        displayPontuacao.textContent = pontuacao;
        
        // Para o jogo anterior (se estiver rodando)
        jogoAtivo = false;
        clearInterval(intervalojogo);
        
        // Limpa o canvas
        limparCanvas();
    }

    /**
     * ⚡ FUNÇÃO: Definir dificuldade
     * DESCRIÇÃO: Ajusta a velocidade do jogo baseada na escolha do usuário
     * PARÂMETROS: Nenhum (lê do select HTML)
     * RETORNO: Nenhum
     */
    function definirDificuldade() {
        const dificuldade = seletorDificuldade.value;
        
        // Quanto menor o número, mais rápido o jogo
        switch(dificuldade) {
            case 'easy':
                velocidade = 300;  // Mais lento = mais fácil
                console.log('🟢 Dificuldade: Fácil (300ms)');
                break;
            case 'medium':
                velocidade = 150;  // Velocidade média
                console.log('🟡 Dificuldade: Médio (150ms)');
                break;
            case 'hard':
                velocidade = 80;   // Mais rápido = mais difícil
                console.log('🔴 Dificuldade: Difícil (80ms)');
                break;
        }
    }

    /**
     * 🍎 FUNÇÃO: Posicionar comida
     * DESCRIÇÃO: Coloca uma nova comida em posição aleatória no grid
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function posicionarComida() {
        // Gera posição aleatória que seja múltiplo do tamanho da célula
        comida.x = Math.floor(Math.random() * (canvas.width / TAMANHO_CELULA)) * TAMANHO_CELULA;
        comida.y = Math.floor(Math.random() * (canvas.height / TAMANHO_CELULA)) * TAMANHO_CELULA;
        
        console.log(`🍎 Nova comida em: (${comida.x}, ${comida.y})`);
    }

    // =====================================
    // SEÇÃO 4: LOOP PRINCIPAL DO JOGO
    // =====================================

    /**
     * 🔄 FUNÇÃO: Loop principal do jogo
     * DESCRIÇÃO: Executa a cada frame do jogo, controlando toda a lógica
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function loopPrincipalJogo() {
        // Se o jogo não estiver ativo, para aqui
        if (!jogoAtivo) return;
        
        // 1. Move a cobra
        moverCobra();
        
        // 2. Verifica se houve colisão
        if (verificarColisao()) {
            // Game Over!
            finalizarJogo();
            return; // Para a execução aqui
        }
        
        // 3. Verifica se a cobra comeu a comida
        if (verificarColisaoComida()) {
            // Aumenta pontuação
            pontuacao++;
            displayPontuacao.textContent = pontuacao;
            
            // Posiciona nova comida
            posicionarComida();
            
            // Faz a cobra crescer
            crescerCobra();
            
            console.log(`🏆 Pontuação: ${pontuacao}`);
        }
        
        // 4. Desenha tudo na tela
        desenharJogo();
    }

    // =====================================
    // SEÇÃO 5: MOVIMENTO E FÍSICA DA COBRA
    // =====================================

    /**
     * 🐍 FUNÇÃO: Mover cobra
     * DESCRIÇÃO: Move a cobra na direção atual
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function moverCobra() {
        // Só move se houver uma direção definida
        if (direcao.x === 0 && direcao.y === 0) return;
        
        // Calcula a nova posição da cabeça
        const novaCabeca = {
            x: cobra[0].x + direcao.x,
            y: cobra[0].y + direcao.y
        };
        
        // Adiciona a nova cabeça no início do array
        cobra.unshift(novaCabeca);
        
        // Remove a cauda (último elemento)
        // Isso faz a cobra "mover" mantendo o mesmo tamanho
        cobra.pop();
    }

    /**
     * 💥 FUNÇÃO: Verificar colisão
     * DESCRIÇÃO: Verifica se a cobra bateu na parede ou nela mesma
     * PARÂMETROS: Nenhum
     * RETORNO: Boolean (true = houve colisão, false = sem colisão)
     */
    function verificarColisao() {
        const cabeca = cobra[0];
        
        // COLISÃO COM AS PAREDES
        // Verifica se a cabeça saiu dos limites do canvas
        if (cabeca.x < 0 || cabeca.x >= canvas.width || 
            cabeca.y < 0 || cabeca.y >= canvas.height) {
            console.log('💥 Colisão com a parede!');
            return true;
        }
        
        // COLISÃO COM O PRÓPRIO CORPO
        // Verifica se a cabeça tocou em alguma parte do corpo
        for (let i = 1; i < cobra.length; i++) {
            if (cabeca.x === cobra[i].x && cabeca.y === cobra[i].y) {
                console.log('💥 Cobra bateu no próprio corpo!');
                return true;
            }
        }
        
        // Sem colisão
        return false;
    }

    /**
     * 🍎 FUNÇÃO: Verificar colisão com comida
     * DESCRIÇÃO: Verifica se a cobra comeu a comida
     * PARÂMETROS: Nenhum
     * RETORNO: Boolean (true = comeu, false = não comeu)
     */
    function verificarColisaoComida() {
        const cabeca = cobra[0];
        
        // Verifica se a posição da cabeça é igual à posição da comida
        return cabeca.x === comida.x && cabeca.y === comida.y;
    }

    /**
     * 📈 FUNÇÃO: Crescer cobra
     * DESCRIÇÃO: Aumenta o tamanho da cobra adicionando um segmento
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function crescerCobra() {
        // Pega a posição da cauda atual
        const cauda = { ...cobra[cobra.length - 1] };
        
        // Adiciona um novo segmento na posição da cauda
        cobra.push(cauda);
        
        console.log(`🐍 Cobra cresceu! Tamanho atual: ${cobra.length}`);
    }

    // =====================================
    // SEÇÃO 6: RENDERIZAÇÃO E DESENHO
    // =====================================

    /**
     * 🎨 FUNÇÃO: Desenhar jogo
     * DESCRIÇÃO: Desenha todos os elementos do jogo no canvas
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function desenharJogo() {
        // Limpa o canvas inteiro
        limparCanvas();
        
        // Desenha a cobra
        desenharCobra();
        
        // Desenha a comida
        desenharComida();
    }

    /**
     * 🧹 FUNÇÃO: Limpar canvas
     * DESCRIÇÃO: Limpa todo o canvas e aplica cor de fundo
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function limparCanvas() {
        // Define a cor de fundo
        ctx.fillStyle = COR_FUNDO;
        
        // Preenche todo o canvas com a cor de fundo
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * 🐍 FUNÇÃO: Desenhar cobra
     * DESCRIÇÃO: Desenha todos os segmentos da cobra
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function desenharCobra() {
        cobra.forEach(function(segmento, indice) {
            // Cabeça tem cor mais escura
            if (indice === 0) {
                ctx.fillStyle = '#1e8449'; // Verde mais escuro para a cabeça
            } else {
                ctx.fillStyle = COR_COBRA;  // Verde normal para o corpo
            }
            
            // Desenha o segmento
            ctx.fillRect(segmento.x, segmento.y, TAMANHO_CELULA, TAMANHO_CELULA);
            
            // Adiciona uma borda para melhor visualização
            ctx.strokeStyle = '#145a32';
            ctx.lineWidth = 1;
            ctx.strokeRect(segmento.x, segmento.y, TAMANHO_CELULA, TAMANHO_CELULA);
        });
    }

    /**
     * 🍎 FUNÇÃO: Desenhar comida
     * DESCRIÇÃO: Desenha a comida no canvas
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function desenharComida() {
        // Define a cor da comida
        ctx.fillStyle = COR_COMIDA;
        
        // Desenha a comida como um círculo para diferenciar da cobra
        ctx.beginPath();
        ctx.arc(
            comida.x + TAMANHO_CELULA/2, 
            comida.y + TAMANHO_CELULA/2, 
            TAMANHO_CELULA/2 - 2, 
            0, 
            2 * Math.PI
        );
        ctx.fill();
        
        // Adiciona um brilho na comida
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(
            comida.x + TAMANHO_CELULA/2 - 3, 
            comida.y + TAMANHO_CELULA/2 - 3, 
            3, 
            0, 
            2 * Math.PI
        );
        ctx.fill();
    }

    // =====================================
    // SEÇÃO 7: CONTROLES DO TECLADO
    // =====================================

    /**
     * ⌨️ FUNÇÃO: Controlar cobra
     * DESCRIÇÃO: Captura as teclas pressionadas e move a cobra
     * PARÂMETROS: event (evento do teclado)
     * RETORNO: Nenhum
     */
    function controlarCobra(event) {
        // Só aceita comandos se o jogo estiver ativo
        if (!jogoAtivo) return;
        
        // Verifica qual tecla foi pressionada
        switch(event.key) {
            case 'ArrowUp':
                // Só muda direção se não estiver movendo para baixo
                if (direcao.y !== TAMANHO_CELULA) {
                    direcao = { x: 0, y: -TAMANHO_CELULA };
                    console.log('⬆️ Movendo para cima');
                }
                break;
                
            case 'ArrowDown':
                // Só muda direção se não estiver movendo para cima
                if (direcao.y !== -TAMANHO_CELULA) {
                    direcao = { x: 0, y: TAMANHO_CELULA };
                    console.log('⬇️ Movendo para baixo');
                }
                break;
                
            case 'ArrowLeft':
                // Só muda direção se não estiver movendo para direita
                if (direcao.x !== TAMANHO_CELULA) {
                    direcao = { x: -TAMANHO_CELULA, y: 0 };
                    console.log('⬅️ Movendo para esquerda');
                }
                break;
                
            case 'ArrowRight':
                // Só muda direção se não estiver movendo para esquerda
                if (direcao.x !== -TAMANHO_CELULA) {
                    direcao = { x: TAMANHO_CELULA, y: 0 };
                    console.log('➡️ Movendo para direita');
                }
                break;
        }
        
        // Previne o comportamento padrão das setas (rolar página)
        event.preventDefault();
    }

    // =====================================
    // SEÇÃO 8: FINALIZAÇÃO DO JOGO
    // =====================================

    /**
     * 💀 FUNÇÃO: Finalizar jogo
     * DESCRIÇÃO: Encerra o jogo e mostra mensagem de game over
     * PARÂMETROS: Nenhum
     * RETORNO: Nenhum
     */
    function finalizarJogo() {
        // Para o loop do jogo
        jogoAtivo = false;
        clearInterval(intervalojogo);
        
        // Atualiza o status
        statusJogo.textContent = 'Game Over!';
        statusJogo.style.color = '#e74c3c';
        
        // Mostra mensagem de game over
        setTimeout(function() {
            alert(`🎮 Game Over!\n\n🏆 Sua pontuação final: ${pontuacao} pontos\n\n🔄 Clique em "Iniciar Jogo" para jogar novamente!`);
        }, 100);
        
        console.log(`💀 Fim de jogo! Pontuação final: ${pontuacao}`);
    }

    // =====================================
    // SEÇÃO 9: EVENT LISTENERS (EVENTOS)
    // =====================================

    // Evento do botão iniciar
    botaoIniciar.addEventListener('click', iniciarJogo);
    
    // Evento do teclado para controlar a cobra
    document.addEventListener('keydown', controlarCobra);
    
    // =====================================
    // SEÇÃO 10: INICIALIZAÇÃO
    // =====================================
    
    // Desenha o canvas vazio na inicialização
    limparCanvas();
    statusJogo.textContent = 'Pronto para jogar!';
    statusJogo.style.color = '#27ae60';
    
    console.log('✅ Jogo inicializado com sucesso!');
}