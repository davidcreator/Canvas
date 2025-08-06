// ===============================================
// === CONFIGURAÇÕES DO JOGO ===
// ===============================================

// Configurações básicas do jogo
const CONFIG = {
    CANVAS_LARGURA: 600,      // Largura da tela do jogo
    CANVAS_ALTURA: 400,       // Altura da tela do jogo
    VELOCIDADE_MOVIMENTO: 3,   // Velocidade do quadrado (pixels por frame)
    FPS: 50                   // Frames por segundo (quantas vezes atualiza por segundo)
};

// Códigos das teclas do teclado
const TECLAS = {
    SETA_ESQUERDA: 37,   // ←
    SETA_CIMA: 38,       // ↑
    SETA_DIREITA: 39,    // →
    SETA_BAIXO: 40       // ↓
};

// ===============================================
// === VARIÁVEIS GLOBAIS ===
// ===============================================

let canvas;              // Elemento canvas do HTML
let contexto;           // Contexto 2D para desenhar no canvas
let quadradoJogador;    // Objeto que representa nosso quadrado
let teclasPressionadas = {}; // Objeto para controlar quais teclas estão pressionadas
let jogoAtivo = false;  // Controla se o jogo está rodando

// ===============================================
// === CLASSE DO QUADRADO (NOSSO PERSONAGEM) ===
// ===============================================

class Quadrado {
    // Construtor: cria um novo quadrado com as propriedades especificadas
    constructor(x, y, largura, altura, cor) {
        this.x = x;                    // Posição horizontal
        this.y = y;                    // Posição vertical
        this.largura = largura;        // Largura do quadrado
        this.altura = altura;          // Altura do quadrado
        this.cor = cor;                // Cor do quadrado
        this.velocidadeX = 0;          // Velocidade horizontal atual
        this.velocidadeY = 0;          // Velocidade vertical atual
        
        console.log(`🟥 Quadrado criado na posição (${x}, ${y})`);
    }
    
    // Método para atualizar a posição do quadrado
    atualizarPosicao() {
        // Move o quadrado baseado na velocidade atual
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        
        // Verifica os limites da tela (impede que o quadrado saia da tela)
        this.verificarLimites();
    }
    
    // Método para verificar se o quadrado não saiu dos limites da tela
    verificarLimites() {
        // Limite esquerdo
        if (this.x < 0) {
            this.x = 0;
        }
        
        // Limite direito
        if (this.x + this.largura > CONFIG.CANVAS_LARGURA) {
            this.x = CONFIG.CANVAS_LARGURA - this.largura;
        }
        
        // Limite superior
        if (this.y < 0) {
            this.y = 0;
        }
        
        // Limite inferior
        if (this.y + this.altura > CONFIG.CANVAS_ALTURA) {
            this.y = CONFIG.CANVAS_ALTURA - this.altura;
        }
    }
    
    // Método para desenhar o quadrado na tela
    desenhar() {
        // Define a cor de preenchimento
        contexto.fillStyle = this.cor;
        
        // Desenha um retângulo preenchido na posição atual
        contexto.fillRect(this.x, this.y, this.largura, this.altura);
        
        // Adiciona uma borda preta ao redor do quadrado
        contexto.strokeStyle = '#000000';
        contexto.lineWidth = 2;
        contexto.strokeRect(this.x, this.y, this.largura, this.altura);
    }
}

// ===============================================
// === FUNÇÕES DE CONTROLE DO JOGO ===
// ===============================================

