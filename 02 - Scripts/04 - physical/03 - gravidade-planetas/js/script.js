/* ===== CÓDIGO JAVASCRIPT - LÓGICA DA SIMULAÇÃO ===== */

// ===== VARIÁVEIS GLOBAIS =====

// Array que armazena todos os planetas/objetos da simulação
var planetas = [];

// Variável para controlar se a simulação está rodando
var simulacaoAtiva = false;

// Variável para armazenar o intervalo da animação
var intervaloAnimacao;

// ===== OBJETO PARA GERENCIAR A ÁREA DO JOGO =====

var areaJogo = {
    canvas: null,
    contexto: null,
    
    // Função para inicializar o canvas
    inicializar: function() {
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = 900;  // Largura aumentada para acomodar mais planetas
        this.canvas.height = 400; // Altura aumentada
        this.contexto = this.canvas.getContext("2d");
    },
    
    // Função para limpar o canvas
    limpar: function() {
        this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    // Função para iniciar a animação
    iniciarAnimacao: function() {
        if (!simulacaoAtiva) {
            simulacaoAtiva = true;
            intervaloAnimacao = setInterval(atualizarSimulacao, 16); // ~60 FPS
        }
    },
    
    // Função para parar a animação
    pararAnimacao: function() {
        simulacaoAtiva = false;
        clearInterval(intervaloAnimacao);
    }
};

// ===== CONSTRUTOR PARA OS PLANETAS =====

function Planeta(largura, altura, nome, cor, posicaoX, posicaoY, gravidade) {
    // Propriedades básicas do planeta
    this.largura = largura;
    this.altura = altura;
    this.nome = nome;
    this.posicaoX = posicaoX;
    this.posicaoY = posicaoY;
    this.posicaoInicialY = posicaoY; // Guarda a posição inicial para reset
    this.cor = cor;
    this.gravidade = gravidade;
    this.velocidadeQueda = 0; // Velocidade atual de queda
    
    // Função para desenhar o planeta na tela
    this.desenhar = function() {
        var ctx = areaJogo.contexto;
        
        // Desenha o quadrado do planeta
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.posicaoX, this.posicaoY, this.largura, this.altura);
        
        // Desenha uma borda para destacar
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.posicaoX, this.posicaoY, this.largura, this.altura);
        
        // Desenha o nome do planeta acima dele
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.nome, this.posicaoX + this.largura/2, this.posicaoY - 15);
        
        // Desenha a gravidade abaixo do nome
        ctx.font = "10px Arial";
        ctx.fillText(this.gravidade + "x", this.posicaoX + this.largura/2, this.posicaoY - 5);
    };
    
    // Função para atualizar a posição do planeta (aplicar gravidade)
    this.atualizarPosicao = function() {
        // Aumenta a velocidade de queda baseada na gravidade
        this.velocidadeQueda += this.gravidade * 0.3; // Multiplicador para ajustar velocidade
        
        // Move o planeta para baixo
        this.posicaoY += this.velocidadeQueda;
        
        // Verifica se bateu no chão
        this.verificarColisaoChao();
    };
    
    // Função para verificar se o planeta bateu no chão
    this.verificarColisaoChao = function() {
        var chao = areaJogo.canvas.height - this.altura - 10; // 10px de margem do chão
        
        if (this.posicaoY >= chao) {
            this.posicaoY = chao;
            this.velocidadeQueda = 0; // Para o movimento quando bate no chão
        }
    };
    
    // Função para resetar a posição do planeta
    this.resetar = function() {
        this.posicaoY = this.posicaoInicialY;
        this.velocidadeQueda = 0;
    };
}

// ===== FUNÇÃO PARA CRIAR TODOS OS PLANETAS =====

function criarPlanetas() {
    planetas = []; // Limpa o array
    
    // Dados dos planetas: [nome, cor, gravidade_relativa_terra]
    var dadosPlanetas = [
        ["Mercúrio", "#666666", 0.38],
        ["Vênus", "#FFC649", 0.91], 
        ["Terra", "#6B93D6", 1.00],
        ["Marte", "#C1440E", 0.38],
        ["Júpiter", "#D8CA9D", 2.34],
        ["Saturno", "#FAD5A5", 1.06],
        ["Urano", "#4FD0E7", 0.92],
        ["Netuno", "#4B70DD", 1.19]
    ];
    
    // Cria cada planeta com espaçamento adequado
    for (var i = 0; i < dadosPlanetas.length; i++) {
        var nome = dadosPlanetas[i][0];
        var cor = dadosPlanetas[i][1];
        var gravidade = dadosPlanetas[i][2];
        
        // Calcula posição X com espaçamento uniforme
        var posicaoX = 50 + (i * 100); // 100px de espaçamento entre planetas
        var posicaoY = 50; // Todos começam na mesma altura
        
        // Cria e adiciona o planeta ao array
        planetas.push(new Planeta(40, 40, nome, cor, posicaoX, posicaoY, gravidade));
    }
}

// ===== FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO =====

function atualizarSimulacao() {
    // Limpa a tela
    areaJogo.limpar();
    
    // Desenha uma linha representando o "chão"
    var ctx = areaJogo.contexto;
    ctx.strokeStyle = "#4CAF50";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, areaJogo.canvas.height - 10);
    ctx.lineTo(areaJogo.canvas.width, areaJogo.canvas.height - 10);
    ctx.stroke();
    
    // Atualiza e desenha todos os planetas
    for (var i = 0; i < planetas.length; i++) {
        planetas[i].atualizarPosicao();
        planetas[i].desenhar();
    }
}

// ===== FUNÇÕES DE CONTROLE =====

function iniciarSimulacao() {
    areaJogo.inicializar();
    criarPlanetas();
    areaJogo.iniciarAnimacao();
}

function reiniciarSimulacao() {
    // Para a simulação atual
    areaJogo.pararAnimacao();
    
    // Reseta todos os planetas
    for (var i = 0; i < planetas.length; i++) {
        planetas[i].resetar();
    }
    
    // Reinicia a simulação
    areaJogo.iniciarAnimacao();
}

function pausarSimulacao() {
    if (simulacaoAtiva) {
        areaJogo.pararAnimacao();
    } else {
        areaJogo.iniciarAnimacao();
    }
}

// ===== INICIALIZAÇÃO AUTOMÁTICA =====

// Quando a página carregar completamente, inicia a simulação
window.onload = function() {
    iniciarSimulacao();
};