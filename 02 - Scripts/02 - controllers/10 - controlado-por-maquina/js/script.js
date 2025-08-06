/*
===== CÓDIGO JAVASCRIPT =====
Aqui é onde a mágica acontece! Vamos criar nosso jogo passo a passo.
*/

// ===== PASSO 1: PREPARAÇÃO =====
// Obtém o elemento canvas da nossa página HTML
const canvas = document.getElementById('gameCanvas');

// Obtém o "pincel" para desenhar no canvas (contexto 2D)
const context = canvas.getContext('2d');

// ===== PASSO 2: VARIÁVEIS DO NOSSO QUADRADO =====
// Posição inicial do quadrado (centro da tela)
let x = canvas.width / 2;   // Posição horizontal (eixo X)
let y = canvas.height / 2;  // Posição vertical (eixo Y)

// Características do quadrado
const size = 50;  // Tamanho do quadrado em pixels

// Velocidade do movimento
let dx = 3;  // Velocidade horizontal (pixels por frame)
let dy = 2;  // Velocidade vertical (pixels por frame)

// ===== PASSO 3: FUNÇÃO PARA DESENHAR =====
function drawComponent() {
    // Limpa toda a tela (como apagar um quadro)
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Define a cor do quadrado (vermelho)
    context.fillStyle = '#FF0000';
    
    // Desenha o quadrado na posição atual
    // fillRect(x, y, largura, altura)
    context.fillRect(x, y, size, size);
    
    // Adiciona um contorno preto ao quadrado
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.strokeRect(x, y, size, size);
}

// ===== PASSO 4: FUNÇÃO PARA MOVIMENTO =====
function updatePosition() {
    // Move o quadrado somando a velocidade à posição
    x += dx;  // Move horizontalmente
    y += dy;  // Move verticalmente

    // ===== DETECTA COLISÕES COM AS BORDAS =====
    
    // Colisão com as bordas esquerda e direita
    if (x + size > canvas.width || x < 0) {
        dx = -dx;  // Inverte a direção horizontal
        
        // Efeito visual: muda cor temporariamente
        setTimeout(() => {
            context.fillStyle = '#FF0000';
        }, 100);
    }
    
    // Colisão com as bordas superior e inferior  
    if (y + size > canvas.height || y < 0) {
        dy = -dy;  // Inverte a direção vertical
    }

    // Redesenha o quadrado na nova posição
    drawComponent();
}

// ===== PASSO 5: LOOP PRINCIPAL DO JOGO =====
function gameLoop() {
    // Atualiza a posição do quadrado
    updatePosition();
    
    // Solicita ao navegador para chamar esta função novamente
    // no próximo frame de animação (cerca de 60 vezes por segundo)
    requestAnimationFrame(gameLoop);
}

// ===== PASSO 6: INICIA O JOGO =====
// Desenha o quadrado na posição inicial
drawComponent();

// Inicia o loop de animação
gameLoop();

// ===== EXTRA: MENSAGEM NO CONSOLE =====
console.log("🎮 Jogo iniciado! Abra o Console do navegador para ver esta mensagem.");
console.log("📊 Posição inicial do quadrado:", { x: x, y: y });