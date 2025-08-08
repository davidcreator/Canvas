/* === JAVASCRIPT - LÓGICA DO JOGO === */

// VARIÁVEIS GLOBAIS
var myGamePieces = []; // Array que armazena todas as bolas do jogo
var gameRunning = false; // Controla se o jogo está rodando

// OBJETO QUE CONTROLA A ÁREA DO JOGO
var myGameArea = {
    canvas: document.getElementById("gameCanvas"), // Referência ao canvas
    
    // Função para inicializar a área do jogo
    start: function() {
        // Define as dimensões do canvas
        this.canvas.width = 600;
        this.canvas.height = 400;
        
        // Obtém o contexto 2D para desenhar
        this.context = this.canvas.getContext("2d");
        
        // Inicia o loop de atualização do jogo (50 FPS)
        this.interval = setInterval(updateGameArea, 20);
        gameRunning = true;
    },
    
    // Função para parar o jogo
    stop: function() {
        clearInterval(this.interval);
        gameRunning = false;
    },
    
    // Função para limpar o canvas
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// FUNÇÃO CONSTRUTORA PARA CRIAR BOLAS
function component(width, height, color, x, y, bounce) {
    // PROPRIEDADES DA BOLA
    this.width = width;           // Largura da bola
    this.height = height;         // Altura da bola
    this.x = x;                   // Posição X (horizontal)
    this.y = y;                   // Posição Y (vertical)
    this.speedX = Math.random() * 4 - 2; // Velocidade horizontal aleatória
    this.speedY = Math.random() * 2 + 1;  // Velocidade vertical inicial
    this.gravity = 0.2;           // Força da gravidade
    this.gravitySpeed = 0;        // Velocidade causada pela gravidade
    this.bounce = bounce;         // Propriedade de salto (0 a 1)
    
    // MÉTODO PARA DESENHAR A BOLA NA TELA
    this.update = function() {
        let ctx = myGameArea.context;
        
        // Desenha a bola como um círculo
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Adiciona um brilho na bola para efeito visual
        ctx.beginPath();
        ctx.arc(this.x + this.width/3, this.y + this.height/3, this.width/6, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fill();
    };
    
    // MÉTODO PARA CALCULAR A NOVA POSIÇÃO DA BOLA
    this.newPos = function() {
        // Aplica a gravidade
        this.gravitySpeed += this.gravity;
        
        // Atualiza as posições
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        
        // Verifica colisões com as bordas
        this.hitBoundaries();
    };
    
    // MÉTODO PARA VERIFICAR COLISÕES COM AS BORDAS
    this.hitBoundaries = function() {
        // Calcula os limites do canvas
        let bottom = myGameArea.canvas.height - this.height;
        let right = myGameArea.canvas.width - this.width;
        let left = 0;
        let top = 0;
        
        // COLISÃO COM O CHÃO OU TETO
        if (this.y >= bottom) {
            this.y = bottom;
            // Inverte a velocidade e aplica o bounce
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        } else if (this.y <= top) {
            this.y = top;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
        
        // COLISÃO COM AS PAREDES LATERAIS
        if (this.x >= right) {
            this.x = right;
            // Inverte a velocidade horizontal e aplica o bounce
            this.speedX = -(this.speedX * this.bounce);
        } else if (this.x <= left) {
            this.x = left;
            this.speedX = -(this.speedX * this.bounce);
        }
    };
}

// FUNÇÃO PARA INICIAR O JOGO
function startGame() {
    // Limpa o array de bolas
    myGamePieces = [];
    
    // Cria 4 bolas com diferentes propriedades de bounce
    myGamePieces.push(new component(40, 40, "red", 100, 100, 0.6));    // Bounce médio
    myGamePieces.push(new component(40, 40, "blue", 200, 50, 0.8));     // Bounce alto
    myGamePieces.push(new component(40, 40, "green", 300, 150, 0.4));   // Bounce baixo
    myGamePieces.push(new component(40, 40, "gold", 400, 80, 1.0));     // Bounce perfeito
    
    // Inicia a área do jogo
    myGameArea.start();
}

// FUNÇÃO PRINCIPAL QUE ATUALIZA O JOGO
function updateGameArea() {
    // Limpa o canvas
    myGameArea.clear();
    
    // Atualiza cada bola
    for (let i = 0; i < myGamePieces.length; i++) {
        myGamePieces[i].newPos();    // Calcula nova posição
        myGamePieces[i].update();    // Desenha na tela
    }
}

// FUNÇÕES DE CONTROLE DO JOGO
function restartGame() {
    myGameArea.stop();
    setTimeout(startGame, 100);
}

function pauseGame() {
    if (gameRunning) {
        myGameArea.stop();
    }
}

function resumeGame() {
    if (!gameRunning) {
        myGameArea.start();
    }
}

// INICIA O JOGO QUANDO A PÁGINA CARREGA
window.onload = function() {
    startGame();
};