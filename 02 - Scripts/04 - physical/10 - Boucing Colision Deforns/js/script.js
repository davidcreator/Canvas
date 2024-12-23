// Definição das variáveis dos objetos principais do jogo
var myGamePieces = [];

// Função para iniciar o jogo
function startGame() {
    // Adiciona vários componentes ao jogo com diferentes cores e propriedades de bouncing
    myGamePieces.push(new component(30, 30, "red", 80, 75, 0.6));
    myGamePieces.push(new component(30, 30, "blue", 130, 75, 0.8));
    myGamePieces.push(new component(30, 30, "green", 180, 75, 0.4));
    myGamePieces.push(new component(30, 30, "yellow", 230, 75, 1.0));
    myGameArea.start();
}

// Objeto que representa a área do jogo
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    stop: function() {
        clearInterval(this.interval);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// Função construtora para componentes do jogo
function component(width, height, color, x, y, bounce) {
    this.originalWidth = width;
    this.originalHeight = height;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 4 - 2; // Velocidade horizontal aleatória
    this.speedY = Math.random() * 4 - 2; // Velocidade vertical aleatória
    this.gravity = 0.1;
    this.gravitySpeed = 0;
    this.bounce = bounce;

    // Atualiza a aparência do componente
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    // Calcula a nova posição do componente
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBoundaries();
    };

    // Verifica se o componente atingiu alguma borda do canvas
    this.hitBoundaries = function() {
        let rockbottom = myGameArea.canvas.height - this.height;
        let rightBoundary = myGameArea.canvas.width - this.width;
        let leftBoundary = 0;

        // Reage à colisão com o fundo
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            this.stretch(true);
        } else if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            this.stretch(true);
        }

        // Reage à colisão com as laterais
        if (this.x > rightBoundary) {
            this.x = rightBoundary;
            this.speedX = -(this.speedX * this.bounce);
            this.stretch(false);
        } else if (this.x < leftBoundary) {
            this.x = leftBoundary;
            this.speedX = -(this.speedX * this.bounce);
            this.stretch(false);
        }
    };

    // Verifica se este componente colide com outro componente
    this.collisionWith = function(other) {
        let myleft = this.x;
        let myright = this.x + this.width;
        let mytop = this.y;
        let mybottom = this.y + this.height;
        let otherleft = other.x;
        let otherright = other.x + other.width;
        let othertop = other.y;
        let otherbottom = other.y + other.height;

        let collision = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            collision = false;
        }
        return collision;
    };

    // Deforma o componente ao colidir
    this.stretch = function(vertical) {
        if (vertical) {
            this.height = this.originalHeight * 1.2; // Estica verticalmente
            this.width = this.originalWidth * 0.8; // Encolhe horizontalmente
        } else {
            this.height = this.originalHeight * 0.8; // Encolhe verticalmente
            this.width = this.originalWidth * 1.2; // Estica horizontalmente
        }
        setTimeout(() => {
            this.width = this.originalWidth; // Restaura o tamanho original
            this.height = this.originalHeight; // Restaura o tamanho original
        }, 200); // Deforma por 200ms
    };
}

// Função para atualizar a área do jogo
function updateGameArea() {
    myGameArea.clear();

    for (let i = 0; i < myGamePieces.length; i++) {
        let piece = myGamePieces[i];

        for (let j = 0; j < myGamePieces.length; j++) {
            if (i != j) {
                let otherPiece = myGamePieces[j];
                if (piece.collisionWith(otherPiece)) {
                    // Inverte a direção ao colidir
                    piece.speedX = -piece.speedX;
                    piece.speedY = -piece.speedY;
                    otherPiece.speedX = -otherPiece.speedX;
                    otherPiece.speedY = -otherPiece.speedY;

                    // Aplica deformação nos dois objetos colididos
                    piece.stretch(true);
                    otherPiece.stretch(true);
                }
            }
        }

        piece.newPos();
        piece.update();
    }
}
