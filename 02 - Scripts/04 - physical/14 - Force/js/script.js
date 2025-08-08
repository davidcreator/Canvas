/* ========================================
    JAVASCRIPT - LÓGICA DA SIMULAÇÃO
======================================== */

// ==========================================
// 1. CONFIGURAÇÃO INICIAL DO CANVAS
// ==========================================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define o tamanho do canvas (80% da janela)
canvas.width = Math.min(window.innerWidth * 0.8, 800);
canvas.height = Math.min(window.innerHeight * 0.6, 400);

// ==========================================
// 2. OBJETO BOLA - PROPRIEDADES FÍSICAS
// ==========================================

const ball = {
    x: 50,                    // Posição horizontal inicial
    y: canvas.height / 2,     // Posição vertical (centro)
    radius: 20,               // Raio da bola em pixels
    vx: 6,                    // Velocidade horizontal inicial
    vy: 0,                    // Velocidade vertical (não usada neste exemplo)
    friction: 0.98,           // Coeficiente de atrito (0 = muito atrito, 1 = sem atrito)
    color: '#0095DD',         // Cor da bola
    trail: []                 // Array para armazenar rastro da bola
};

// ==========================================
// 3. FUNÇÃO DE DESENHO - RENDERIZAÇÃO
// ==========================================

function drawBall() {
    // Limpa todo o canvas para o próximo frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o rastro da bola (efeito visual)
    drawTrail();
    
    // Desenha a bola principal
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    
    // Adiciona um brilho na bola
    ctx.beginPath();
    ctx.arc(ball.x - 5, ball.y - 5, ball.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
}

// ==========================================
// 4. FUNÇÃO DE RASTRO - EFEITO VISUAL
// ==========================================

function drawTrail() {
    // Adiciona posição atual ao rastro
    ball.trail.push({ x: ball.x, y: ball.y });
    
    // Limita o tamanho do rastro
    if (ball.trail.length > 15) {
        ball.trail.shift();
    }
    
    // Desenha o rastro com opacidade decrescente
    for (let i = 0; i < ball.trail.length; i++) {
        const alpha = i / ball.trail.length * 0.3;
        const size = (i / ball.trail.length) * ball.radius * 0.8;
        
        ctx.beginPath();
        ctx.arc(ball.trail[i].x, ball.trail[i].y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 149, 221, ${alpha})`;
        ctx.fill();
    }
}

// ==========================================
// 5. FÍSICA DA SIMULAÇÃO - MOVIMENTO
// ==========================================

function updateBall() {
    // Aplica o atrito à velocidade (a cada frame, a velocidade diminui)
    ball.vx *= ball.friction;
    
    // Atualiza a posição baseada na velocidade
    ball.x += ball.vx;

    // DETECÇÃO DE COLISÃO COM A PAREDE DIREITA
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;  // Posiciona na borda
        ball.vx *= -0.8;  // Inverte a direção e reduz velocidade (colisão não totalmente elástica)
        
        // Efeito visual de colisão
        ball.color = '#FF6B6B';
        setTimeout(() => { ball.color = '#0095DD'; }, 150);
    }

    // DETECÇÃO DE COLISÃO COM A PAREDE ESQUERDA
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -0.8;
        
        // Efeito visual de colisão
        ball.color = '#FF6B6B';
        setTimeout(() => { ball.color = '#0095DD'; }, 150);
    }

    // PARADA POR INÉRCIA - quando a velocidade fica muito pequena
    if (Math.abs(ball.vx) < 0.05) {
        ball.vx = 0;  // Para completamente a bola
        ball.trail = []; // Limpa o rastro
    }
}

// ==========================================
// 6. ATUALIZAÇÃO DA INTERFACE
// ==========================================

function updateInfo() {
    document.getElementById('velocity').textContent = Math.abs(ball.vx).toFixed(2);
    document.getElementById('friction-display').textContent = ball.friction.toFixed(3);
    document.getElementById('status').textContent = Math.abs(ball.vx) > 0.05 ? 'Em movimento' : 'Parada';
}

// ==========================================
// 7. LOOP PRINCIPAL DA ANIMAÇÃO
// ==========================================

function animate() {
    drawBall();      // Desenha a bola na tela
    updateBall();    // Atualiza a física (posição, velocidade)
    updateInfo();    // Atualiza informações na tela
    
    // Chama esta função novamente no próximo frame
    requestAnimationFrame(animate);
}

// ==========================================
// 8. CONTROLES INTERATIVOS
// ==========================================

function resetBall() {
    ball.x = 50;
    ball.y = canvas.height / 2;
    ball.vx = 6;
    ball.trail = [];
    ball.color = '#0095DD';
}

function increaseFriction() {
    if (ball.friction > 0.9) {
        ball.friction -= 0.01;
    }
}

function decreaseFriction() {
    if (ball.friction < 0.999) {
        ball.friction += 0.01;
    }
}

// ==========================================
// 9. INICIALIZAÇÃO DA SIMULAÇÃO
// ==========================================

// Inicia a animação quando a página carrega
animate();

// Clique no canvas para reiniciar
canvas.addEventListener('click', resetBall);

// Redimensiona o canvas se a janela mudar de tamanho
window.addEventListener('resize', function() {
    const newWidth = Math.min(window.innerWidth * 0.8, 800);
    const newHeight = Math.min(window.innerHeight * 0.6, 400);
    
    if (newWidth !== canvas.width || newHeight !== canvas.height) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        resetBall();
    }
});