// ===== VARIÁVEIS GLOBAIS =====
// Arrays para armazenar os elementos do jogo
let gameComponents = [];  // Peças coloridas do jogo
let gameObstacles = [];   // Obstáculos pretos
let gameRunning = false;  // Controla se o jogo está rodando
let gameInterval;         // Armazena o intervalo de atualização

// ===== CONFIGURAÇÕES DO JOGO =====
const GAME_CONFIG = {
    canvasWidth: 600,     // Largura do canvas
    canvasHeight: 400,    // Altura do canvas
    updateSpeed: 30,      // Velocidade de atualização (menor = mais rápido)
    maxComponents: 8,     // Número máximo de componentes
    maxObstacles: 6       // Número máximo de obstáculos
};

// ===== ÁREA DO JOGO =====
const gameArea = {
    // Propriedades do canvas
    canvas: null,
    context: null,
    
    // Método para inicializar o canvas
    initialize: function() {
        console.log("🎯 Inicializando área do jogo...");
        
        // Cria o elemento canvas
        this.canvas = document.createElement("canvas");
        this.canvas.width = GAME_CONFIG.canvasWidth;
        this.canvas.height = GAME_CONFIG.canvasHeight;
        
        // Obtém o contexto 2D para desenhar
        this.context = this.canvas.getContext("2d");
        
        // Adiciona o canvas à página
        const container = document.querySelector('.container');
        const controls = document.querySelector('.controls');
        container.insertBefore(this.canvas, controls.nextSibling);
        
        console.log("✅ Canvas criado com sucesso!");
    },
    
    // Método para limpar o canvas
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// ===== CLASSE PARA COMPONENTES DO JOGO =====
class GameComponent {
    constructor(width, height, color, x, y, type = 'component') {
        this.width = width;   // Largura do componente
        this.height = height; // Altura do componente
        this.color = color;   // Cor do componente
        this.x = x;          // Posição horizontal
        this.y = y;          // Posição vertical
        this.type = type;    // Tipo (component ou obstacle)
        
        console.log(`🔷 Criado ${type}: ${color} (${width}x${height}) na posição (${x}, ${y})`);
    }
    
    // Método para desenhar o componente no canvas
    draw() {
        const ctx = gameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Adiciona uma borda para melhor visualização
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// ===== FUNÇÕES PARA CRIAR ELEMENTOS =====

function createGameComponents() {
    console.log("🎨 Criando componentes coloridos...");
    
    // Array com cores vibrantes
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
                    '#9b59b6', '#e67e22', '#1abc9c', '#34495e'];
    
    // Limpa o array anterior
    gameComponents = [];
    
    // Cria componentes com propriedades variadas
    for (let i = 0; i < GAME_CONFIG.maxComponents; i++) {
        const component = new GameComponent(
            getRandomSize(20, 60),        // Largura aleatória
            getRandomSize(20, 60),        // Altura aleatória
            colors[i % colors.length],    // Cor da lista
            getRandomPosition(GAME_CONFIG.canvasWidth - 60),   // Posição X
            getRandomPosition(GAME_CONFIG.canvasHeight - 60),  // Posição Y
            'component'
        );
        gameComponents.push(component);
    }
    
    console.log(`✅ Criados ${gameComponents.length} componentes`);
}

function createGameObstacles() {
    console.log("🚧 Criando obstáculos...");
    
    // Limpa o array anterior
    gameObstacles = [];
    
    // Cria obstáculos pretos
    for (let i = 0; i < GAME_CONFIG.maxObstacles; i++) {
        const obstacle = new GameComponent(
            getRandomSize(15, 40),        // Largura aleatória
            getRandomSize(80, 150),       // Altura aleatória (mais altos)
            '#2c3e50',                    // Cor preta/cinza escuro
            getRandomPosition(GAME_CONFIG.canvasWidth - 40),   // Posição X
            getRandomPosition(GAME_CONFIG.canvasHeight - 150), // Posição Y
            'obstacle'
        );
        gameObstacles.push(obstacle);
    }
    
    console.log(`✅ Criados ${gameObstacles.length} obstáculos`);
}

// ===== FUNÇÕES AUXILIARES =====

function getRandomSize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPosition(max) {
    return Math.floor(Math.random() * max);
}

// ===== FUNÇÕES DE CONTROLE DO JOGO =====

function startGame() {
    console.log("🚀 Iniciando o jogo...");
    
    // Inicializa o canvas se ainda não foi criado
    if (!gameArea.canvas) {
        gameArea.initialize();
    }
    
    // Cria os elementos do jogo
    createGameComponents();
    createGameObstacles();
    
    // Atualiza os contadores na tela
    updateStats();
    
    // Inicia o loop de atualização se não estiver rodando
    if (!gameRunning) {
        gameInterval = setInterval(updateGame, GAME_CONFIG.updateSpeed);
        gameRunning = true;
        console.log("✅ Jogo iniciado!");
    }
}

function pauseGame() {
    if (gameRunning) {
        clearInterval(gameInterval);
        gameRunning = false;
        console.log("⏸️ Jogo pausado");
    } else if (gameArea.canvas) {
        gameInterval = setInterval(updateGame, GAME_CONFIG.updateSpeed);
        gameRunning = true;
        console.log("▶️ Jogo retomado");
    }
}

function resetGame() {
    console.log("🔄 Reiniciando o jogo...");
    
    // Para o jogo
    if (gameRunning) {
        clearInterval(gameInterval);
        gameRunning = false;
    }
    
    // Limpa os arrays
    gameComponents = [];
    gameObstacles = [];
    
    // Limpa o canvas se existir
    if (gameArea.canvas) {
        gameArea.clear();
    }
    
    // Atualiza os contadores
    updateStats();
    
    console.log("✅ Jogo reiniciado");
}

// ===== LOOP PRINCIPAL DO JOGO =====

function updateGame() {
    // Limpa a tela
    gameArea.clear();
    
    // Desenha todos os componentes
    gameComponents.forEach(component => {
        component.draw();
    });
    
    // Desenha todos os obstáculos
    gameObstacles.forEach(obstacle => {
        obstacle.draw();
    });
}

// ===== FUNÇÃO PARA ATUALIZAR ESTATÍSTICAS =====

function updateStats() {
    document.getElementById('componentCount').textContent = gameComponents.length;
    document.getElementById('obstacleCount').textContent = gameObstacles.length;
}

// ===== INICIALIZAÇÃO =====

// Quando a página carregar, mostra uma mensagem
window.addEventListener('load', function() {
    console.log("📖 Página carregada! Clique em 'Iniciar Jogo' para começar.");
    console.log("💡 Abra o Console do Desenvolvedor (F12) para ver as mensagens detalhadas!");
});