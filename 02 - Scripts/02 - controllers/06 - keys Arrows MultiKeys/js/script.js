// === CONFIGURAÇÕES DO JOGO ===
const CONFIG = {
    LARGURA_CANVAS: 600,
    ALTURA_CANVAS: 400,
    TAMANHO_QUADRADO: 40,
    VELOCIDADE_MOVIMENTO: 3,
    FPS: 60 // Frames por segundo
};

// === CÓDIGOS DAS TECLAS ===
const TECLAS = {
    SETA_ESQUERDA: 37,
    SETA_CIMA: 38,
    SETA_DIREITA: 39,
    SETA_BAIXO: 40
};

// === VARIÁVEIS GLOBAIS ===
let canvas;           // Elemento canvas do HTML
let contexto;         // Contexto 2D para desenhar
let jogador;          // Nosso quadrado vermelho
let teclasPress = {}; // Armazena quais teclas estão pressionadas
let jogoAtivo = false; // Controla se o jogo está rodando

// === CLASSE JOGADOR (Quadrado Vermelho) ===
class Jogador {
    constructor(x, y) {
        this.x = x;                           // Posição horizontal
        this.y = y;                           // Posição vertical
        this.largura = CONFIG.TAMANHO_QUADRADO;
        this.altura = CONFIG.TAMANHO_QUADRADO;
        this.velocidadeX = 0;                 // Velocidade horizontal
        this.velocidadeY = 0;                 // Velocidade vertical
        this.cor = '#e74c3c';                 // Cor vermelha
    }

    // Atualiza a posição do jogador
    atualizar() {
        // Reseta as velocidades
        this.velocidadeX = 0;
        this.velocidadeY = 0;

        // Verifica quais teclas estão pressionadas
        if (teclasPress[TECLAS.SETA_ESQUERDA]) {
            this.velocidadeX = -CONFIG.VELOCIDADE_MOVIMENTO;
        }
        if (teclasPress[TECLAS.SETA_DIREITA]) {
            this.velocidadeX = CONFIG.VELOCIDADE_MOVIMENTO;
        }
        if (teclasPress[TECLAS.SETA_CIMA]) {
            this.velocidadeY = -CONFIG.VELOCIDADE_MOVIMENTO;
        }
        if (teclasPress[TECLAS.SETA_BAIXO]) {
            this.velocidadeY = CONFIG.VELOCIDADE_MOVIMENTO;
        }

        // Atualiza a posição baseada na velocidade
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;

        // Impede que o quadrado saia da tela (colisão com bordas)
        this.manterNaTela();

        // Atualiza o painel de informações
        this.atualizarPainelInfo();
    }

    // Mantém o jogador dentro dos limites da tela
    manterNaTela() {
        // Borda esquerda
        if (this.x < 0) {
            this.x = 0;
        }
        // Borda direita
        if (this.x + this.largura > CONFIG.LARGURA_CANVAS) {
            this.x = CONFIG.LARGURA_CANVAS - this.largura;
        }
        // Borda superior
        if (this.y < 0) {
            this.y = 0;
        }
        // Borda inferior
        if (this.y + this.altura > CONFIG.ALTURA_CANVAS) {
            this.y = CONFIG.ALTURA_CANVAS - this.altura;
        }
    }

    // Desenha o jogador na tela
    desenhar() {
        // Sombra para dar profundidade
        contexto.shadowColor = 'rgba(0, 0, 0, 0.3)';
        contexto.shadowBlur = 5;
        contexto.shadowOffsetX = 2;
        contexto.shadowOffsetY = 2;

        // Desenha o quadrado principal
        contexto.fillStyle = this.cor;
        contexto.fillRect(this.x, this.y, this.largura, this.altura);

        // Remove a sombra
        contexto.shadowColor = 'transparent';

        // Desenha uma borda mais escura
        contexto.strokeStyle = '#c0392b';
        contexto.lineWidth = 2;
        contexto.strokeRect(this.x, this.y, this.largura, this.altura);

        // Desenha um brilho no centro
        contexto.fillStyle = '#ff6b6b';
        contexto.fillRect(this.x + 5, this.y + 5, this.largura - 10, this.altura - 10);
    }

    // Atualiza as informações mostradas na tela
    atualizarPainelInfo() {
        document.getElementById('posX').textContent = Math.round(this.x);
        document.getElementById('posY').textContent = Math.round(this.y);
        document.getElementById('velX').textContent = this.velocidadeX;
        document.getElementById('velY').textContent = this.velocidadeY;
    }
}

// === FUNÇÃO PARA INICIALIZAR O JOGO ===
function iniciarJogo() {
    console.log('🎮 Iniciando o jogo...');
    
    // Pega o elemento canvas do HTML
    canvas = document.getElementById('gameCanvas');
    contexto = canvas.getContext('2d');

    // Cria o jogador no centro da tela
    const centroX = (CONFIG.LARGURA_CANVAS - CONFIG.TAMANHO_QUADRADO) / 2;
    const centroY = (CONFIG.ALTURA_CANVAS - CONFIG.TAMANHO_QUADRADO) / 2;
    jogador = new Jogador(centroX, centroY);

    // Configura os eventos de teclado
    configurarEventosTeclado();

    // Inicia o loop principal do jogo
    jogoAtivo = true;
    loopPrincipal();

    console.log('✅ Jogo iniciado com sucesso!');
}

// === CONFIGURAÇÃO DOS EVENTOS DE TECLADO ===
function configurarEventosTeclado() {
    // Quando uma tecla é pressionada
    canvas.addEventListener('keydown', function(evento) {
        teclasPress[evento.keyCode] = true;
        evento.preventDefault(); // Impede comportamentos padrão
    });

    // Quando uma tecla é solta
    canvas.addEventListener('keyup', function(evento) {
        teclasPress[evento.keyCode] = false;
        evento.preventDefault();
    });

    // Foca no canvas para capturar eventos de teclado
    canvas.focus();
    
    // Re-foca quando clicado
    canvas.addEventListener('click', function() {
        canvas.focus();
    });
}

// === FUNÇÃO PARA LIMPAR A TELA ===
function limparTela() {
    // Limpa todo o canvas
    contexto.clearRect(0, 0, CONFIG.LARGURA_CANVAS, CONFIG.ALTURA_CANVAS);
}

// === LOOP PRINCIPAL DO JOGO ===
function loopPrincipal() {
    if (!jogoAtivo) return;

    // 1. Limpa a tela
    limparTela();

    // 2. Atualiza a lógica do jogo
    jogador.atualizar();

    // 3. Desenha tudo na tela
    jogador.desenhar();

    // 4. Agenda a próxima execução (60 FPS)
    setTimeout(() => {
        requestAnimationFrame(loopPrincipal);
    }, 1000 / CONFIG.FPS);
}

// === INICIA O JOGO QUANDO A PÁGINA CARREGAR ===
window.addEventListener('load', iniciarJogo);

// === FUNÇÃO PARA PARAR/REINICIAR O JOGO ===
function toggleJogo() {
    jogoAtivo = !jogoAtivo;
    if (jogoAtivo) {
        loopPrincipal();
    }
}

// Adiciona evento para pausar/despausar com espaço
document.addEventListener('keydown', function(evento) {
    if (evento.code === 'Space') {
        toggleJogo();
        evento.preventDefault();
    }
});