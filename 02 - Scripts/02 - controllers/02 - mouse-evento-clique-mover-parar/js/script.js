// === VARIÁVEIS GLOBAIS ===

let canvas;                    // Elemento canvas do HTML
let contexto;                  // Contexto 2D para desenhar no canvas
let quadradoVermelho;          // Objeto que representa nosso quadrado
let jogoRodando = true;        // Controla se o jogo está pausado ou não
let intervaloJogo;             // Armazena o ID do setInterval
let coresDisponiveis = ['red', 'blue', 'green', 'orange', 'purple', 'brown'];
let corAtual = 0;              // Índice da cor atual

// === CLASSE DO QUADRADO ===

/**
 * Classe que representa o quadrado do jogo
 * @param {number} largura - Largura do quadrado em pixels
 * @param {number} altura - Altura do quadrado em pixels  
 * @param {string} cor - Cor do quadrado
 * @param {number} x - Posição inicial X
 * @param {number} y - Posição inicial Y
 */
function Quadrado(largura, altura, cor, x, y) {
    // Propriedades do quadrado
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
    this.x = x;                // Posição horizontal
    this.y = y;                // Posição vertical
    this.velocidadeX = 0;      // Velocidade horizontal (pixels por frame)
    this.velocidadeY = 0;      // Velocidade vertical (pixels por frame)
    
    /**
     * Método para desenhar o quadrado no canvas
     */
    this.desenhar = function() {
        contexto.fillStyle = this.cor;
        contexto.fillRect(this.x, this.y, this.largura, this.altura);
        
        // Desenha uma borda preta para ficar mais visível
        contexto.strokeStyle = 'black';
        contexto.lineWidth = 2;
        contexto.strokeRect(this.x, this.y, this.largura, this.altura);
    };
    
    /**
     * Método para atualizar a posição do quadrado
     */
    this.atualizarPosicao = function() {
        // Atualiza posição baseada na velocidade
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        
        // === DETECÇÃO DE COLISÃO COM AS BORDAS ===
        
        // Parede esquerda
        if (this.x < 0) {
            this.x = 0;
            this.velocidadeX = -this.velocidadeX * 0.8; // Inverte e reduz velocidade
        }
        
        // Parede direita
        if (this.x + this.largura > canvas.width) {
            this.x = canvas.width - this.largura;
            this.velocidadeX = -this.velocidadeX * 0.8;
        }
        
        // Parede superior
        if (this.y < 0) {
            this.y = 0;
            this.velocidadeY = -this.velocidadeY * 0.8;
        }
        
        // Parede inferior
        if (this.y + this.altura > canvas.height) {
            this.y = canvas.height - this.altura;
            this.velocidadeY = -this.velocidadeY * 0.8;
        }
        
        // Aplica atrito para o quadrado eventualmente parar
        this.velocidadeX *= 0.99;
        this.velocidadeY *= 0.99;
        
        // Para velocidades muito pequenas para evitar movimento infinito
        if (Math.abs(this.velocidadeX) < 0.1) this.velocidadeX = 0;
        if (Math.abs(this.velocidadeY) < 0.1) this.velocidadeY = 0;
    };
}

// === FUNÇÕES PRINCIPAIS DO JOGO ===

/**
 * Inicializa o jogo quando a página carrega
 */
function iniciarJogo() {
    // Obter referência do canvas
    canvas = document.getElementById('gameCanvas');
    contexto = canvas.getContext('2d');
    
    // Criar o quadrado vermelho no centro do canvas
    const centroX = canvas.width / 2 - 15;  // -15 para centralizar (quadrado tem 30px)
    const centroY = canvas.height / 2 - 15;
    
    quadradoVermelho = new Quadrado(30, 30, 'red', centroX, centroY);
    
    // Iniciar o loop do jogo (atualiza 50 vezes por segundo)
    intervaloJogo = setInterval(loopPrincipal, 20);
    
    console.log('🎮 Jogo iniciado! Quadrado criado na posição:', centroX, centroY);
}

/**
 * Loop principal do jogo - executa continuamente
 */
function loopPrincipal() {
    if (!jogoRodando) return; // Se o jogo estiver pausado, não faz nada
    
    // 1. Limpar o canvas (apagar frame anterior)
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Atualizar posição do quadrado
    quadradoVermelho.atualizarPosicao();
    
    // 3. Desenhar o quadrado na nova posição
    quadradoVermelho.desenhar();
    
    // 4. Atualizar estatísticas na tela
    atualizarEstatisticas();
}

