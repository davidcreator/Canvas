/* ===== CÓDIGO JAVASCRIPT ===== */

// ===== 1. VARIÁVEIS GLOBAIS =====
var meuQuadrado; // Armazena nosso objeto quadrado
var velocidadeGravidade = 0.05; // Controla a intensidade da gravidade

// ===== 2. FUNÇÃO PARA INICIAR O JOGO =====
// Esta função é chamada quando a página carrega
function iniciarJogo() {
    // Cria um novo quadrado: largura=30, altura=30, cor=vermelha, posição x=80, y=75
    meuQuadrado = new Componente(30, 30, "red", 80, 75);
    areaDoJogo.iniciar();
    console.log("🎮 Jogo iniciado com sucesso!");
}

// ===== 3. OBJETO PARA GERENCIAR A ÁREA DO JOGO =====
var areaDoJogo = {
    canvas: document.createElement("canvas"), // Cria o elemento canvas
    
    // Função para configurar e iniciar a área do jogo
    iniciar: function() {
        // Define as dimensões do canvas
        this.canvas.width = 480;  // Largura: 480 pixels
        this.canvas.height = 270; // Altura: 270 pixels
        
        // Obtém o contexto 2D para desenhar
        this.context = this.canvas.getContext("2d");
        
        // Adiciona o canvas à página
        document.body.appendChild(this.canvas);
        
        // Atualiza o jogo a cada 20 milissegundos (50 FPS)
        this.intervalo = setInterval(atualizarJogo, 20);
        console.log("🖼️ Canvas criado com dimensões: " + this.canvas.width + "x" + this.canvas.height);
    },
    
    // Função para parar o jogo
    parar: function() {
        clearInterval(this.intervalo);
        console.log("⏹️ Jogo pausado");
    },
    
    // Função para limpar a tela
    limpar: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// ===== 4. CONSTRUTOR PARA CRIAR COMPONENTES DO JOGO =====
function Componente(largura, altura, cor, posicaoX, posicaoY) {
    // Propriedades do componente
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
    this.x = posicaoX;        // Posição horizontal
    this.y = posicaoY;        // Posição vertical
    this.velocidadeX = 0;     // Velocidade horizontal
    this.velocidadeY = 0;     // Velocidade vertical
    this.gravidade = velocidadeGravidade;    // Força da gravidade
    this.aceleracaoGravidade = 0; // Aceleração causada pela gravidade

    // ===== MÉTODO: DESENHAR O COMPONENTE =====
    this.desenhar = function() {
        var ctx = areaDoJogo.context;
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    };

    // ===== MÉTODO: ATUALIZAR POSIÇÃO =====
    this.atualizarPosicao = function() {
        // Aplica a gravidade (aumenta a velocidade de queda)
        this.aceleracaoGravidade += this.gravidade;
        
        // Atualiza a posição baseada na velocidade
        this.x += this.velocidadeX;
        this.y += this.velocidadeY + this.aceleracaoGravidade;
        
        // Verifica se tocou o chão
        this.verificarColisaoChao();
    };

    // ===== MÉTODO: VERIFICAR COLISÃO COM O CHÃO =====
    this.verificarColisaoChao = function() {
        // Calcula a posição do chão (altura do canvas - altura do quadrado)
        var posicaoChao = areaDoJogo.canvas.height - this.altura;
        
        // Se o quadrado passou do chão, reposiciona-o no chão
        if (this.y > posicaoChao) {
            this.y = posicaoChao;
            this.aceleracaoGravidade = 0; // Para a aceleração quando toca o chão
            console.log("💥 Quadrado tocou o chão!");
        }
    };
}

// ===== 5. FUNÇÃO PRINCIPAL DO LOOP DO JOGO =====
function atualizarJogo() {
    // Limpa a tela
    areaDoJogo.limpar();
    
    // Atualiza a posição do quadrado
    meuQuadrado.atualizarPosicao();
    
    // Desenha o quadrado na nova posição
    meuQuadrado.desenhar();
}

// ===== 6. FUNÇÕES DE CONTROLE EXTRA (PARA INTERATIVIDADE) =====

// Função para reiniciar o jogo
function reiniciarJogo() {
    areaDoJogo.parar();
    // Reposiciona o quadrado na posição inicial
    meuQuadrado = new Componente(30, 30, "red", 80, 75);
    areaDoJogo.iniciar();
    console.log("🔄 Jogo reiniciado!");
}

// Função para alterar a velocidade da gravidade
function alterarVelocidadeGravidade() {
    velocidadeGravidade = velocidadeGravidade === 0.05 ? 0.1 : 0.05;
    if (meuQuadrado) {
        meuQuadrado.gravidade = velocidadeGravidade;
    }
    console.log("⚡ Gravidade alterada para: " + velocidadeGravidade);
}

// ===== 7. LOG INFORMATIVO =====
console.log("📚 ESTRUTURA DO CÓDIGO:");
console.log("1. Variáveis Globais - Armazenam objetos importantes");
console.log("2. Função iniciarJogo() - Configura o jogo inicial");
console.log("3. Objeto areaDoJogo - Gerencia o canvas e animação");
console.log("4. Construtor Componente() - Cria objetos do jogo");
console.log("5. Função atualizarJogo() - Loop principal do jogo");
console.log("6. Funções de controle - Interatividade extra");