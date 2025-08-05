// ===== VARIÁVEIS GLOBAIS =====
let meuQuadrado;    // Variável que vai armazenar nosso quadrado
let areaDoJogo;     // Variável que vai controlar a área do jogo

// ===== CONFIGURAÇÕES DO JOGO =====
const LARGURA_CANVAS = 480;     // Largura da área do jogo
const ALTURA_CANVAS = 270;      // Altura da área do jogo
const VELOCIDADE = 2;           // Velocidade do movimento (pixels por frame)
const FPS = 50;                 // Frames por segundo (quantas vezes redesenha por segundo)

// ===== CLASSE PARA CRIAR O QUADRADO =====
function QuadradoJogavel(largura, altura, cor, posicaoX, posicaoY) {
    // Propriedades do quadrado
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
    this.x = posicaoX;              // Posição horizontal
    this.y = posicaoY;              // Posição vertical
    this.velocidadeX = 0;           // Velocidade horizontal (0 = parado)
    this.velocidadeY = 0;           // Velocidade vertical (0 = parado)

    // Método para desenhar o quadrado na tela
    this.desenhar = function() {
        const contexto = areaDoJogo.canvas.getContext("2d");
        contexto.fillStyle = this.cor;
        contexto.fillRect(this.x, this.y, this.largura, this.altura);
    };

    // Método para calcular a nova posição do quadrado
    this.mover = function() {
        // Atualiza a posição baseada na velocidade
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;

        // Impede que o quadrado saia da tela (colisão com as bordas)
        if (this.x < 0) this.x = 0;  // Borda esquerda
        if (this.x > LARGURA_CANVAS - this.largura) {
            this.x = LARGURA_CANVAS - this.largura;  // Borda direita
        }
        if (this.y < 0) this.y = 0;  // Borda superior
        if (this.y > ALTURA_CANVAS - this.altura) {
            this.y = ALTURA_CANVAS - this.altura;  // Borda inferior
        }

        // Atualiza o placar na tela
        document.getElementById('posX').textContent = Math.round(this.x);
        document.getElementById('posY').textContent = Math.round(this.y);
    };
}

// ===== OBJETO QUE CONTROLA A ÁREA DO JOGO =====
areaDoJogo = {
    canvas: null,           // Referência para o elemento canvas
    intervalo: null,        // Referência para o timer do jogo

    // Método para inicializar o jogo
    iniciar: function() {
        // Pega o canvas que já existe no HTML
        this.canvas = document.getElementById('gameCanvas');
        
        // Inicia o loop principal do jogo
        // setInterval executa uma função repetidamente a cada X milissegundos
        this.intervalo = setInterval(atualizarJogo, 1000/FPS);
        
        console.log("🎮 Jogo iniciado! Canvas:", this.canvas.width + "x" + this.canvas.height);
    },

    // Método para limpar a tela (apagar tudo)
    limpar: function() {
        const contexto = this.canvas.getContext("2d");
        contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// ===== FUNÇÃO PRINCIPAL DO JOGO =====
function iniciarJogo() {
    console.log("🚀 Iniciando o jogo...");
    
    // Cria o quadrado vermelho
    // Parâmetros: largura, altura, cor, posição X, posição Y
    meuQuadrado = new QuadradoJogavel(30, 30, "red", 10, 120);
    
    // Inicia a área do jogo
    areaDoJogo.iniciar();
    
    console.log("✅ Jogo iniciado com sucesso!");
}

// ===== LOOP PRINCIPAL DO JOGO =====
// Esta função é chamada 50 vezes por segundo para criar a animação
function atualizarJogo() {
    // 1. Limpa a tela (apaga o quadrado na posição anterior)
    areaDoJogo.limpar();
    
    // 2. Calcula a nova posição do quadrado
    meuQuadrado.mover();
    
    // 3. Desenha o quadrado na nova posição
    meuQuadrado.desenhar();
}

// ===== FUNÇÕES DE CONTROLE (MOVIMENTO) =====
function moverParaCima() {
    meuQuadrado.velocidadeY = -VELOCIDADE;  // Velocidade negativa = sobe
    meuQuadrado.velocidadeX = 0;            // Para o movimento horizontal
    console.log("⬆️ Movendo para cima");
}

function moverParaBaixo() {
    meuQuadrado.velocidadeY = VELOCIDADE;   // Velocidade positiva = desce
    meuQuadrado.velocidadeX = 0;            // Para o movimento horizontal
    console.log("⬇️ Movendo para baixo");
}

function moverParaEsquerda() {
    meuQuadrado.velocidadeX = -VELOCIDADE;  // Velocidade negativa = esquerda
    meuQuadrado.velocidadeY = 0;            // Para o movimento vertical
    console.log("⬅️ Movendo para esquerda");
}

function moverParaDireita() {
    meuQuadrado.velocidadeX = VELOCIDADE;   // Velocidade positiva = direita
    meuQuadrado.velocidadeY = 0;            // Para o movimento vertical
    console.log("➡️ Movendo para direita");
}

function pararMovimento() {
    meuQuadrado.velocidadeX = 0;            // Para movimento horizontal
    meuQuadrado.velocidadeY = 0;            // Para movimento vertical
    console.log("⏹️ Movimento parado");
}

// ===== INICIAR O JOGO QUANDO A PÁGINA CARREGAR =====
window.onload = function() {
    console.log("📄 Página carregada, iniciando jogo...");
    iniciarJogo();
};