/* ==========================================
    SEÇÃO 1: CONFIGURAÇÃO INICIAL DO CANVAS
    ========================================== */

// Obtém o elemento canvas e o contexto de renderização 2D
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Variáveis globais para controlar a simulação
let components = []; // Array que armazena todos os objetos em movimento
let isRunning = true; // Controla se a animação está rodando
let animationId; // ID da animação para poder pausar/retomar

/* ==========================================
    SEÇÃO 2: DEFINIÇÃO DA CLASSE COMPONENT
    ========================================== */

/**
 * Classe Component - representa cada objeto que se move na tela
 * @param {number} x - posição horizontal inicial
 * @param {number} y - posição vertical inicial  
 * @param {number} size - tamanho do objeto (largura e altura)
 * @param {number} speed - velocidade de movimento
 * @param {number} angle - ângulo de direção em radianos
 * @param {number} angleSpeed - velocidade de rotação
 * @param {string} color - cor do objeto
 */
class Component {
    constructor(x, y, size, speed, angle, angleSpeed, color) {
        this.x = x;                    // Posição horizontal
        this.y = y;                    // Posição vertical
        this.size = size;              // Tamanho do objeto
        this.speed = speed;            // Velocidade de movimento
        this.angle = angle;            // Direção do movimento
        this.angleSpeed = angleSpeed;  // Velocidade de rotação
        this.color = color;            // Cor do objeto
    }

    /**
     * Método draw() - desenha o componente no canvas
     * Usa transformações para rotacionar o objeto
     */
    draw() {
        context.save(); // Salva o estado atual do contexto
        
        // Move a origem do contexto para a posição do objeto
        context.translate(this.x, this.y);
        
        // Rotaciona o contexto pelo ângulo do objeto
        context.rotate(this.angle);
        
        // Define a cor de preenchimento
        context.fillStyle = this.color;
        
        // Desenha um retângulo centralizado na origem
        context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        
        // Adiciona uma borda preta para melhor visualização
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        
        context.restore(); // Restaura o estado do contexto
    }

    /**
     * Método update() - atualiza a posição e rotação do componente
     * Também verifica colisões com as bordas do canvas
     */
    update() {
        // Calcula nova posição usando trigonometria
        // Math.cos(angle) dá a componente horizontal do movimento
        // Math.sin(angle) dá a componente vertical do movimento
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        
        // Atualiza o ângulo de rotação do objeto
        this.angle += this.angleSpeed;

        // DETECÇÃO DE COLISÃO COM BORDAS HORIZONTAIS (esquerda e direita)
        if (this.x + this.size / 2 > canvas.width || this.x - this.size / 2 < 0) {
            // Inverte o ângulo horizontalmente: Math.PI - angle
            // Isso faz o objeto "ricochar" na parede vertical
            this.angle = Math.PI - this.angle;
        }
        
        // DETECÇÃO DE COLISÃO COM BORDAS VERTICAIS (topo e fundo)
        if (this.y + this.size / 2 > canvas.height || this.y - this.size / 2 < 0) {
            // Inverte o ângulo verticalmente: -angle
            // Isso faz o objeto "ricochar" na parede horizontal
            this.angle = -this.angle;
        }

        // Desenha o componente na nova posição
        this.draw();
    }
}

/* ==========================================
    SEÇÃO 3: FUNÇÕES DE INICIALIZAÇÃO
    ========================================== */

/**
 * Gera uma cor aleatória em formato hexadecimal
 * @returns {string} cor no formato #RRGGBB
 */
function getRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Cria os objetos Component com propriedades aleatórias
 */
