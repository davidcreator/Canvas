// ===== CONFIGURAÇÃO DO CANVAS =====
// Obtém o elemento canvas e seu contexto 2D para desenhar
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define o tamanho do canvas baseado na tela do usuário
canvas.width = Math.min(800, window.innerWidth * 0.9);
canvas.height = Math.min(400, window.innerHeight * 0.4);

// ===== OBJETO BOLA =====
// Define todas as propriedades físicas da bola
const ball = {
    // Propriedades de posição
    x: 50,                          // Posição horizontal inicial
    y: canvas.height / 2,           // Posição vertical (centro)
    radius: 20,                     // Raio da bola
    
    // Propriedades de movimento
    vx: 15,                         // Velocidade horizontal inicial
    friction: 0.995,                // Coeficiente de atrito (quanto menor, mais atrito)
    
    // Propriedades visuais
    state: 'accelerating',          // Estado atual do movimento
    deformation: 1,                 // Escala de deformação (1 = normal)
    
    // Propriedades de cor
    color: '#FF6B6B',              // Cor da bola
    trail: []                       // Array para guardar posições anteriores (rastro)
};

// ===== ELEMENTOS DE INTERFACE =====
// Referências para atualizar informações na tela
const velocityDisplay = document.getElementById('velocity');
const positionDisplay = document.getElementById('position');
const stateDisplay = document.getElementById('state');
const deformationDisplay = document.getElementById('deformation');

// ===== FUNÇÃO DE DESENHO =====
// Responsável por desenhar todos os elementos na tela
function drawBall() {
    // Limpa todo o canvas para o próximo frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o rastro da bola (posições anteriores)
    drawTrail();
    
    // Desenha a bola principal
    ctx.save(); // Salva o estado atual do contexto
    
    // Move o ponto de origem para o centro da bola
    ctx.translate(ball.x, ball.y);
    
    // Inicia o desenho da bola
    ctx.beginPath();
    
    // Desenha uma elipse (permite deformação)
    ctx.ellipse(0, 0, ball.radius * ball.deformation, ball.radius, 0, 0, Math.PI * 2);
    
    // Define a cor e preenche a bola
    ctx.fillStyle = ball.color;
    ctx.fill();
    
    // Adiciona uma borda preta
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Adiciona brilho na bola
    addGlowEffect();
    
    ctx.restore(); // Restaura o estado do contexto
}

// ===== EFEITO DE RASTRO =====
// Desenha o rastro deixado pela bola
function drawTrail() {
    if (ball.trail.length > 1) {
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        // Conecta todas as posições do rastro
        for (let i = 0; i < ball.trail.length; i++) {
            if (i === 0) {
                ctx.moveTo(ball.trail[i].x, ball.trail[i].y);
            } else {
                ctx.lineTo(ball.trail[i].x, ball.trail[i].y);
            }
        }
        ctx.stroke();
    }
}

// ===== EFEITO DE BRILHO =====
// Adiciona um efeito visual de brilho na bola
function addGlowEffect() {
    // Cria um gradiente radial para simular brilho
    const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, ball.radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, ball.radius * ball.deformation, ball.radius, 0, 0, Math.PI * 2);
    ctx.fill();
}

