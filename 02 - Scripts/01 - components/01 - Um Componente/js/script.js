/* ==============================================
    VARIÁVEIS GLOBAIS - Elementos do Jogo
    ============================================== */

// Variáveis para armazenar os objetos do jogo
let jogador;          // Peça controlada pelo jogador (quadrado vermelho)
let areaDoJogo;       // Objeto que gerencia toda a área do jogo

/* ==============================================
    FUNÇÃO PRINCIPAL - Inicia o Jogo
    ============================================== */

function iniciarJogo() {
    console.log("🚀 Iniciando o jogo...");
    
    // 1. Primeiro criamos a área do jogo
    areaDoJogo = new AreaDoJogo();
    areaDoJogo.inicializar();
    
    // 2. Depois criamos o componente do jogo
    //    Sintaxe: new Componente(largura, altura, cor, posição_x, posição_y)
    jogador = new Componente(30, 30, "#e74c3c", 10, 120);     // Quadrado vermelho
    
    console.log("✅ Jogo iniciado com sucesso!");
}

/* ==============================================
    CLASSE: ÁREA DO JOGO - Gerencia o Canvas
    ============================================== */

function AreaDoJogo() {
    // Propriedades da área do jogo
    this.canvas = document.getElementById("gameCanvas");
    this.contexto = null;
    this.intervalo = null;
    
    // Método para inicializar a área do jogo
    this.inicializar = function() {
        console.log("🎨 Configurando o canvas...");
        
        // Define o tamanho do canvas
        this.canvas.width = 600;   // Largura em pixels
        this.canvas.height = 400;  // Altura em pixels
        
        // Obtém o contexto 2D para desenhar
        this.contexto = this.canvas.getContext("2d");
        
        // Inicia o loop principal do jogo (atualiza 50 vezes por segundo)
        this.intervalo = setInterval(atualizarJogo, 20); // 20ms = 50 FPS
        
        console.log("✅ Canvas configurado: " + this.canvas.width + "x" + this.canvas.height);
    };
    
    // Método para limpar a tela
    this.limparTela = function() {
        // Limpa toda a área do canvas
        this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}

/* ==============================================
    CLASSE: COMPONENTE - Elementos do Jogo
============================================== */

function Componente(largura, altura, cor, posicaoX, posicaoY) {
    // Propriedades do componente
    this.largura = largura;      // Largura do componente
    this.altura = altura;        // Altura do componente
    this.cor = cor;             // Cor do componente
    this.x = posicaoX;          // Posição horizontal
    this.y = posicaoY;          // Posição vertical
    
    // Método para desenhar o componente na tela
    this.desenhar = function() {
        // Obtém o contexto do canvas
        let ctx = areaDoJogo.contexto;
        
        // Define a cor de preenchimento
        ctx.fillStyle = this.cor;
        
        // Desenha o retângulo na posição especificada
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        
        // Adiciona uma borda preta para melhor visualização
        ctx.strokeStyle = "#2c3e50";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.largura, this.altura);
    };
    
    // Método para atualizar o componente (aqui podemos adicionar movimento futuramente)
    this.atualizar = function() {
        // Por enquanto, apenas desenha o componente
        this.desenhar();
        
        // DICA PARA PROFESSORES: Aqui vocês podem adicionar:
        // - Movimento automático: this.x += velocidade;
        // - Detecção de colisão
        // - Animações
    };
}

/* ==============================================
    LOOP PRINCIPAL - Atualiza o Jogo Constantemente
============================================== */

function atualizarJogo() {
    // 1. Limpa a tela (remove o frame anterior)
    areaDoJogo.limparTela();
    
    // 2. Atualiza e desenha o componente
    jogador.atualizar();      // Desenha o jogador
    
    // DICA: Aqui você pode adicionar mais lógica do jogo:
    // - Verificar colisões
    // - Atualizar pontuação
    // - Verificar condições de vitória/derrota
}

/* ==============================================
    INICIALIZAÇÃO - Executa quando a página carrega
============================================== */

// Aguarda a página carregar completamente antes de iniciar o jogo
window.addEventListener('load', function() {
    console.log("📄 Página carregada!");
    iniciarJogo();
});

/* ==============================================
    PRÓXIMOS PASSOS PARA EXPANSÃO:
    
    1. MOVIMENTO:
        - Adicionar controles de teclado
        - Mover o jogador com as setas
    
    2. FÍSICA:
        - Adicionar gravidade
        - Pulos e colisões
    
    3. INTERATIVIDADE:
        - Sistema de pontuação
        - Múltiplos níveis
        - Sons e efeitos
    
    4. VISUAL:
        - Sprites (imagens)
        - Animações
        - Partículas
============================================== */