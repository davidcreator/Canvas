/* ========================================
    VARIÁVEIS GLOBAIS - DADOS DO JOGO
======================================== */

// Arrays para guardar os elementos do jogo
var jogadorPecas = [];    // Peças controláveis pelo jogador
var obstaculos = [];      // Obstáculos fixos no jogo
var gameSpeed = 2;        // Velocidade do jogo
var gameRunning = false;  // Se o jogo está rodando

/* ========================================
    OBJETO PRINCIPAL - ÁREA DO JOGO
======================================== */

var areaDoJogo = {
    // Propriedades da área do jogo
    canvas: null,      // Elemento canvas
    contexto: null,    // Contexto 2D para desenhar
    intervalo: null,   // Timer para animação
    
    // Função para inicializar o jogo
    iniciar: function() {
        console.log("🎮 Iniciando a área do jogo...");
        
        // Cria o elemento canvas (tela de desenho)
        this.canvas = document.createElement("canvas");
        this.canvas.width = 800;   // Largura da tela
        this.canvas.height = 400;  // Altura da tela
        
        // Obtém o contexto 2D (ferramenta para desenhar)
        this.contexto = this.canvas.getContext("2d");
        
        // Adiciona o canvas na página
        document.body.appendChild(this.canvas);
        
        console.log("✅ Canvas criado com sucesso!");
    },
    
    // Função para limpar a tela
    limpar: function() {
        // Apaga tudo na tela
        this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    // Função para iniciar a animação
    iniciarAnimacao: function() {
        if (!gameRunning) {
            // Chama a função de atualização a cada 20 milissegundos (50 FPS)
            this.intervalo = setInterval(atualizarJogo, 20);
            gameRunning = true;
            console.log("🎬 Animação iniciada!");
        }
    },
    
    // Função para parar a animação
    pararAnimacao: function() {
        if (gameRunning && this.intervalo) {
            clearInterval(this.intervalo);
            gameRunning = false;
            console.log("⏹️ Animação parada!");
        }
    }
};

/* ========================================
    CLASSE COMPONENTE - ELEMENTOS DO JOGO
======================================== */

function Componente(largura, altura, cor, posicaoX, posicaoY, tipo) {
    // Propriedades físicas do componente
    this.largura = largura;
    this.altura = altura;
    this.x = posicaoX;
    this.y = posicaoY;
    this.cor = cor;
    this.tipo = tipo || "peça"; // "peça" ou "obstáculo"
    
    // Propriedades de movimento
    this.velocidadeX = 0;
    this.velocidadeY = 0;
    
    // Função para desenhar o componente na tela
    this.desenhar = function() {
        var ctx = areaDoJogo.contexto;
        
        // Define a cor
        ctx.fillStyle = this.cor;
        
        // Desenha um retângulo na posição especificada
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        
        // Adiciona uma borda para melhor visualização
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.largura, this.altura);
    };
    
    // Função para atualizar a posição do componente
    this.atualizar = function() {
        // Move o componente baseado na velocidade
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        
        // Verifica se saiu da tela e reposiciona
        if (this.x > areaDoJogo.canvas.width) {
            this.x = -this.largura; // Volta pelo lado esquerdo
        }
        
        // Desenha o componente na nova posição
        this.desenhar();
    };
    
    // Função para verificar colisão com outro componente
    this.colideCom = function(outroComponente) {
        var minhaEsquerda = this.x;
        var minhaDireita = this.x + this.largura;
        var meuTopo = this.y;
        var meuFundo = this.y + this.altura;
        
        var outraEsquerda = outroComponente.x;
        var outraDireita = outroComponente.x + outroComponente.largura;
        var outroTopo = outroComponente.y;
        var outroFundo = outroComponente.y + outroComponente.altura;
        
        // Verifica se há sobreposição
        return !(minhaEsquerda > outraDireita || 
                minhaDireita < outraEsquerda || 
                meuTopo > outroFundo || 
                meuFundo < outroTopo);
    };
}

/* ========================================
    FUNÇÕES PRINCIPAIS DO JOGO
======================================== */

// Função para iniciar o jogo
function startGame() {
    console.log("🚀 Iniciando o jogo...");
    
    // Inicializa a área do jogo
    areaDoJogo.iniciar();
    
    // Limpa arrays anteriores
    jogadorPecas = [];
    obstaculos = [];
    
    // Cria as peças do jogador
    criarPecasDoJogador();
    
    // Cria os obstáculos
    criarObstaculos();
    
    // Inicia a animação
    areaDoJogo.iniciarAnimacao();
    
    console.log("✅ Jogo iniciado com sucesso!");
}

// Função para parar o jogo
function stopGame() {
    areaDoJogo.pararAnimacao();
}