/**
 * Atualiza os valores mostrados na interface
 */
function atualizarEstatisticas() {
    document.getElementById('posX').textContent = Math.round(quadradoVermelho.x);
    document.getElementById('posY').textContent = Math.round(quadradoVermelho.y);
    document.getElementById('speedX').textContent = quadradoVermelho.velocidadeX.toFixed(1);
    document.getElementById('speedY').textContent = quadradoVermelho.velocidadeY.toFixed(1);
}

// === FUNÇÕES DE MOVIMENTO ===

/**
 * Move o quadrado na direção especificada
 * @param {string} direcao - 'cima', 'baixo', 'esquerda' ou 'direita'
 */
function moverPara(direcao) {
    const incrementoVelocidade = 2; // Quanto aumenta a velocidade a cada clique
    
    switch(direcao) {
        case 'cima':
            quadradoVermelho.velocidadeY -= incrementoVelocidade;
            console.log('⬆️ Movendo para cima. Nova velocidade Y:', quadradoVermelho.velocidadeY);
            break;
            
        case 'baixo':
            quadradoVermelho.velocidadeY += incrementoVelocidade;
            console.log('⬇️ Movendo para baixo. Nova velocidade Y:', quadradoVermelho.velocidadeY);
            break;
            
        case 'esquerda':
            quadradoVermelho.velocidadeX -= incrementoVelocidade;
            console.log('⬅️ Movendo para esquerda. Nova velocidade X:', quadradoVermelho.velocidadeX);
            break;
            
        case 'direita':
            quadradoVermelho.velocidadeX += incrementoVelocidade;
            console.log('➡️ Movendo para direita. Nova velocidade X:', quadradoVermelho.velocidadeX);
            break;
    }
}

// === FUNÇÕES DE CONTROLE DO JOGO ===

/**
 * Pausa ou retoma o jogo
 */
function pausarJogo() {
    jogoRodando = !jogoRodando;
    const botaoPause = document.getElementById('pauseBtn');
    
    if (jogoRodando) {
        botaoPause.textContent = '⏸️ Pausar';
        console.log('▶️ Jogo retomado');
    } else {
        botaoPause.textContent = '▶️ Continuar';
        console.log('⏸️ Jogo pausado');
    }
}

/**
 * Reinicia o jogo para o estado inicial
 */
function reiniciarJogo() {
    // Reposicionar quadrado no centro
    quadradoVermelho.x = canvas.width / 2 - 15;
    quadradoVermelho.y = canvas.height / 2 - 15;
    
    // Zerar velocidades
    quadradoVermelho.velocidadeX = 0;
    quadradoVermelho.velocidadeY = 0;
    
    // Garantir que o jogo está rodando
    jogoRodando = true;
    document.getElementById('pauseBtn').textContent = '⏸️ Pausar';
    
    console.log('🔄 Jogo reiniciado!');
}

/**
 * Altera a cor do quadrado
 */
function alterarCor() {
    corAtual = (corAtual + 1) % coresDisponiveis.length;
    quadradoVermelho.cor = coresDisponiveis[corAtual];
    console.log('🎨 Cor alterada para:', coresDisponiveis[corAtual]);
}

// === CONTROLES DE TECLADO ===

/**
 * Adiciona controle por teclado (WASD ou setas)
 */
document.addEventListener('keydown', function(evento) {
    switch(evento.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
            moverPara('cima');
            break;
        case 's':
        case 'arrowdown':
            moverPara('baixo');
            break;
        case 'a':
        case 'arrowleft':
            moverPara('esquerda');
            break;
        case 'd':
        case 'arrowright':
            moverPara('direita');
            break;
        case ' ': // Barra de espaço para pausar
            evento.preventDefault();
            pausarJogo();
            break;
        case 'r': // R para reiniciar
            reiniciarJogo();
            break;
        case 'c': // C para mudar cor
            alterarCor();
            break;
    }
});

// === INICIALIZAÇÃO ===

// Inicia o jogo quando a página terminar de carregar
window.addEventListener('load', iniciarJogo);

// Mensagem no console para os alunos
console.log('🎓 Bem-vindos ao jogo educativo!');
console.log('💡 Dicas:');
console.log('   - Use WASD ou setas do teclado para mover');
console.log('   - Pressione ESPAÇO para pausar');  
console.log('   - Pressione R para reiniciar');
console.log('   - Pressione C para mudar a cor');
console.log('   - Abra as ferramentas do desenvolvedor (F12) para ver mais detalhes!');