// Função para inicializar o jogo
function iniciarJogo() {
    console.log('🎮 Iniciando o jogo...');
    
    // Pega o elemento canvas do HTML
    canvas = document.getElementById('gameCanvas');
    
    // Define as dimensões do canvas
    canvas.width = CONFIG.CANVAS_LARGURA;
    canvas.height = CONFIG.CANVAS_ALTURA;
    
    // Obtém o contexto 2D para desenhar
    contexto = canvas.getContext('2d');
    
    // Cria o quadrado do jogador no centro da tela
    const posicaoInicialX = CONFIG.CANVAS_LARGURA / 2 - 25; // Centralizado horizontalmente
    const posicaoInicialY = CONFIG.CANVAS_ALTURA / 2 - 25;  // Centralizado verticalmente
    
    quadradoJogador = new Quadrado(
        posicaoInicialX,    // Posição X
        posicaoInicialY,    // Posição Y
        50,                 // Largura
        50,                 // Altura
        '#FF4444'           // Cor (vermelho)
    );
    
    // Configura os controles do teclado
    configurarControles();
    
    // Inicia o loop principal do jogo
    jogoAtivo = true;
    loopPrincipalDoJogo();
    
    console.log('✅ Jogo iniciado com sucesso!');
}

// Função para configurar os controles do teclado
function configurarControles() {
    // Quando uma tecla é pressionada
    document.addEventListener('keydown', function(evento) {
        teclasPressionadas[evento.keyCode] = true;
        console.log(`⌨️ Tecla pressionada: ${evento.keyCode}`);
    });
    
    // Quando uma tecla é solta
    document.addEventListener('keyup', function(evento) {
        teclasPressionadas[evento.keyCode] = false;
        console.log(`⌨️ Tecla solta: ${evento.keyCode}`);
    });
}

// Função para processar os controles (movimento do quadrado)
function processarControles() {
    // Reseta a velocidade
    quadradoJogador.velocidadeX = 0;
    quadradoJogador.velocidadeY = 0;
    
    // Verifica cada tecla e define a velocidade correspondente
    if (teclasPressionadas[TECLAS.SETA_ESQUERDA]) {
        quadradoJogador.velocidadeX = -CONFIG.VELOCIDADE_MOVIMENTO; // Move para esquerda
    }
    
    if (teclasPressionadas[TECLAS.SETA_DIREITA]) {
        quadradoJogador.velocidadeX = CONFIG.VELOCIDADE_MOVIMENTO;  // Move para direita
    }
    
    if (teclasPressionadas[TECLAS.SETA_CIMA]) {
        quadradoJogador.velocidadeY = -CONFIG.VELOCIDADE_MOVIMENTO; // Move para cima
    }
    
    if (teclasPressionadas[TECLAS.SETA_BAIXO]) {
        quadradoJogador.velocidadeY = CONFIG.VELOCIDADE_MOVIMENTO;  // Move para baixo
    }
}

// Função para limpar a tela
function limparTela() {
    // Limpa todo o canvas (apaga tudo que foi desenhado)
    contexto.clearRect(0, 0, CONFIG.CANVAS_LARGURA, CONFIG.CANVAS_ALTURA);
    
    // Adiciona um fundo levemente colorido
    contexto.fillStyle = '#f8f9fa';
    contexto.fillRect(0, 0, CONFIG.CANVAS_LARGURA, CONFIG.CANVAS_ALTURA);
}

// Função principal que roda o jogo (loop do jogo)
function loopPrincipalDoJogo() {
    if (!jogoAtivo) return; // Para o loop se o jogo não estiver ativo
    
    // 1. Processar controles (verificar teclas pressionadas)
    processarControles();
    
    // 2. Atualizar posição do quadrado
    quadradoJogador.atualizarPosicao();
    
    // 3. Limpar a tela
    limparTela();
    
    // 4. Desenhar o quadrado na nova posição
    quadradoJogador.desenhar();
    
    // 5. Agendar a próxima atualização do jogo
    setTimeout(loopPrincipalDoJogo, 1000 / CONFIG.FPS);
}

// ===============================================
// === INICIALIZAÇÃO ===
// ===============================================

// Aguarda a página carregar completamente antes de iniciar o jogo
window.addEventListener('load', function() {
    console.log('📄 Página carregada, iniciando jogo em 1 segundo...');
    setTimeout(iniciarJogo, 1000); // Aguarda 1 segundo para iniciar
});