// Função para criar as peças do jogador
function criarPecasDoJogador() {
    console.log("👾 Criando peças do jogador...");
    
    // Cria uma peça vermelha (jogador principal)
    var jogadorPrincipal = new Componente(40, 40, "#FF4444", 50, 180, "jogador");
    jogadorPrincipal.velocidadeX = gameSpeed;
    jogadorPecas.push(jogadorPrincipal);
    
    // Cria uma peça azul
    var jogadorSecundario = new Componente(35, 35, "#4444FF", 50, 250, "jogador");
    jogadorSecundario.velocidadeX = gameSpeed * 1.5;
    jogadorPecas.push(jogadorSecundario);
    
    console.log(`✅ ${jogadorPecas.length} peças criadas!`);
}

// Função para criar obstáculos
function criarObstaculos() {
    console.log("🚧 Criando obstáculos...");
    
    // Cria um obstáculo preto horizontal
    var obstaculoHorizontal = new Componente(15, 300, "#333333", 400, 50, "obstáculo");
    obstaculos.push(obstaculoHorizontal);
    
    // Cria um obstáculo verde vertical
    var obstaculoVertical = new Componente(200, 15, "#228B22", 300, 200, "obstáculo");
    obstaculos.push(obstaculoVertical);
    
    console.log(`✅ ${obstaculos.length} obstáculos criados!`);
}

// Função principal que atualiza o jogo a cada frame
function atualizarJogo() {
    // Limpa a tela
    areaDoJogo.limpar();
    
    // Atualiza e desenha todas as peças do jogador
    jogadorPecas.forEach(function(peca, index) {
        peca.atualizar();
        
        // Verifica colisão com obstáculos
        obstaculos.forEach(function(obstaculo) {
            if (peca.colideCom(obstaculo)) {
                console.log(`💥 Colisão detectada! Peça ${index + 1} colidiu com obstáculo!`);
                // Aqui você pode adicionar efeitos de colisão
                peca.cor = "#FF8888"; // Muda cor temporariamente
            }
        });
    });
    
    // Desenha todos os obstáculos
    obstaculos.forEach(function(obstaculo) {
        obstaculo.desenhar();
    });
    
    // Desenha informações na tela
    desenharInformacoes();
}

// Função para desenhar informações na tela
function desenharInformacoes() {
    var ctx = areaDoJogo.contexto;
    
    // Configura o texto
    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    
    // Mostra informações
    ctx.fillText(`Peças: ${jogadorPecas.length}`, 10, 25);
    ctx.fillText(`Obstáculos: ${obstaculos.length}`, 10, 45);
    ctx.fillText(`Velocidade: ${gameSpeed}`, 10, 65);
    ctx.fillText("Status: " + (gameRunning ? "Rodando" : "Parado"), 10, 85);
}

/* ========================================
    FUNÇÕES INTERATIVAS PARA OS ALUNOS
======================================== */

// Adiciona uma nova peça aleatória
function addNewPiece() {
    if (!areaDoJogo.canvas) {
        alert("⚠️ Inicie o jogo primeiro!");
        return;
    }
    
    // Cores aleatórias
    var cores = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
    var corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    
    // Posição Y aleatória
    var yAleatorio = Math.random() * (areaDoJogo.canvas.height - 50);
    
    // Cria nova peça
    var novaPeca = new Componente(30, 30, corAleatoria, 10, yAleatorio, "jogador");
    novaPeca.velocidadeX = gameSpeed + Math.random() * 2;
    
    jogadorPecas.push(novaPeca);
    console.log(`➕ Nova peça adicionada! Total: ${jogadorPecas.length}`);
}

// Muda a velocidade do jogo
function changeSpeed() {
    gameSpeed = gameSpeed >= 5 ? 1 : gameSpeed + 1;
    
    // Atualiza velocidade de todas as peças
    jogadorPecas.forEach(function(peca) {
        peca.velocidadeX = gameSpeed + Math.random();
    });
    
    console.log(`⚡ Velocidade alterada para: ${gameSpeed}`);
}

/* ========================================
    CÓDIGO EDUCATIVO - EXPLICAÇÕES
======================================== */

// Função que explica conceitos para os alunos
function explicarConceitos() {
    console.log(`
    📚 CONCEITOS IMPORTANTES:
    
    1. CANVAS: É como uma tela em branco onde podemos desenhar
    2. CONTEXT 2D: É o "pincel" que usamos para desenhar no canvas
    3. SETINTERVAL: Função que executa código repetidamente (animação)
    4. OBJETOS: Estruturas que guardam propriedades e funções relacionadas
    5. ARRAYS: Listas que guardam múltiplos elementos
    6. COLISÃO: Verificar se dois objetos estão se tocando
    
    💡 DICA: Abra o Console do navegador (F12) para ver as mensagens!
    `);
}

// Chama a explicação quando a página carregar
window.onload = function() {
    explicarConceitos();
};