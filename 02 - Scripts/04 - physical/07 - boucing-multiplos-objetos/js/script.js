// === VARIÁVEIS GLOBAIS ===
var myGamePieces = []; // Array que armazena todos os objetos do jogo
var gameRunning = false; // Controla se o jogo está rodando

// === OBJETO DA ÁREA DO JOGO ===
var myGameArea = {
    canvas: document.createElement("canvas"), // Cria o elemento canvas
    
    // Função para inicializar a área do jogo
    start: function() {
        console.log("🎮 Iniciando área do jogo...");
        
        // Configurações do canvas
        this.canvas.width = 600;  // Largura aumentada para melhor visualização
        this.canvas.height = 400; // Altura aumentada
        this.context = this.canvas.getContext("2d");
        
        // Insere o canvas na página
        document.querySelector('.container').appendChild(this.canvas);
        
        // Inicia o loop de atualização (60 FPS aproximadamente)
        this.interval = setInterval(updateGameArea, 16);
        gameRunning = true;
        
        // Atualiza os botões
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
    },
    
    // Função para parar o jogo
    stop: function() {
        console.log("⏹️ Parando simulação...");
        clearInterval(this.interval);
        gameRunning = false;
        
        // Atualiza os botões
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
    },
    
    // Função para limpar o canvas
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// === FUNÇÃO CONSTRUTORA PARA COMPONENTES ===
function component(width, height, color, x, y, bounce) {
    console.log(`🟦 Criando componente ${color} com bounce: ${bounce}`);
    
    // Propriedades físicas do objeto
    this.width = width;        // Largura
    this.height = height;      // Altura
    this.x = x;               // Posição horizontal
    this.y = y;               // Posição vertical inicial
    this.speedX = 0;          // Velocidade horizontal
    this.speedY = 0;          // Velocidade vertical
    this.gravity = 0.15;      // Força da gravidade (aumentada)
    this.gravitySpeed = 0;    // Velocidade causada pela gravidade
    this.bounce = bounce;     // Fator de salto (0 a 1)
    this.color = color;       // Cor do objeto

    // === MÉTODO PARA DESENHAR O COMPONENTE ===
    this.update = function() {
        let ctx = myGameArea.context;
        
        // Desenha o retângulo
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Adiciona uma borda para melhor visualização
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Adiciona texto com o valor do bounce
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            this.bounce.toString(), 
            this.x + this.width/2, 
            this.y + this.height/2 + 4
        );
    };

    // === MÉTODO PARA CALCULAR NOVA POSIÇÃO ===
    this.newPos = function() {
        // Aplica a gravidade
        this.gravitySpeed += this.gravity;
        
        // Atualiza posições
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        
        // Verifica colisão com o fundo
        this.hitBottom();
    };

    // === MÉTODO PARA DETECTAR COLISÃO COM O CHÃO ===
    this.hitBottom = function() {
        // Calcula a posição do "chão" para este objeto
        let rockbottom = myGameArea.canvas.height - this.height;
        
        // Verifica se o objeto atingiu o chão
        if (this.y > rockbottom) {
            this.y = rockbottom; // Reposiciona no chão
            
            // Aplica o efeito bounce (inverte a velocidade e multiplica pelo fator de salto)
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            
            console.log(`💥 ${this.color} bateu no chão! Bounce: ${this.bounce}`);
        }
    };
}

// === FUNÇÃO PARA INICIAR O JOGO ===
function startGame() {
    console.log("🚀 Iniciando jogo...");
    
    // Limpa objetos anteriores
    myGamePieces = [];
    
    // Cria os componentes com diferentes propriedades de bounce
    // Parâmetros: largura, altura, cor, posição X, posição Y, fator de bounce
    myGamePieces.push(new component(40, 40, "red", 100, 50, 0.6));      // Bounce médio-baixo
    myGamePieces.push(new component(40, 40, "blue", 200, 80, 0.8));     // Bounce alto
    myGamePieces.push(new component(40, 40, "green", 300, 30, 0.4));    // Bounce baixo
    myGamePieces.push(new component(40, 40, "yellow", 400, 60, 1.0));   // Bounce perfeito
    
    // Inicia a área do jogo
    myGameArea.start();
}

// === FUNÇÃO PARA PARAR O JOGO ===
function stopGame() {
    myGameArea.stop();
}

// === FUNÇÃO PARA REINICIAR O JOGO ===
function resetGame() {
    console.log("🔄 Reiniciando jogo...");
    
    // Para o jogo atual
    if (gameRunning) {
        myGameArea.stop();
    }
    
    // Remove o canvas atual se existir
    if (myGameArea.canvas.parentNode) {
        myGameArea.canvas.parentNode.removeChild(myGameArea.canvas);
    }
    
    // Recria o canvas
    myGameArea.canvas = document.createElement("canvas");
    
    // Limpa os objetos
    myGamePieces = [];
    
    // Reabilita o botão de start
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
}

// === FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO ===
function updateGameArea() {
    // Limpa a tela
    myGameArea.clear();
    
    // Atualiza cada objeto do jogo
    for (let i = 0; i < myGamePieces.length; i++) {
        myGamePieces[i].newPos();  // Calcula nova posição
        myGamePieces[i].update();  // Desenha o objeto
    }
}

// === INICIALIZAÇÃO AUTOMÁTICA ===
// O jogo não inicia automaticamente para dar controle ao professor/aluno
console.log("📖 Simulador carregado! Clique em 'Iniciar Simulação' para começar.");