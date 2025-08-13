// script.js - Breakout Clássico Educacional

/**
 * CLASSE BALL - Representa a bola do jogo
 * Conceitos: Orientação a Objetos, Física Básica
 */
class Ball {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.dx = speed;
        this.dy = -speed;
        this.color = '#ff6b6b';
    }
    
    // Método para atualizar a posição da bola
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
    
    // Método para desenhar a bola
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        
        // Efeito de brilho
        ctx.beginPath();
        ctx.arc(this.x - 3, this.y - 3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    }
    
    // Método para inverter direção horizontal
    reverseX() {
        this.dx = -this.dx;
    }
    
    // Método para inverter direção vertical
    reverseY() {
        this.dy = -this.dy;
    }
    
    // Método para resetar posição
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.dx = this.speed;
        this.dy = -this.speed;
    }
}

/**
 * CLASSE PADDLE - Representa a raquete do jogador
 * Conceitos: Controle do Jogador, Limitação de Movimento
 */
class Paddle {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }
    
    // Método para desenhar a raquete
    draw(ctx) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#4ecdc4');
        gradient.addColorStop(1, '#44a08d');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Borda
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    // Método para mover a raquete
    move(direction, canvasWidth) {
        if (direction === 'left' && this.x > 0) {
            this.x -= this.speed;
        } else if (direction === 'right' && this.x < canvasWidth - this.width) {
            this.x += this.speed;
        }
    }
    
    // Método para obter o centro da raquete
    getCenterX() {
        return this.x + this.width / 2;
    }
}

/**
 * CLASSE BRICK - Representa um bloco
 * Conceitos: Estados de Objeto, Renderização Condicional
 */
class Brick {
    constructor(x, y, width, height, color, points) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.points = points;
        this.destroyed = false;
    }
    
    // Método para desenhar o bloco
    draw(ctx) {
        if (!this.destroyed) {
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, this.darkenColor(this.color, 0.3));
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Borda
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    
    // Método auxiliar para escurecer cores
    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const num = parseInt(hex, 16);
        const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
        const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * amount));
        const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * amount));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }
    
    // Método para destruir o bloco
    destroy() {
        this.destroyed = true;
    }
}

/**
 * CLASSE PRINCIPAL DO JOGO
 * Conceitos: Game Loop, Gerenciamento de Estado, Detecção de Colisão
 */
class BreakoutGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Elementos da UI
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        
        // Estados do jogo
        this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameOver', 'levelComplete'
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Configurações do jogo
        this.ballSpeed = 4;
        this.paddleSpeed = 8;
        
        // Controles
        this.keys = {};
        
        // Inicializar entidades do jogo
        this.initializeGame();
        
        // Event listeners
        this.setupEventListeners();
        
        // Iniciar o game loop
        this.gameLoop();
    }
    
    /**
     * MÉTODO DE INICIALIZAÇÃO
     * Conceitos: Setup de Estados Iniciais
     */
    initializeGame() {
        // Criar bola
        this.ball = new Ball(
            this.canvas.width / 2,
            this.canvas.height - 50,
            10,
            this.ballSpeed
        );
        
        // Criar raquete
        this.paddle = new Paddle(
            this.canvas.width / 2 - 50,
            this.canvas.height - 30,
            100,
            20,
            this.paddleSpeed
        );
        
        // Criar blocos
        this.createBricks();
    }
    
    /**
     * MÉTODO DE CRIAÇÃO DE BLOCOS
     * Conceitos: Arrays Bidimensionais, Loops Aninhados
     */
    createBricks() {
        this.bricks = [];
        const brickWidth = 75;
        const brickHeight = 30;
        const padding = 5;
        const offsetTop = 60;
        const offsetLeft = 35;
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffd93d', '#6c5ce7'];
        const rows = 6;
        const cols = 10;
        
        for (let r = 0; r < rows; r++) {
            this.bricks[r] = [];
            for (let c = 0; c < cols; c++) {
                const brickX = c * (brickWidth + padding) + offsetLeft;
                const brickY = r * (brickHeight + padding) + offsetTop;
                const points = (rows - r) * 10; // Pontos baseados na linha
                
                this.bricks[r][c] = new Brick(
                    brickX,
                    brickY,
                    brickWidth,
                    brickHeight,
                    colors[r],
                    points
                );
            }
        }
    }
    
    /**
     * SETUP DE EVENT LISTENERS
     * Conceitos: Manipulação de Eventos, Input do Usuário
     */
    setupEventListeners() {
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Botões de controle
        document.getElementById('startBtn').addEventListener('click', () => {
            if (this.gameState === 'menu' || this.gameState === 'gameOver') {
                this.startGame();
            }
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    /**
     * GAME LOOP PRINCIPAL
     * Conceitos: RequestAnimationFrame, Ciclo de Jogo
     */
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * MÉTODO DE ATUALIZAÇÃO
     * Conceitos: Lógica de Jogo, Estados
     */
    update() {
        if (this.gameState !== 'playing') return;
        
        // Atualizar controles
        this.handleInput();
        
        // Atualizar bola
        this.ball.update();
        
        // Verificar colisões
        this.checkCollisions();
        
        // Verificar condições de vitória/derrota
        this.checkGameConditions();
        
        // Atualizar UI
        this.updateUI();
    }
    
    /**
     * MANIPULAÇÃO DE INPUT
     * Conceitos: Controle Responsivo, Estados de Teclas
     */
    handleInput() {
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.paddle.move('left', this.canvas.width);
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.paddle.move('right', this.canvas.width);
        }
    }
    
    /**
     * DETECÇÃO DE COLISÕES
     * Conceitos: Física de Jogo, Geometria 2D
     */
    checkCollisions() {
        // Colisão com paredes
        if (this.ball.x + this.ball.radius > this.canvas.width || this.ball.x - this.ball.radius < 0) {
            this.ball.reverseX();
        }
        
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.reverseY();
        }
        
        // Colisão com raquete
        if (this.ball.y + this.ball.radius > this.paddle.y &&
            this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.width) {
            
            // Calcular ângulo baseado na posição de impacto
            const hitPos = (this.ball.x - this.paddle.getCenterX()) / (this.paddle.width / 2);
            this.ball.dx = hitPos * this.ballSpeed;
            this.ball.dy = -Math.abs(this.ball.dy);
        }
        
        // Colisão com blocos
        for (let r = 0; r < this.bricks.length; r++) {
            for (let c = 0; c < this.bricks[r].length; c++) {
                const brick = this.bricks[r][c];
                if (!brick.destroyed) {
                    if (this.ball.x + this.ball.radius > brick.x &&
                        this.ball.x - this.ball.radius < brick.x + brick.width &&
                        this.ball.y + this.ball.radius > brick.y &&
                        this.ball.y - this.ball.radius < brick.y + brick.height) {
                        
                        this.ball.reverseY();
                        brick.destroy();
                        this.score += brick.points;
                        break;
                    }
                }
            }
        }
        
        // Verificar se a bola caiu
        if (this.ball.y > this.canvas.height) {
            this.lives--;
            if (this.lives > 0) {
                this.resetBall();
            }
        }
    }
    
    /**
     * VERIFICAÇÃO DE CONDIÇÕES DO JOGO
     * Conceitos: Lógica de Estado, Condições de Vitória/Derrota
     */
    checkGameConditions() {
        // Game Over
        if (this.lives <= 0) {
            this.gameState = 'gameOver';
            return;
        }
        
        // Verificar se todos os blocos foram destruídos
        let allDestroyed = true;
        for (let r = 0; r < this.bricks.length; r++) {
            for (let c = 0; c < this.bricks[r].length; c++) {
                if (!this.bricks[r][c].destroyed) {
                    allDestroyed = false;
                    break;
                }
            }
            if (!allDestroyed) break;
        }
        
        if (allDestroyed) {
            this.level++;
            this.ballSpeed += 0.5;
            this.createBricks();
            this.resetBall();
        }
    }
    
    /**
     * MÉTODO DE RENDERIZAÇÃO
     * Conceitos: Canvas API, Renderização 2D
     */
    draw() {
        // Limpar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenhar fundo
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#34495e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'playing' || this.gameState === 'paused') {
            // Desenhar entidades do jogo
            this.ball.draw(this.ctx);
            this.paddle.draw(this.ctx);
            
            // Desenhar blocos
            for (let r = 0; r < this.bricks.length; r++) {
                for (let c = 0; c < this.bricks[r].length; c++) {
                    this.bricks[r][c].draw(this.ctx);
                }
            }
        }
        
        // Desenhar mensagens de estado
        this.drawGameStateMessages();
    }
    
    /**
     * MENSAGENS DE ESTADO
     * Conceitos: Renderização de Texto, Estados de Interface
     */
    drawGameStateMessages() {
        this.ctx.font = 'bold 36px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        
        switch (this.gameState) {
            case 'menu':
                this.ctx.fillText('BREAKOUT CLÁSSICO', this.canvas.width / 2, this.canvas.height / 2 - 50);
                this.ctx.font = '24px Arial';
                this.ctx.fillText('Clique em "Iniciar Jogo" para começar', this.canvas.width / 2, this.canvas.height / 2 + 20);
                break;
                
            case 'paused':
                this.ctx.fillText('JOGO PAUSADO', this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.font = '24px Arial';
                this.ctx.fillText('Clique em "Pausar" novamente para continuar', this.canvas.width / 2, this.canvas.height / 2 + 50);
                break;
                
            case 'gameOver':
                this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);
                this.ctx.font = '24px Arial';
                this.ctx.fillText(`Pontuação Final: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
                this.ctx.fillText('Clique em "Iniciar Jogo" para jogar novamente', this.canvas.width / 2, this.canvas.height / 2 + 60);
                break;
        }
    }
    
    /**
     * MÉTODOS DE CONTROLE DO JOGO
     */
    startGame() {
        this.gameState = 'playing';
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.ballSpeed = 4;
        this.initializeGame();
        this.updateUI();
    }
    
    resetBall() {
        this.ball.reset(this.canvas.width / 2, this.canvas.height - 50);
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.levelElement.textContent = this.level;
    }
}

// Inicializar o jogo quando a página carregar
window.addEventListener('load', () => {
    new BreakoutGame();
});