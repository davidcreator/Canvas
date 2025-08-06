// ====================================
// VARIÁVEIS GLOBAIS DO JOGO
// ====================================

let jogador;              // O quadrado que o usuário controla
let areaDoJogo;           // Objeto que gerencia o canvas e a lógica do jogo

// ====================================
// CONFIGURAÇÕES DO JOGO
// ====================================

const CONFIGURACOES = {
    LARGURA_CANVAS: 600,        // Largura da tela do jogo
    ALTURA_CANVAS: 400,         // Altura da tela do jogo
    FPS: 50,                    // Frames por segundo (velocidade do jogo)
    TAMANHO_JOGADOR: 25,        // Tamanho do quadrado do jogador
    VELOCIDADE_MOVIMENTO: 2,     // Velocidade de movimento
    VELOCIDADE_ROTACAO: 3       // Velocidade de rotação em graus
};

// ====================================
// CÓDIGOS DAS TECLAS DO TECLADO
// ====================================

const TECLAS = {
    SETA_ESQUERDA: 37,
    SETA_CIMA: 38,
    SETA_DIREITA: 39,
    SETA_BAIXO: 40
};

// ====================================
// CLASSE JOGADOR (o quadrado vermelho)
// ====================================

class Jogador {
    constructor(x, y) {
        this.largura = CONFIGURACOES.TAMANHO_JOGADOR;
        this.altura = CONFIGURACOES.TAMANHO_JOGADOR;
        this.x = x;                    // Posição horizontal
        this.y = y;                    // Posição vertical
        this.angulo = 0;               // Direção que está olhando (em radianos)
        this.velocidade = 0;           // Velocidade atual de movimento
        this.velocidadeRotacao = 0;    // Velocidade atual de rotação
        this.cor = "#e74c3c";          // Cor vermelha
    }

    // Método para atualizar a posição do jogador
    atualizarPosicao() {
        // Atualiza o ângulo baseado na velocidade de rotação
        this.angulo += this.velocidadeRotacao * Math.PI / 180;

        // Calcula nova posição usando trigonometria
        // sin e cos nos ajudam a mover na direção que o quadrado está olhando
        this.x += this.velocidade * Math.sin(this.angulo);
        this.y -= this.velocidade * Math.cos(this.angulo); // Y negativo porque canvas cresce para baixo

        // Impede que o jogador saia da tela (colisão com bordas)
        this.manterDentroDaTela();
        
        // Atualiza informações na tela
        this.atualizarInfoTela();
    }

    // Mantém o jogador dentro dos limites da tela
    manterDentroDaTela() {
        const margem = this.largura / 2;
        
        if (this.x < margem) this.x = margem;
        if (this.x > CONFIGURACOES.LARGURA_CANVAS - margem) {
            this.x = CONFIGURACOES.LARGURA_CANVAS - margem;
        }
        if (this.y < margem) this.y = margem;
        if (this.y > CONFIGURACOES.ALTURA_CANVAS - margem) {
            this.y = CONFIGURACOES.ALTURA_CANVAS - margem;
        }
    }

    // Atualiza as informações mostradas na tela
    atualizarInfoTela() {
        document.getElementById('posX').textContent = Math.round(this.x);
        document.getElementById('posY').textContent = Math.round(this.y);
        document.getElementById('angulo').textContent = Math.round(this.angulo * 180 / Math.PI);
        document.getElementById('velocidade').textContent = Math.round(this.velocidade * 10) / 10;
    }

    // Método para desenhar o jogador na tela
    desenhar(contexto) {
        // Salva o estado atual do contexto
        contexto.save();
        
        // Move a origem do desenho para a posição do jogador
        contexto.translate(this.x, this.y);
        
        // Rotaciona o contexto de acordo com o ângulo do jogador
        contexto.rotate(this.angulo);
        
        // Define a cor de preenchimento
        contexto.fillStyle = this.cor;
        
        // Desenha o retângulo centralizado na origem
        contexto.fillRect(
            -this.largura / 2,    // X (metade da largura para a esquerda)
            -this.altura / 2,     // Y (metade da altura para cima)
            this.largura,         // Largura
            this.altura           // Altura
        );
        
        // Adiciona uma pequena linha para mostrar a direção
        contexto.strokeStyle = "#2c3e50";
        contexto.lineWidth = 2;
        contexto.beginPath();
        contexto.moveTo(0, -this.altura / 2);
        contexto.lineTo(0, -this.altura / 2 - 8);
        contexto.stroke();
        
        // Restaura o estado original do contexto
        contexto.restore();
    }

