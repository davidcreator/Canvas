/* ====================================
    🎮 JOGO DE MOVIMENTO E ROTAÇÃO
    
    Este script demonstra conceitos fundamentais:
    - Manipulação do Canvas HTML5
    - Movimento usando trigonometria
    - Rotação de objetos 2D
    - Loop de animação
    - Detecção de colisões simples
    ==================================== */

// ====================================
// 📋 CONFIGURAÇÃO INICIAL DO CANVAS
// ====================================

// Obtém referência do elemento canvas do HTML
const canvas = document.getElementById('gameCanvas');

// Obtém o contexto 2D para desenhar no canvas
const context = canvas.getContext('2d');

console.log('🎯 Canvas inicializado com sucesso!');
console.log(`📏 Dimensões: ${canvas.width} x ${canvas.height} pixels`);

// ====================================
// 🔧 VARIÁVEIS DO OBJETO (QUADRADO)
// ====================================

// Posição inicial do quadrado (centro do canvas)
let x = canvas.width / 2;  // Posição horizontal (eixo X)
let y = canvas.height / 2; // Posição vertical (eixo Y)

// Propriedades físicas do quadrado
const size = 50;           // Tamanho do quadrado em pixels
let angle = 0;             // Ângulo de rotação em radianos (0 = apontando para direita)
const speed = 2;           // Velocidade de movimento em pixels por frame
const rotationSpeed = 0.01; // Velocidade de rotação em radianos por frame

console.log('🎲 Objeto inicializado:', { x, y, size, angle, speed });

// ====================================
// 🎨 FUNÇÃO DE DESENHO DO QUADRADO
// ====================================

function drawComponent() {
    // Limpa todo o canvas para a próxima frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // IMPORTANTE: Salva o estado atual do contexto
    // Isso permite restaurar as configurações originais depois
    context.save();
    
    // ====================================
    // 🔄 SISTEMA DE TRANSFORMAÇÕES 2D
    // ====================================
    
    // 1. Move o ponto de origem para a posição do quadrado
    context.translate(x, y);
    
    // 2. Rotaciona o sistema de coordenadas
    context.rotate(angle);
    
    // ====================================
    // 🎨 DESENHO DO QUADRADO
    // ====================================
    
    // Define a cor de preenchimento
    context.fillStyle = '#e74c3c'; // Vermelho vibrante
    
    // Desenha o quadrado centralizado no ponto de origem
    // Usamos -size/2 para centralizar o quadrado na posição
    context.fillRect(-size / 2, -size / 2, size, size);
    
    // Adiciona uma borda para melhor visualização
    context.strokeStyle = '#c0392b'; // Vermelho mais escuro
    context.lineWidth = 2;
    context.strokeRect(-size / 2, -size / 2, size, size);
    
    // IMPORTANTE: Restaura o estado original do contexto
    // Remove todas as transformações aplicadas
    context.restore();
}

// ====================================
// 🚀 FUNÇÃO DE ATUALIZAÇÃO DO MOVIMENTO
// ====================================

function updatePosition() {
    // ====================================
    // 📐 CÁLCULO DO MOVIMENTO USANDO TRIGONOMETRIA
    // ====================================
    
    // cos(angle) = componente horizontal do movimento
    // sin(angle) = componente vertical do movimento
    // Multiplicamos pela velocidade para controlar a rapidez
    
    const deltaX = speed * Math.cos(angle); // Mudança na posição X
    const deltaY = speed * Math.sin(angle); // Mudança na posição Y
    
    // Atualiza a posição do quadrado
    x += deltaX;
    y += deltaY;
    
    // ====================================
    // 🔄 ROTAÇÃO AUTOMÁTICA
    // ====================================
    
    // Incrementa o ângulo para criar rotação contínua
    angle += rotationSpeed;
    
    // ====================================
    // 🛡️ DETECÇÃO DE COLISÃO COM AS BORDAS
    // ====================================
    
    // Calcula os limites do quadrado considerando seu tamanho
    const halfSize = size / 2;
    
    // Verifica colisão com cada borda do canvas
    const hitLeftEdge = x - halfSize < 0;                    // Borda esquerda
    const hitRightEdge = x + halfSize > canvas.width;        // Borda direita  
    const hitTopEdge = y - halfSize < 0;                     // Borda superior
    const hitBottomEdge = y + halfSize > canvas.height;      // Borda inferior
    
    // Se colidiu com qualquer borda, muda a direção
    if (hitLeftEdge || hitRightEdge || hitTopEdge || hitBottomEdge) {
        // Gira 90 graus (π/2 radianos) para mudar de direção
        angle += Math.PI / 2;
        
        // Log para fins educacionais
        console.log('💥 Colisão detectada! Nova direção:', angle.toFixed(2), 'radianos');
        
        // Ajusta posição para evitar ficar preso nas bordas
        if (hitLeftEdge) x = halfSize;
        if (hitRightEdge) x = canvas.width - halfSize;
        if (hitTopEdge) y = halfSize;
        if (hitBottomEdge) y = canvas.height - halfSize;
    }
    
    // Redesenha o quadrado na nova posição
    drawComponent();
}

// ====================================
// 🎬 LOOP PRINCIPAL DO JOGO
// ====================================

function gameLoop() {
    // Atualiza a posição e rotação do quadrado
    updatePosition();
    
    // requestAnimationFrame sincroniza com a taxa de atualização do monitor
    // Geralmente 60 FPS, criando animação suave
    requestAnimationFrame(gameLoop);
}

// ====================================
// 🚀 INICIALIZAÇÃO DO JOGO
// ====================================

console.log('🎮 Iniciando o jogo...');
console.log('📚 Este exemplo demonstra:');
console.log('   - Canvas HTML5 e contexto 2D');
console.log('   - Trigonometria aplicada (seno e cosseno)');
console.log('   - Transformações 2D (translação e rotação)');
console.log('   - Loop de animação com requestAnimationFrame');
console.log('   - Detecção de colisões simples');

// Inicia o loop principal do jogo
gameLoop();

// Desenho inicial
drawComponent();