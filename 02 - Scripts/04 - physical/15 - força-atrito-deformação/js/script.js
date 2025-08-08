/* ===== CÓDIGO JAVASCRIPT - SIMULAÇÃO DE FÍSICA ===== */

// === 1. CONFIGURAÇÃO INICIAL DO CANVAS ===
// Obtém referência do elemento canvas no HTML
const canvas = document.getElementById('canvas');
// Obtém o contexto 2D para desenhar no canvas
const ctx = canvas.getContext('2d');

// Define as dimensões do canvas
canvas.width = 600;  // Largura fixa para melhor controle
canvas.height = 300; // Altura fixa para melhor controle

// === 2. OBJETO BOLA - PROPRIEDADES FÍSICAS ===
let ball = {
    // Posição inicial
    x: 50,                          // Posição horizontal (em pixels)
    y: canvas.height / 2,           // Posição vertical (centro do canvas)
    
    // Propriedades físicas
    radius: 20,                     // Raio da bola (em pixels)
    vx: 8,                          // Velocidade horizontal inicial (pixels por frame)
    vy: 0,                          // Velocidade vertical (zero = movimento horizontal)
    
    // Propriedades do material
    friction: 0.995,                // Coeficiente de atrito (0.995 = perde 0.5% da velocidade por frame)
    restitution: 0.8,               // Coeficiente de restituição (elasticidade das colisões)
    
    // Propriedades visuais
    color: '#0095DD',               // Cor da bola (azul)
    deformed: false,                // Flag para indicar se está deformada
    deformScale: 1.3,               // Quanto a bola se deforma nas colisões
    deformTimer: 0                  // Contador para controlar duração da deformação
};

// === 3. VARIÁVEIS DE CONTROLE DA SIMULAÇÃO ===
let isPaused = false;               // Controla se a animação está pausada
let frameCount = 0;                 // Contador de frames (para debug)
let collisionCount = 0;             // Contador de colisões

// === 4. FUNÇÃO DE DESENHO ===
function drawBall() {
    // Limpa todo o canvas antes de desenhar o próximo frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha uma linha de referência no centro (opcional)
    ctx.strokeStyle = '#ddd';
    ctx.setLineDash([5, 5]); // Linha pontilhada
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]); // Remove linha pontilhada
    
    // Configura a cor da bola
    ctx.fillStyle = ball.color;
    
    // Desenha a bola (normal ou deformada)
    ctx.beginPath();
    if (ball.deformed) {
        // Bola deformada (elipse) durante colisão
        ctx.ellipse(
            ball.x,                     // Centro X
            ball.y,                     // Centro Y
            ball.radius * ball.deformScale, // Raio horizontal (aumentado)
            ball.radius * 0.8,          // Raio vertical (diminuído)
            0,                          // Rotação
            0,                          // Ângulo inicial
            Math.PI * 2                 // Ângulo final (círculo completo)
        );
    } else {
        // Bola normal (círculo perfeito)
        ctx.arc(
            ball.x,                     // Centro X
            ball.y,                     // Centro Y
            ball.radius,                // Raio
            0,                          // Ângulo inicial
            Math.PI * 2                 // Ângulo final
        );
    }
    ctx.fill();
    ctx.closePath();
    
    // Adiciona um reflexo para dar efeito 3D
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(ball.x - ball.radius/3, ball.y - ball.radius/3, ball.radius/3, 0, Math.PI * 2);
    ctx.fill();
}

// === 5. FUNÇÃO DE FÍSICA - ATUALIZAÇÃO DO MOVIMENTO ===
function updateBall() {
    // Aplica o atrito (reduz a velocidade gradualmente)
    ball.vx *= ball.friction;
    
    // Atualiza a posição baseada na velocidade
    ball.x += ball.vx;
    
    // === DETECÇÃO DE COLISÕES COM AS BORDAS ===
    
    // Colisão com a borda direita
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius; // Reposiciona para não atravessar a borda
        ball.vx *= -ball.restitution;        // Inverte direção e aplica perda de energia
        ball.deformed = true;                // Ativa deformação visual
        ball.deformTimer = 10;               // Define duração da deformação
        collisionCount++;                    // Incrementa contador de colisões
    }
    
    // Colisão com a borda esquerda
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;                // Reposiciona para não atravessar a borda
        ball.vx *= -ball.restitution;        // Inverte direção e aplica perda de energia
        ball.deformed = true;                // Ativa deformação visual
        ball.deformTimer = 10;               // Define duração da deformação
        collisionCount++;                    // Incrementa contador de colisões
    }
    
    // === CONTROLE DA DEFORMAÇÃO VISUAL ===
    if (ball.deformed) {
        ball.deformTimer--;
        if (ball.deformTimer <= 0) {
            ball.deformed = false;           // Remove deformação após o timer
        }
    }
    
    // === CONDIÇÃO DE PARADA (BAIXA VELOCIDADE) ===
    // Se a velocidade for muito baixa, para o movimento completamente
    if (Math.abs(ball.vx) < 0.1) {
        ball.vx = 0;
    }
    
    // Incrementa contador de frames
    frameCount++;
    
    // Atualiza informações na tela
    updateInfoPanel();
}