function createComponents() {
    components = []; // Limpa o array
    const count = parseInt(document.getElementById('objectCount').value);
    const globalSpeed = parseFloat(document.getElementById('speed').value);
    const objectSize = parseInt(document.getElementById('size').value);
    
    for (let i = 0; i < count; i++) {
        components.push(new Component(
            Math.random() * (canvas.width - objectSize) + objectSize/2,  // x aleatório
            Math.random() * (canvas.height - objectSize) + objectSize/2, // y aleatório
            objectSize,                                    // tamanho
            Math.random() * globalSpeed + 0.5,           // velocidade aleatória
            Math.random() * 2 * Math.PI,                 // ângulo aleatório (0 a 2π)
            (Math.random() - 0.5) * 0.05,               // rotação aleatória
            getRandomColor()                             // cor aleatória
        ));
    }
}

/* ==========================================
    SEÇÃO 4: LOOP PRINCIPAL DO JOGO
    ========================================== */

/**
 * gameLoop() - Função principal que roda a animação
 * É chamada 60 vezes por segundo pelo requestAnimationFrame
 */
function gameLoop() {
    if (!isRunning) return; // Para a animação se pausada
    
    // Limpa todo o canvas (cria fundo branco)
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Cria um fundo gradiente para ficar mais bonito
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#E3F2FD');
    gradient.addColorStop(1, '#BBDEFB');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Atualiza a posição e desenha cada componente
    components.forEach(component => component.update());
    
    // Solicita a próxima frame de animação
    animationId = requestAnimationFrame(gameLoop);
}

/* ==========================================
    SEÇÃO 5: FUNÇÕES DE CONTROLE
    ========================================== */

/**
 * Reinicia a simulação com novos objetos
 */
function resetSimulation() {
    createComponents();
    if (!isRunning) {
        isRunning = true;
        document.getElementById('pauseBtn').textContent = '⏸️ Pausar';
        gameLoop();
    }
}

/**
 * Pausa ou retoma a animação
 */
function togglePause() {
    isRunning = !isRunning;
    const btn = document.getElementById('pauseBtn');
    
    if (isRunning) {
        btn.textContent = '⏸️ Pausar';
        gameLoop();
    } else {
        btn.textContent = '▶️ Continuar';
        cancelAnimationFrame(animationId);
    }
}

/**
 * Limpa completamente o canvas
 */
function clearCanvas() {
    components = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha fundo gradiente
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#E3F2FD');
    gradient.addColorStop(1, '#BBDEFB');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha texto explicativo
    context.fillStyle = '#666';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText('Canvas limpo! Clique em "Reiniciar Simulação"', canvas.width/2, canvas.height/2);
}

/* ==========================================
    SEÇÃO 6: EVENT LISTENERS E INICIALIZAÇÃO
    ========================================== */

// Atualiza os valores mostrados nos controles deslizantes
document.getElementById('objectCount').oninput = function() {
    document.getElementById('objectCountValue').textContent = this.value;
};

document.getElementById('speed').oninput = function() {
    document.getElementById('speedValue').textContent = this.value;
};

document.getElementById('size').oninput = function() {
    document.getElementById('sizeValue').textContent = this.value;
};

// Inicializa a aplicação quando a página carrega
window.onload = function() {
    console.log('🎮 Jogo de Movimento Automático inicializado!');
    console.log('📚 Esta aplicação demonstra conceitos de:');
    console.log('   • Programação Orientada a Objetos');
    console.log('   • Canvas API e gráficos 2D');
    console.log('   • Trigonometria e física básica');
    console.log('   • Detecção de colisões');
    console.log('   • Loops de animação');
    
    createComponents(); // Cria os objetos iniciais
    gameLoop();         // Inicia o loop de animação
};

// Adiciona informações educativas no console
console.log(`
🎓 DICAS PARA ESTUDANTES:

1. Abra o DevTools (F12) para ver este código
2. Tente modificar os valores das propriedades
3. Observe como Math.cos() e Math.sin() criam movimento
4. Experimente diferentes ângulos e velocidades
5. Estude como as colisões são detectadas

💡 DESAFIOS:
• Adicione gravidade aos objetos
• Crie diferentes formas (círculos, triângulos)
• Implemente colisões entre objetos
• Adicione efeitos de partículas
• Crie um sistema de pontuação
`);