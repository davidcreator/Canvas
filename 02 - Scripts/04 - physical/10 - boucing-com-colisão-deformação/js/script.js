// === JAVASCRIPT DO JOGO ===

/**
 * 📦 VARIÁVEIS GLOBAIS
 * Array que armazena todos os objetos (peças) do jogo
 */
var myGamePieces = [];

/**
 * 🎯 FUNÇÃO PRINCIPAL - INICIAR O JOGO
 * Esta função cria os objetos do jogo e inicia a animação
 */
function startGame() {
    // Para qualquer jogo em andamento
    if (myGameArea.interval) {
        clearInterval(myGameArea.interval);
    }
    
    // Limpa qualquer jogo anterior
    myGamePieces = [];
    
    // 🎨 CRIANDO OS OBJETOS DO JOGO
    // Parâmetros: (largura, altura, cor, posição X, posição Y, força do bounce)
    
    myGamePieces.push(new component(30, 30, "red", 80, 75, 0.6));      // Vermelho - bounce médio
    myGamePieces.push(new component(30, 30, "blue", 130, 75, 0.8));    // Azul - bounce forte  
    myGamePieces.push(new component(30, 30, "green", 180, 75, 0.4));   // Verde - bounce fraco
    myGamePieces.push(new component(30, 30, "yellow", 230, 75, 1.0));  // Amarelo - bounce máximo
    
    // Inicia a área de jogo (ou reinicia se já existe)
    myGameArea.start();
}

/**
 * ⏹️ FUNÇÃO PARA PARAR O JOGO
 */
function stopGame() {
    myGameArea.stop();
}

/**
 * 🔄 FUNÇÃO PARA REINICIAR O JOGO
 */
function restartGame() {
    myGameArea.stop();
    myGameArea.clear();
    startGame();
}

/**
 * 🎮 OBJETO DA ÁREA DO JOGO
 * Controla o canvas onde o jogo acontece
 */