// === 6. FUNÇÃO DE ATUALIZAÇÃO DAS INFORMAÇÕES ===
function updateInfoPanel() {
    // Atualiza posição
    document.getElementById('posicao-x').textContent = Math.round(ball.x);
    
    // Atualiza velocidade
    document.getElementById('velocidade').textContent = ball.vx.toFixed(2);
    
    // Calcula e atualiza energia cinética relativa (proporcional a v²)
    const energia = (ball.vx * ball.vx * 0.5).toFixed(2);
    document.getElementById('energia').textContent = energia;
    
    // Atualiza status do movimento
    const status = Math.abs(ball.vx) < 0.1 ? 'Parado' : 'Em movimento';
    document.getElementById('status').textContent = status;
    
    // Atualiza contador de colisões
    document.getElementById('colisoes').textContent = collisionCount;
}

// === 7. FUNÇÃO PRINCIPAL DE ANIMAÇÃO ===
function animate() {
    if (!isPaused) {
        drawBall();     // Desenha a bola na posição atual
        updateBall();   // Atualiza física e posição para o próximo frame
    }
    
    // Solicita o próximo frame de animação (60 FPS típico)
    requestAnimationFrame(animate);
}

// === 8. FUNÇÕES DE CONTROLE INTERATIVO ===

// Reinicia a simulação com valores iniciais
function reiniciarSimulacao() {
    ball.x = 50;
    ball.y = canvas.height / 2;
    ball.vx = 8;
    ball.vy = 0;
    ball.deformed = false;
    ball.deformTimer = 0;
    collisionCount = 0;
    frameCount = 0;
    isPaused = false;
}

// Pausa ou continua a animação
function alternarPausa() {
    isPaused = !isPaused;
}

// Aumenta a velocidade da bola
function aumentarVelocidade() {
    ball.vx += ball.vx > 0 ? 5 : -5; // Adiciona velocidade na direção atual
}

// === 9. INICIALIZAÇÃO ===
// Inicia a animação quando a página carrega
animate();

// === 10. EXPLICAÇÕES TEÓRICAS (COMENTÁRIOS DIDÁTICOS) ===
/*
CONCEITOS FÍSICOS DEMONSTRADOS:

1. ATRITO CINÉTICO:
    - O coeficiente ball.friction (0.995) simula a resistência do ar
    - A cada frame, a velocidade é multiplicada por este valor
    - Isso causa uma desaceleração exponencial realística

2. CONSERVAÇÃO DE ENERGIA:
    - Energia cinética = ½mv² (representada por vx²/2 na interface)
    - O atrito converte energia cinética em calor (energia perdida)

3. COLISÕES ELÁSTICAS:
    - O coeficiente ball.restitution (0.8) determina quanto da energia é preservada
    - Valor 1.0 = colisão perfeitamente elástica
    - Valores < 1.0 = colisão inelástica (energia perdida)

4. DEFORMAÇÃO DE OBJETOS:
    - Durante colisões, objetos reais se deformam momentaneamente
    - Simulamos isso mudando a forma de círculo para elipse

5. MOVIMENTO RETILÍNEO UNIFORME:
    - Entre colisões, a bola mantém velocidade constante (ignorando atrito)
    - Posição = posição_inicial + velocidade × tempo

APLICAÇÕES PRÁTICAS:
- Simulação de jogos (física de bolas, colisões)
- Engenharia (cálculo de trajetórias, impactos)
- Educação (visualização de conceitos físicos)
*/