    // Métodos para controlar o movimento
    moverParaFrente() {
        this.velocidade = CONFIGURACOES.VELOCIDADE_MOVIMENTO;
    }

    moverParaTras() {
        this.velocidade = -CONFIGURACOES.VELOCIDADE_MOVIMENTO;
    }

    girarEsquerda() {
        this.velocidadeRotacao = -CONFIGURACOES.VELOCIDADE_ROTACAO;
    }

    girarDireita() {
        this.velocidadeRotacao = CONFIGURACOES.VELOCIDADE_ROTACAO;
    }

    pararMovimento() {
        this.velocidade = 0;
        this.velocidadeRotacao = 0;
    }
}

// ====================================
// OBJETO PRINCIPAL DO JOGO
// ====================================

areaDoJogo = {
    // Propriedades do canvas
    canvas: document.getElementById('gameCanvas'),
    contexto: null,
    intervalId: null,
    teclasPrecionadas: {},           // Objeto para armazenar quais teclas estão pressionadas

    // Método para inicializar o jogo
    iniciar() {
        // Obtém o contexto 2D do canvas para desenhar
        this.contexto = this.canvas.getContext('2d');
        
        // Configura os event listeners para as teclas
        this.configurarControles();
        
        // Cria o jogador no centro da tela
        jogador = new Jogador(
            CONFIGURACOES.LARGURA_CANVAS / 2,
            CONFIGURACOES.ALTURA_CANVAS / 2
        );
        
        // Inicia o loop principal do jogo
        this.intervalId = setInterval(
            () => this.atualizarJogo(), 
            1000 / CONFIGURACOES.FPS
        );
        
        console.log("🎮 Jogo iniciado! Use as setas do teclado para jogar.");
    },

    // Configura os controles do teclado
    configurarControles() {
        // Detecta quando uma tecla é pressionada
        window.addEventListener('keydown', (evento) => {
            evento.preventDefault(); // Impede ações padrão do navegador
            this.teclasPrecionadas[evento.keyCode] = true;
        });

        // Detecta quando uma tecla é solta
        window.addEventListener('keyup', (evento) => {
            this.teclasPrecionadas[evento.keyCode] = false;
        });
    },

    // Processa os controles baseado nas teclas pressionadas
    processarControles() {
        // Para o movimento primeiro
        jogador.pararMovimento();

        // Verifica cada tecla e aplica o movimento correspondente
        if (this.teclasPrecionadas[TECLAS.SETA_CIMA]) {
            jogador.moverParaFrente();
        }
        if (this.teclasPrecionadas[TECLAS.SETA_BAIXO]) {
            jogador.moverParaTras();
        }
        if (this.teclasPrecionadas[TECLAS.SETA_ESQUERDA]) {
            jogador.girarEsquerda();
        }
        if (this.teclasPrecionadas[TECLAS.SETA_DIREITA]) {
            jogador.girarDireita();
        }
    },

    // Limpa toda a tela
    limparTela() {
        this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // Método principal que é executado a cada frame
    atualizarJogo() {
        // 1. Limpa a tela
        this.limparTela();
        
        // 2. Processa os controles do jogador
        this.processarControles();
        
        // 3. Atualiza a posição do jogador
        jogador.atualizarPosicao();
        
        // 4. Desenha o jogador na nova posição
        jogador.desenhar(this.contexto);
    },

    // Para o jogo
    parar() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log("⏹️ Jogo pausado");
        }
    }
};

// ====================================
// INICIALIZAÇÃO DO JOGO
// ====================================

// Aguarda a página carregar completamente antes de iniciar o jogo
window.addEventListener('load', () => {
    console.log("📚 Exemplo de Jogo em JavaScript - Versão Educativa");
    console.log("🎯 Objetivo: Demonstrar conceitos básicos de programação de jogos");
    areaDoJogo.iniciar();
});

// Adiciona função para pausar/retomar com a tecla Space (bônus)
window.addEventListener('keydown', (evento) => {
    if (evento.code === 'Space') {
        evento.preventDefault();
        if (areaDoJogo.intervalId) {
            areaDoJogo.parar();
        } else {
            areaDoJogo.iniciar();
        }
    }
});