var myGameArea = {
    canvas: null,
    context: null,
    interval: null,
    
    // 🚀 Inicia a área do jogo
    start: function() {
        // Se o canvas ainda não existe, cria ele
        if (!this.canvas) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = 500;   // Largura da tela do jogo
            this.canvas.height = 300;  // Altura da tela do jogo
            this.context = this.canvas.getContext("2d");
            
            // Adiciona o canvas na página
            document.body.appendChild(this.canvas);
        }
        
        // Para qualquer animação anterior
        if (this.interval) {
            clearInterval(this.interval);
        }
        
        // Limpa a tela
        this.clear();
        
        // Define um intervalo para atualizar o jogo 50 vezes por segundo
        this.interval = setInterval(updateGameArea, 20);
    },
    
    // ⏹️ Para o jogo
    stop: function() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    // 🧹 Limpa a tela para redesenhar
    clear: function() {
        if (this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};

/**
 * 🧱 CONSTRUTOR DE COMPONENTES (OBJETOS DO JOGO)
 * Esta função cria cada objeto saltitante
 */
function component(width, height, color, x, y, bounce) {
    // 📏 PROPRIEDADES DE TAMANHO
    this.originalWidth = width;    // Largura original (para restaurar após deformação)
    this.originalHeight = height;  // Altura original (para restaurar após deformação)
    this.width = width;           // Largura atual
    this.height = height;         // Altura atual
    
    // 📍 PROPRIEDADES DE POSIÇÃO
    this.x = x;  // Posição horizontal
    this.y = y;  // Posição vertical
    
    // 🏃‍♂️ PROPRIEDADES DE MOVIMENTO
    this.speedX = Math.random() * 4 - 2; // Velocidade horizontal aleatória (-2 a +2)
    this.speedY = Math.random() * 4 - 2; // Velocidade vertical aleatória (-2 a +2)
    
    // 🌍 PROPRIEDADES DE FÍSICA
    this.gravity = 0.15;      // Força da gravidade
    this.gravitySpeed = 0;    // Velocidade acumulada da gravidade
    this.bounce = bounce;     // Força do salto (0 a 1)
    
    // 🎨 COR DO OBJETO
    this.color = color;
    
    /**
     * 🖼️ MÉTODO PARA DESENHAR O OBJETO NA TELA
     */
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    
    /**
     * 📍 MÉTODO PARA CALCULAR NOVA POSIÇÃO
     */
    this.newPos = function() {
        // Aplica gravidade (acelera para baixo)
        this.gravitySpeed += this.gravity;
        
        // Move o objeto
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        
        // Verifica se bateu nas bordas
        this.hitBoundaries();
    };
    
    /**
     * 🚧 MÉTODO PARA DETECTAR COLISÃO COM BORDAS
     */
    this.hitBoundaries = function() {
        // Calcula os limites da tela
        let rockbottom = myGameArea.canvas.height - this.height;  // Chão
        let rightBoundary = myGameArea.canvas.width - this.width; // Parede direita
        let leftBoundary = 0;  // Parede esquerda
        let ceiling = 0;       // Teto
        
        // 🔽 COLISÃO COM CHÃO OU TETO
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce); // Inverte e reduz velocidade
            this.stretch(true); // Deforma verticalmente
        } else if (this.y < ceiling) {
            this.y = ceiling;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            this.stretch(true);
        }
        
        // ↔️ COLISÃO COM PAREDES LATERAIS  
        if (this.x > rightBoundary) {
            this.x = rightBoundary;
            this.speedX = -(this.speedX * this.bounce); // Inverte direção horizontal
            this.stretch(false); // Deforma horizontalmente
        } else if (this.x < leftBoundary) {
            this.x = leftBoundary;
            this.speedX = -(this.speedX * this.bounce);
            this.stretch(false);
        }
    };
    
    /**
     * 💥 MÉTODO PARA DETECTAR COLISÃO ENTRE OBJETOS
     */
    this.collisionWith = function(other) {
        // Define os limites deste objeto
        let myleft = this.x;
        let myright = this.x + this.width;
        let mytop = this.y;
        let mybottom = this.y + this.height;
        
        // Define os limites do outro objeto
        let otherleft = other.x;
        let otherright = other.x + other.width;
        let othertop = other.y;
        let otherbottom = other.y + other.height;
        
        // Verifica se NÃO estão colidindo
        let collision = true;
        if ((mybottom < othertop) ||    // Este está acima do outro
            (mytop > otherbottom) ||    // Este está abaixo do outro
            (myright < otherleft) ||    // Este está à esquerda do outro
            (myleft > otherright)) {    // Este está à direita do outro
            collision = false;
        }
        return collision;
    };
    
    /**
     * 🤸‍♂️ MÉTODO PARA DEFORMAR O OBJETO DURANTE COLISÃO
     */
    this.stretch = function(vertical) {
        if (vertical) {
            // Deformação vertical (bate no chão/teto)
            this.height = this.originalHeight * 1.3; // Estica 30% na vertical
            this.width = this.originalWidth * 0.7;   // Encolhe 30% na horizontal
        } else {
            // Deformação horizontal (bate na parede)
            this.height = this.originalHeight * 0.7; // Encolhe 30% na vertical  
            this.width = this.originalWidth * 1.3;   // Estica 30% na horizontal
        }
        
        // Restaura o tamanho original após 200ms
        setTimeout(() => {
            this.width = this.originalWidth;
            this.height = this.originalHeight;
        }, 200);
    };
}

/**
 * 🔄 FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO DO JOGO
 * Esta função é chamada 50 vezes por segundo
 */
function updateGameArea() {
    // Limpa a tela
    myGameArea.clear();
    
    // Para cada objeto do jogo...
    for (let i = 0; i < myGamePieces.length; i++) {
        let piece = myGamePieces[i];
        
        // Verifica colisão com todos os outros objetos
        for (let j = 0; j < myGamePieces.length; j++) {
            if (i !== j) { // Não verifica colisão consigo mesmo
                let otherPiece = myGamePieces[j];
                
                // Se colidiu com outro objeto...
                if (piece.collisionWith(otherPiece)) {
                    // Inverte a direção de ambos os objetos
                    piece.speedX = -piece.speedX;
                    piece.speedY = -piece.speedY;
                    otherPiece.speedX = -otherPiece.speedX;
                    otherPiece.speedY = -otherPiece.speedY;
                    
                    // Aplica deformação em ambos
                    piece.stretch(true);
                    otherPiece.stretch(true);
                    
                    // Separa os objetos para evitar que fiquem "grudados"
                    if (piece.x < otherPiece.x) {
                        piece.x -= 2;
                        otherPiece.x += 2;
                    } else {
                        piece.x += 2;
                        otherPiece.x -= 2;
                    }
                }
            }
        }
        
        // Atualiza posição e desenha o objeto
        piece.newPos();
        piece.update();
    }
}

// 🚀 INICIA O JOGO AUTOMATICAMENTE QUANDO A PÁGINA CARREGA
window.onload = function() {
    startGame();
};