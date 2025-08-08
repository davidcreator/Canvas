/* =============================================== --*/
/*--            CÓDIGO JAVASCRIPT                  --*/
/* =============================================== --*/
// ============================================
//        1. VARIÁVEIS GLOBAIS DO JOGO
// ============================================

var meuObjetoCaindo;        // O quadrado vermelho que cai
var tipoGravidade = "luna"; // Tipo de gravidade (lunar ou terrestre)
var gameRunning = false;    // Controla se o jogo está rodando

// ============================================
//        2. OBJETO PARA GERENCIAR O CANVAS
// ============================================

var areaDoJogo = {
    // Cria o elemento canvas
    canvas: document.createElement("canvas"),
    
    // Função para inicializar o canvas
    start: function() {
        // Define o tamanho do canvas
        this.canvas.width = 600;
        this.canvas.height = 400;
        
        // Obtém o contexto 2D para desenhar
        this.context = this.canvas.getContext("2d");
        
        // Adiciona o canvas à página
        document.body.appendChild(this.canvas);
        
        // Inicia o loop do jogo (atualiza a cada 20ms = 50 FPS)
        this.interval = setInterval(atualizarJogo, 20);
    },
    
    // Função para parar o jogo
    stop: function() {
        clearInterval(this.interval);
        gameRunning = false;
    },
    
    // Função para limpar a tela
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// ============================================
//        3. CONSTRUTOR DE OBJETOS DO JOGO
// ============================================

function ObjetoDoJogo(largura, altura, cor, posicaoX, posicaoY) {
    // Propriedades físicas do objeto
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
    this.x = posicaoX;          // Posição horizontal
    this.y = posicaoY;          // Posição vertical
    
    // Propriedades de movimento
    this.velocidadeX = 0;       // Velocidade horizontal
    this.velocidadeY = 0;       // Velocidade vertical
    this.velocidadeGravidade = 0; // Velocidade acumulada pela gravidade
    
    // Configurações de gravidade
    this.gravidadeLunar = 0.08;     // Gravidade da Lua
    this.gravidadeTerrestre = 0.5;   // Gravidade da Terra
    
    // Função para desenhar o objeto na tela
    this.desenhar = function() {
        var ctx = areaDoJogo.context;
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        
        // Desenha informações sobre o objeto
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText("Objeto em queda livre", this.x - 20, this.y - 10);
    };
    
    // Função para calcular nova posição do objeto
    this.calcularNovaPosicao = function() {
        // Escolhe o tipo de gravidade
        var gravidade = (tipoGravidade === "luna") ? 
            this.gravidadeLunar : this.gravidadeTerrestre;
        
        // Aplica a gravidade (acelera a queda)
        this.velocidadeGravidade += gravidade;
        
        // Atualiza a posição
        this.x += this.velocidadeX;
        this.y += this.velocidadeY + this.velocidadeGravidade;
        
        // Verifica se bateu no chão
        this.verificarColisaoComChao();
        
        // Atualiza informações na tela
        this.atualizarInformacoes();
    };
    
    // Função para verificar se o objeto bateu no chão
    this.verificarColisaoComChao = function() {
        var alturaDoChao = areaDoJogo.canvas.height - this.altura;
        
        if (this.y >= alturaDoChao) {
            this.y = alturaDoChao;           // Para no chão
            this.velocidadeGravidade = 0;    // Para a velocidade
        }
    };
    
    // Função para atualizar as informações mostradas
    this.atualizarInformacoes = function() {
        document.getElementById("positionInfo").textContent = 
            `Posição do objeto: x=${Math.round(this.x)}, y=${Math.round(this.y)}`;
        
        document.getElementById("speedInfo").textContent = 
            `Velocidade de queda: ${Math.round(this.velocidadeGravidade * 100) / 100}`;
    };
}

// ============================================
//        4. FUNÇÕES PRINCIPAIS DO JOGO
// ============================================

// Função para iniciar o jogo
function startGame() {
    if (!gameRunning) {
        // Cria o objeto que vai cair (quadrado vermelho)
        meuObjetoCaindo = new ObjetoDoJogo(40, 40, "red", 80, 75);
        
        // Inicia a área do jogo
        areaDoJogo.start();
        gameRunning = true;
        
        console.log("🎮 Jogo iniciado! Observe a queda do objeto.");
    }
}

// Função para reiniciar o jogo
function resetGame() {
    if (gameRunning) {
        areaDoJogo.stop();
        
        // Remove o canvas antigo se existir
        var oldCanvas = document.querySelector("canvas");
        if (oldCanvas) {
            oldCanvas.remove();
        }
    }
    
    // Reinicia o jogo
    startGame();
    console.log("🔄 Jogo reiniciado!");
}

// Função para alternar entre gravidade lunar e terrestre
function toggleGravity() {
    if (tipoGravidade === "luna") {
        tipoGravidade = "terrestre";
        document.getElementById("gravityInfo").textContent = 
            "Gravidade atual: Terra (gravidade normal)";
        console.log("🌍 Mudou para gravidade terrestre!");
    } else {
        tipoGravidade = "luna";
        document.getElementById("gravityInfo").textContent = 
            "Gravidade atual: Lua (1/6 da gravidade terrestre)";
        console.log("🌙 Mudou para gravidade lunar!");
    }
    
    // Reinicia para aplicar a nova gravidade
    resetGame();
}

// Função que atualiza o jogo continuamente
function atualizarJogo() {
    // Limpa a tela
    areaDoJogo.clear();
    
    // Desenha o fundo com informações
    desenharFundo();
    
    // Atualiza e desenha o objeto
    meuObjetoCaindo.calcularNovaPosicao();
    meuObjetoCaindo.desenhar();
}

// Função para desenhar informações no fundo
function desenharFundo() {
    var ctx = areaDoJogo.context;
    
    // Desenha linha do chão
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, areaDoJogo.canvas.height - 1);
    ctx.lineTo(areaDoJogo.canvas.width, areaDoJogo.canvas.height - 1);
    ctx.stroke();
    
    // Adiciona texto informativo
    ctx.fillStyle = "#7f8c8d";
    ctx.font = "14px Arial";
    ctx.fillText("Simulação de Gravidade - Observe como o objeto acelera!", 10, 25);
    ctx.fillText(`Tipo: ${tipoGravidade === "luna" ? "Gravidade Lunar" : "Gravidade Terrestre"}`, 10, 45);
}

// ============================================
//        5. EXPLICAÇÕES PARA OS ALUNOS
// ============================================

console.log(`
📚 EXPLICAÇÃO DO CÓDIGO PARA ALUNOS:

1. CANVAS: É como uma "tela" onde desenhamos os objetos
2. GRAVIDADE: Força que puxa objetos para baixo
3. VELOCIDADE: Quão rápido o objeto se move
4. LOOP DO JOGO: Atualiza a tela 50 vezes por segundo
5. COLISÃO: Detecta quando o objeto toca o chão

🔬 CONCEITOS DE FÍSICA:
- Na Lua: gravidade é 1/6 da Terra (objetos caem mais devagar)
- Na Terra: gravidade normal (objetos caem mais rápido)
- Aceleração: velocidade aumenta com o tempo devido à gravidade

💡 DESAFIOS PARA PRATICAR:
1. Mude a cor do objeto
2. Adicione mais objetos
3. Crie diferentes tipos de gravidade
4. Adicione som quando o objeto bate no chão
`);