// ========================================
// 1. VARIÁVEIS GLOBAIS DO JOGO
// ========================================

// Array que armazena todas as bolinhas do jogo
var gameBolinhas = [];

// Variável para controlar se a gravidade está ativada
var gravityEnabled = true;

// Cores disponíveis para as bolinhas
var availableColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'];

// ========================================
// 2. OBJETO QUE CONTROLA A ÁREA DO JOGO
// ========================================

var areaDoJogo = {
    // Elemento canvas onde o jogo será desenhado
    canvas: document.createElement("canvas"),
    
    // Função para inicializar o jogo
    start: function() {
        // Define o tamanho do canvas
        this.canvas.width = 600;
        this.canvas.height = 400;
        
        // Obtém o contexto 2D para desenhar
        this.context = this.canvas.getContext("2d");
        
        // Adiciona o canvas ao body da página
        document.body.appendChild(this.canvas);
        
        // Inicia o loop do jogo (atualiza a cada 20ms = 50 FPS)
        this.interval = setInterval(atualizarJogo, 20);
        
        console.log("🎮 Jogo iniciado! Canvas: " + this.canvas.width + "x" + this.canvas.height);
    },
    
    // Função para parar o jogo
    stop: function() {
        clearInterval(this.interval);
        console.log("⏹️ Jogo parado!");
    },
    
    // Função para limpar o canvas
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// ========================================
// 3. CLASSE CONSTRUTURA DAS BOLINHAS
// ========================================

function Bolinha(largura, altura, cor, posicaoX, posicaoY, forcaSalto) {
    // Propriedades de tamanho e posição
    this.width = largura;
    this.height = altura;
    this.x = posicaoX;
    this.y = posicaoY;
    
    // Propriedades de movimento
    this.speedX = Math.random() * 6 - 3; // Velocidade horizontal (-3 a +3)
    this.speedY = Math.random() * 6 - 3; // Velocidade vertical (-3 a +3)
    
    // Propriedades de física
    this.gravity = 0.15;        // Força da gravidade
    this.gravitySpeed = 0;      // Velocidade acumulada pela gravidade
    this.bounce = forcaSalto;   // Força do salto (0 a 1)
    this.color = cor;           // Cor da bolinha

    // ========================================
    // 3.1 MÉTODO PARA DESENHAR A BOLINHA
    // ========================================
    this.desenhar = function() {
        let ctx = areaDoJogo.context;
        
        // Desenha a bolinha como um retângulo colorido
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Adiciona uma borda para melhor visualização
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    };

    // ========================================
    // 3.2 MÉTODO PARA CALCULAR NOVA POSIÇÃO
    // ========================================
    this.calcularNovaPosicao = function() {
        // Aplica a gravidade apenas se estiver ativada
        if (gravityEnabled) {
            this.gravitySpeed += this.gravity;
        }
        
        // Atualiza a posição baseada na velocidade
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        
        // Verifica colisões com as bordas
        this.verificarColisaoBordas();
    };

    // ========================================
    // 3.3 MÉTODO PARA VERIFICAR COLISÕES COM BORDAS
    // ========================================
    this.verificarColisaoBordas = function() {
        // Calcula os limites do canvas
        let limiteBaixo = areaDoJogo.canvas.height - this.height;
        let limiteDireita = areaDoJogo.canvas.width - this.width;
        let limiteEsquerda = 0;
        let limiteCima = 0;

        // Colisão com a parte inferior ou superior
        if (this.y > limiteBaixo) {
            this.y = limiteBaixo;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            console.log("💥 Bolinha " + this.color + " bateu no chão! Bounce: " + this.bounce);
        } else if (this.y < limiteCima) {
            this.y = limiteCima;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }

        // Colisão com as laterais
        if (this.x > limiteDireita) {
            this.x = limiteDireita;
            this.speedX = -(this.speedX * this.bounce);
            console.log("💥 Bolinha " + this.color + " bateu na parede direita!");
        } else if (this.x < limiteEsquerda) {
            this.x = limiteEsquerda;
            this.speedX = -(this.speedX * this.bounce);
            console.log("💥 Bolinha " + this.color + " bateu na parede esquerda!");
        }
    };

    // ========================================
    // 3.4 MÉTODO PARA VERIFICAR COLISÃO COM OUTRAS BOLINHAS
    // ========================================
    this.verificarColisaoCom = function(outraBolinha) {
        // Coordenadas desta bolinha
        let minhaEsquerda = this.x;
        let minhaDireita = this.x + this.width;
        let meuTopo = this.y;
        let meuFundo = this.y + this.height;
        
        // Coordenadas da outra bolinha
        let outraEsquerda = outraBolinha.x;
        let outraDireita = outraBolinha.x + outraBolinha.width;
        let outroTopo = outraBolinha.y;
        let outroFundo = outraBolinha.y + outraBolinha.height;

        // Verifica se há sobreposição (colisão)
        let houveColisao = true;
        if ((meuFundo < outroTopo) ||
            (meuTopo > outroFundo) ||
            (minhaDireita < outraEsquerda) ||
            (minhaEsquerda > outraDireita)) {
            houveColisao = false;
        }
        
        return houveColisao;
    };
}

// ========================================
// 4. FUNÇÃO PARA INICIAR O JOGO
// ========================================

function startGame() {
    console.log("🚀 Iniciando o jogo...");
    
    // Cria 4 bolinhas com propriedades diferentes
    gameBolinhas.push(new Bolinha(25, 25, "red", 100, 100, 0.6));      // Vermelha: bounce médio
    gameBolinhas.push(new Bolinha(25, 25, "blue", 200, 100, 0.8));     // Azul: bounce alto
    gameBolinhas.push(new Bolinha(25, 25, "green", 300, 100, 0.4));    // Verde: bounce baixo
    gameBolinhas.push(new Bolinha(25, 25, "yellow", 400, 100, 1.0));   // Amarela: bounce máximo
    
    // Inicia a área do jogo
    areaDoJogo.start();
    
    console.log("✅ Jogo iniciado com " + gameBolinhas.length + " bolinhas!");
}

// ========================================
// 5. FUNÇÃO PRINCIPAL DO LOOP DO JOGO
// ========================================

function atualizarJogo() {
    // Limpa o canvas
    areaDoJogo.clear();

    // Para cada bolinha do jogo
    for (let i = 0; i < gameBolinhas.length; i++) {
        let bolinha = gameBolinhas[i];

        // Verifica colisões com outras bolinhas
        for (let j = 0; j < gameBolinhas.length; j++) {
            if (i != j) { // Não verifica colisão consigo mesma
                let outraBolinha = gameBolinhas[j];
                
                if (bolinha.verificarColisaoCom(outraBolinha)) {
                    // Calcula o bounce médio entre as duas bolinhas
                    let bounceMedia = (bolinha.bounce + outraBolinha.bounce) / 2;
                    
                    // Inverte e reduz a velocidade baseada no bounce
                    bolinha.speedX = -(bolinha.speedX * bounceMedia);
                    bolinha.speedY = -(bolinha.speedY * bounceMedia);
                    outraBolinha.speedX = -(outraBolinha.speedX * bounceMedia);
                    outraBolinha.speedY = -(outraBolinha.speedY * bounceMedia);
                    
                    console.log("💥 Colisão entre " + bolinha.color + " e " + outraBolinha.color + 
                                "! Bounce médio: " + bounceMedia.toFixed(2));
                }
            }
        }

        // Atualiza posição e desenha a bolinha
        bolinha.calcularNovaPosicao();
        bolinha.desenhar();
    }
}

// ========================================
// 6. FUNÇÕES AUXILIARES PARA OS CONTROLES
// ========================================

// Reinicia o jogo
function resetGame() {
    console.log("🔄 Reiniciando o jogo...");
    areaDoJogo.stop();
    gameBolinhas = [];
    
    // Remove o canvas anterior
    if (areaDoJogo.canvas.parentNode) {
        areaDoJogo.canvas.parentNode.removeChild(areaDoJogo.canvas);
    }
    
    // Recria o canvas
    areaDoJogo.canvas = document.createElement("canvas");
    
    // Reinicia o jogo
    startGame();
}

// Adiciona uma bolinha aleatória
function addRandomBall() {
    let randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    let randomBounce = Math.random(); // Bounce aleatório entre 0 e 1
    let randomX = Math.random() * (areaDoJogo.canvas.width - 30);
    let randomY = Math.random() * (areaDoJogo.canvas.height - 30);
    
    gameBolinhas.push(new Bolinha(25, 25, randomColor, randomX, randomY, randomBounce));
    
    console.log("➕ Nova bolinha adicionada! Cor: " + randomColor + 
                ", Bounce: " + randomBounce.toFixed(2));
}

// Alterna a gravidade
function toggleGravity() {
    gravityEnabled = !gravityEnabled;
    console.log("🌍 Gravidade " + (gravityEnabled ? "ativada" : "desativada"));
    
    // Se desativar a gravidade, zera a velocidade acumulada
    if (!gravityEnabled) {
        gameBolinhas.forEach(function(bolinha) {
            bolinha.gravitySpeed = 0;
        });
    }
}

// ========================================
// 7. MENSAGEM DE BOAS-VINDAS
// ========================================

console.log("🎮 Jogo de Bolinhas Saltitantes carregado!");
console.log("📖 Observe como diferentes valores de 'bounce' afetam o comportamento das bolinhas:");
console.log("   🔴 Vermelha (0.6) - Bounce moderado");
console.log("   🔵 Azul (0.8) - Bounce alto"); 
console.log("   🟢 Verde (0.4) - Bounce baixo");
console.log("   🟡 Amarela (1.0) - Bounce máximo");