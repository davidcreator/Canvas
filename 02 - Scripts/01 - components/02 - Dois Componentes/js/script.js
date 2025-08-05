// ====== VARIÁVEIS GLOBAIS ======
// Estas variáveis podem ser acessadas por todas as funções

var jogador;           // Vai guardar nosso quadrado vermelho (jogador)
var obstaculo;         // Vai guardar nosso quadrado azul (obstáculo)
var areaDoJogo;        // Vai controlar toda a área do jogo
var jogoRodando = false; // Controla se o jogo está ativo

// ====== OBJETO QUE CONTROLA A ÁREA DO JOGO ======
areaDoJogo = {
    // Propriedades (variáveis do objeto)
    canvas: null,      // Vai guardar nosso elemento canvas
    contexto: null,    // Vai guardar o contexto 2D para desenhar
    intervalo: null,   // Vai controlar a animação do jogo
    
    // Método para inicializar o jogo
    inicializar: function() {
        console.log("🎯 Iniciando área do jogo...");
        
        // Cria um novo elemento canvas
        this.canvas = document.createElement("canvas");
        
        // Define o tamanho do canvas
        this.canvas.width = 600;   // 600 pixels de largura
        this.canvas.height = 400;  // 400 pixels de altura
        
        // Pega o contexto 2D (usado para desenhar)
        this.contexto = this.canvas.getContext("2d");
        
        // Adiciona o canvas na página
        document.querySelector('.container').appendChild(this.canvas);
        
        // Inicia o loop de animação (atualiza 50 vezes por segundo)
        this.intervalo = setInterval(atualizarJogo, 20);
        
        console.log("✅ Área do jogo criada com sucesso!");
    },
    
    // Método para limpar o canvas a cada frame
    limpar: function() {
        // clearRect limpa uma área retangular do canvas
        // (x, y, largura, altura) - limpa todo o canvas
        this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    // Método para parar o jogo
    parar: function() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
    }
};

// ====== CONSTRUTOR DE COMPONENTES (PEÇAS DO JOGO) ======
// Esta é uma "fábrica" de objetos - cria quadrados coloridos
function Componente(largura, altura, cor, posicaoX, posicaoY) {
    console.log(`🔧 Criando componente: ${cor} (${largura}x${altura}) na posição (${posicaoX}, ${posicaoY})`);
    
    // Propriedades do componente
    this.largura = largura;     // Largura do quadrado
    this.altura = altura;       // Altura do quadrado
    this.cor = cor;            // Cor do quadrado
    this.x = posicaoX;         // Posição horizontal (esquerda para direita)
    this.y = posicaoY;         // Posição vertical (cima para baixo)
    
    // Método para desenhar o componente na tela
    this.desenhar = function() {
        // Pega o contexto do canvas
        var ctx = areaDoJogo.contexto;
        
        // Define a cor de preenchimento
        ctx.fillStyle = this.cor;
        
        // Desenha um retângulo preenchido
        // fillRect(x, y, largura, altura)
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    };
    
    // Método para mover o componente (exemplo de movimento simples)
    this.mover = function() {
        // Por enquanto, só move o jogador para a direita lentamente
        if (this.cor === "red") {
            this.x += 0.5; // Move 0.5 pixels para a direita
            
            // Se sair da tela, volta para o início
            if (this.x > areaDoJogo.canvas.width) {
                this.x = -this.largura;
            }
        }
    };
}

// ====== FUNÇÕES PRINCIPAIS DO JOGO ======

// Função chamada quando clicamos em "Iniciar Jogo"
function iniciarJogo() {
    console.log("🎮 Iniciando o jogo...");
    
    // Verifica se o jogo já está rodando
    if (jogoRodando) {
        console.log("⚠️ O jogo já está rodando!");
        return;
    }
    
    // Inicializa a área do jogo
    areaDoJogo.inicializar();
    
    // Cria o jogador (quadrado vermelho)
    // Componente(largura, altura, cor, x, y)
    jogador = new Componente(40, 40, "red", 50, 180);
    
    // Cria o obstáculo (quadrado azul)
    obstaculo = new Componente(60, 60, "blue", 350, 200);
    
    jogoRodando = true;
    console.log("✅ Jogo iniciado com sucesso!");
}

// Função para parar o jogo
function pararJogo() {
    console.log("⏹️ Parando o jogo...");
    
    if (!jogoRodando) {
        console.log("⚠️ O jogo não está rodando!");
        return;
    }
    
    areaDoJogo.parar();
    jogoRodando = false;
    
    console.log("✅ Jogo parado!");
}

// ====== LOOP PRINCIPAL DO JOGO ======
// Esta função é chamada 50 vezes por segundo (a cada 20ms)
function atualizarJogo() {
    // 1. Limpa a tela
    areaDoJogo.limpar();
    
    // 2. Move os componentes
    if (jogador) jogador.mover();
    if (obstaculo) obstaculo.mover();
    
    // 3. Desenha todos os componentes na nova posição
    if (jogador) jogador.desenhar();
    if (obstaculo) obstaculo.desenhar();
}

// ====== MENSAGENS NO CONSOLE ======
console.log("📚 Script carregado! Pronto para começar.");
console.log("🔍 Abra as ferramentas de desenvolvedor (F12) para ver mais detalhes.");
console.log("💡 Dica: Clique em 'Iniciar Jogo' para ver a magia acontecer!");