// ===== LÓGICA DE MOVIMENTO =====
// Atualiza a posição e propriedades da bola
function updateBall() {
    // Adiciona posição atual ao rastro
    ball.trail.push({x: ball.x, y: ball.y});
    
    // Limita o tamanho do rastro
    if (ball.trail.length > 20) {
        ball.trail.shift(); // Remove a posição mais antiga
    }
    
    // ===== SISTEMA DE ESTADOS =====
    // Define o comportamento visual baseado no estado atual
    switch (ball.state) {
        case 'accelerating':
            ball.deformation = 1.3;     // Estica durante aceleração
            ball.color = '#FF6B6B';     // Vermelho
            break;
            
        case 'collision':
            ball.deformation = 0.7;     // Achata durante colisão
            ball.color = '#FFD93D';     // Amarelo
            break;
            
        case 'decelerating':
            ball.deformation = 1.1;     // Deformação leve
            ball.color = '#6BCF7F';     // Verde
            break;
            
        case 'stopped':
            ball.deformation = 1.0;     // Forma normal
            ball.color = '#A8A8A8';     // Cinza
            break;
            
        default:
            ball.deformation = 1.0;     // Forma normal
            ball.color = '#FF6B6B';     // Vermelho padrão
    }

    // ===== APLICAÇÃO DO ATRITO =====
    // Reduz a velocidade gradualmente
    ball.vx *= ball.friction;
    
    // ===== ATUALIZAÇÃO DA POSIÇÃO =====
    // Move a bola baseado na velocidade
    ball.x += ball.vx;

    // ===== DETECÇÃO DE COLISÕES =====
    // Verifica colisão com a parede direita
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;  // Corrige a posição
        ball.vx *= -0.8;  // Inverte velocidade com perda de energia
        ball.state = 'collision';  // Muda para estado de colisão
        
        // Cria efeito visual de partículas na colisão
        createCollisionEffect();
    }
    
    // Verifica colisão com a parede esquerda
    if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;  // Corrige a posição
        ball.vx *= -0.8;  // Inverte velocidade com perda de energia
        ball.state = 'collision';  // Muda para estado de colisão
        
        // Cria efeito visual de partículas na colisão
        createCollisionEffect();
    }

    // ===== TRANSIÇÕES DE ESTADO =====
    // Determina o próximo estado baseado na velocidade
    if (ball.state === 'collision') {
        // Sai do estado de colisão após alguns frames
        setTimeout(() => {
            if (Math.abs(ball.vx) > 5) {
                ball.state = 'accelerating';
            } else {
                ball.state = 'decelerating';
            }
        }, 100);
    } else if (Math.abs(ball.vx) > 10) {
        ball.state = 'accelerating';   // Velocidade alta = acelerando
    } else if (Math.abs(ball.vx) > 0.1) {
        ball.state = 'decelerating';   // Velocidade baixa = desacelerando
    } else {
        ball.vx = 0;                   // Para completamente
        ball.state = 'stopped';        // Estado parado
        ball.trail = [];               // Limpa o rastro
    }

    // ===== ATUALIZAÇÃO DA INTERFACE =====
    // Mostra informações em tempo real
    updateDisplay();
}

// ===== EFEITO DE COLISÃO =====
// Cria partículas visuais quando há colisão
function createCollisionEffect() {
    // Array para armazenar partículas
    const particles = [];
    
    // Cria 10 partículas
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: ball.x,
            y: ball.y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 30,
            color: `hsl(${Math.random() * 60 + 30}, 70%, 60%)`
        });
    }
    
    // Anima as partículas
    function animateParticles() {
        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            ctx.save();
            ctx.globalAlpha = particle.life / 30;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            if (particle.life <= 0) {
                particles.splice(index, 1);
            }
        });
        
        if (particles.length > 0) {
            requestAnimationFrame(animateParticles);
        }
    }
    
    animateParticles();
}

// ===== ATUALIZAÇÃO DA INTERFACE =====
// Mostra valores em tempo real no painel de informações
function updateDisplay() {
    velocityDisplay.textContent = Math.abs(ball.vx).toFixed(2);
    positionDisplay.textContent = ball.x.toFixed(0);
    
    // Traduz estados para português
    const stateTranslations = {
        'accelerating': 'Acelerando',
        'collision': 'Colisão',
        'decelerating': 'Desacelerando',
        'stopped': 'Parado'
    };
    
    stateDisplay.textContent = stateTranslations[ball.state] || ball.state;
    deformationDisplay.textContent = ball.deformation.toFixed(2);
}

// ===== LOOP DE ANIMAÇÃO =====
// Função principal que roda continuamente
function animate() {
    drawBall();      // Desenha a bola e efeitos
    updateBall();    // Atualiza física e movimento
    
    // Chama a próxima animação no próximo frame
    requestAnimationFrame(animate);
}

// ===== CONTROLES INTERATIVOS =====
// Permite reiniciar a simulação clicando no canvas
canvas.addEventListener('click', function() {
    // Reseta todas as propriedades da bola
    ball.x = 50;
    ball.y = canvas.height / 2;
    ball.vx = 15 + Math.random() * 10;  // Velocidade aleatória
    ball.state = 'accelerating';
    ball.deformation = 1;
    ball.trail = [];
    ball.color = '#FF6B6B';
});

// ===== REDIMENSIONAMENTO RESPONSIVO =====
// Ajusta o canvas quando a janela muda de tamanho
window.addEventListener('resize', function() {
    canvas.width = Math.min(800, window.innerWidth * 0.9);
    canvas.height = Math.min(400, window.innerHeight * 0.4);
    
    // Reposiciona a bola se necessário
    if (ball.y > canvas.height) {
        ball.y = canvas.height / 2;
    }
});

// ===== INICIA A SIMULAÇÃO =====
// Começa a animação assim que a página carrega
animate();