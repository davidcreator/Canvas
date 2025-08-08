/* ========================================
    CONFIGURAÇÃO INICIAL DO CANVAS
    Descrição: Prepara o ambiente de desenho
======================================== */

// Seleciona o elemento canvas e define o contexto de desenho 2D
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Variável para controlar a animação
let animationId;
let isPaused = false;
let collisionCount = 0;

/* ========================================
    DEFINIÇÃO DOS OBJETOS
    Descrição: Cria os objetos com suas propriedades físicas
======================================== */

// Objeto 1 - Círculo vermelho (inicia na esquerda)
let obj1 = {
    x: 80,                          // Posição horizontal inicial
    y: canvas.height / 2,           // Posição vertical (centro)
    radius: 25,                     // Raio do círculo
    dx: 3,                          // Velocidade horizontal
    dy: 2,                          // Velocidade vertical
    color: '#e53935',               // Cor vermelha
    name: 'Objeto 1'
};

// Objeto 2 - Círculo azul (inicia na direita)
let obj2 = {
    x: canvas.width - 80,           // Posição horizontal inicial (lado direito)
    y: canvas.height / 2,           // Posição vertical (centro)
    radius: 25,                     // Raio do círculo
    dx: -2.5,                       // Velocidade horizontal (negativa = esquerda)
    dy: -1.5,                       // Velocidade vertical (negativa = para cima)
    color: '#1e88e5',               // Cor azul
    name: 'Objeto 2'
};

/* ========================================
    FUNÇÃO DE DESENHO DOS OBJETOS
    Descrição: Renderiza um objeto circular no canvas
======================================== */

function drawObject(obj) {
    // Inicia um novo caminho de desenho
    ctx.beginPath();
    
    // Desenha um círculo completo (0 a 2π radianos = 360°)
    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
    
    // Define a cor de preenchimento do objeto
    ctx.fillStyle = obj.color;
    
    // Preenche o círculo com a cor definida
    ctx.fill();
    
    // Adiciona uma borda preta ao círculo
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fecha o caminho de desenho (boa prática)
    ctx.closePath();
    
    // Desenha o nome do objeto no centro
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(obj.name, obj.x, obj.y + 4);
}

/* ========================================
    DETECÇÃO DE COLISÃO
    Descrição: Verifica se dois objetos circulares estão colidindo
======================================== */

function checkCollision(obj1, obj2) {
    // Calcula a diferença entre as posições x dos objetos
    const dx = obj1.x - obj2.x;
    
    // Calcula a diferença entre as posições y dos objetos
    const dy = obj1.y - obj2.y;
    
    // Aplica o Teorema de Pitágoras para encontrar a distância
    // Distância = √(dx² + dy²)
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Verifica se a distância é menor que a soma dos raios
    // Se sim, os círculos estão se sobrepondo (colisão!)
    const isColliding = distance < obj1.radius + obj2.radius;
    
    // Atualiza o status visual
    updateCollisionStatus(isColliding, distance);
    
    return isColliding;
}

/* ========================================
    RESOLUÇÃO DE COLISÃO
    Descrição: Altera as velocidades dos objetos após colisão
======================================== */

function resolveCollision(obj1, obj2) {
    // Armazena temporariamente as velocidades do objeto 1
    const tempDx = obj1.dx;
    const tempDy = obj1.dy;
    
    // Troca as velocidades (simulação simples de colisão elástica)
    obj1.dx = obj2.dx;
    obj1.dy = obj2.dy;
    obj2.dx = tempDx;
    obj2.dy = tempDy;
    
    // Conta as colisões para estatísticas
    collisionCount++;
    
    // Adiciona um pequeno efeito visual de "empurrão"
    separateObjects(obj1, obj2);
}

/* ========================================
    SEPARAÇÃO DE OBJETOS
    Descrição: Evita que objetos fiquem "grudados"
======================================== */

function separateObjects(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Se os objetos estão muito próximos, os separa
    if (distance < obj1.radius + obj2.radius) {
        const overlap = obj1.radius + obj2.radius - distance;
        const separationX = (dx / distance) * (overlap / 2);
        const separationY = (dy / distance) * (overlap / 2);
        
        obj1.x += separationX;
        obj1.y += separationY;
        obj2.x -= separationX;
        obj2.y -= separationY;
    }
}

/* ========================================
    GERADOR DE DIREÇÃO ALEATÓRIA
    Descrição: Cria uma nova direção aleatória para o objeto
======================================== */

function randomDirection(speed = 2.5) {
    // Gera um ângulo aleatório entre 0 e 2π (0° a 360°)
    const angle = Math.random() * 2 * Math.PI;
    
    return {
        // Calcula a componente horizontal usando cosseno
        dx: Math.cos(angle) * speed,
        // Calcula a componente vertical usando seno
        dy: Math.sin(angle) * speed
    };
}

/* ========================================
    VERIFICAÇÃO DE COLISÃO COM BORDAS
    Descrição: Detecta quando objeto atinge os limites do canvas
======================================== */

function checkCanvasCollision(obj) {
    // Verifica colisão com as bordas horizontais (esquerda e direita)
    if (obj.x + obj.dx > canvas.width - obj.radius || obj.x + obj.dx < obj.radius) {
        const newDirection = randomDirection(Math.abs(obj.dx));
        obj.dx = newDirection.dx;
        obj.dy = newDirection.dy;
    }
    
    // Verifica colisão com as bordas verticais (topo e base)
    if (obj.y + obj.dy > canvas.height - obj.radius || obj.y + obj.dy < obj.radius) {
        const newDirection = randomDirection(Math.abs(obj.dy));
        obj.dx = newDirection.dx;
        obj.dy = newDirection.dy;
    }
}

/* ========================================
    ATUALIZAÇÃO DA INTERFACE
    Descrição: Atualiza as informações mostradas na tela
======================================== */

function updateUI() {
    // Atualiza informações do Objeto 1
    document.getElementById('obj1-pos').textContent = 
        `(${Math.round(obj1.x)}, ${Math.round(obj1.y)})`;
    document.getElementById('obj1-vel').textContent = 
        `(${obj1.dx.toFixed(1)}, ${obj1.dy.toFixed(1)})`;
    document.getElementById('obj1-radius').textContent = obj1.radius;
    
    // Atualiza informações do Objeto 2
    document.getElementById('obj2-pos').textContent = 
        `(${Math.round(obj2.x)}, ${Math.round(obj2.y)})`;
    document.getElementById('obj2-vel').textContent = 
        `(${obj2.dx.toFixed(1)}, ${obj2.dy.toFixed(1)})`;
    document.getElementById('obj2-radius').textContent = obj2.radius;
}

/* ========================================
    ATUALIZAÇÃO DO STATUS DE COLISÃO
    Descrição: Mostra se há colisão acontecendo
======================================== */

function updateCollisionStatus(isColliding, distance) {
    const statusElement = document.getElementById('status');
    
    if (isColliding) {
        statusElement.textContent = '🔴 COLISÃO DETECTADA!';
        statusElement.className = 'status collision-detected';
    } else {
        statusElement.textContent = `🟢 Sem colisão (Distância: ${Math.round(distance)}px)`;
        statusElement.className = 'status no-collision';
    }
}

/* ========================================
    LOOP PRINCIPAL DE ANIMAÇÃO
    Descrição: Função que executa continuamente para animar os objetos
======================================== */

function update() {
    if (isPaused) return;
    
    // 1. Limpa todo o canvas para o próximo frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. Desenha ambos os objetos nas posições atuais
    drawObject(obj1);
    drawObject(obj2);
    
    // 3. Verifica se os objetos estão colidindo
    if (checkCollision(obj1, obj2)) {
        // Se há colisão, resolve alterando as velocidades
        resolveCollision(obj1, obj2);
    }
    
    // 4. Verifica colisões com as bordas do canvas
    checkCanvasCollision(obj1);
    checkCanvasCollision(obj2);
    
    // 5. Atualiza as posições dos objetos baseado na velocidade
    obj1.x += obj1.dx;
    obj1.y += obj1.dy;
    obj2.x += obj2.dx;
    obj2.y += obj2.dy;
    
    // 6. Atualiza a interface com as informações atuais
    updateUI();
    
    // 7. Agenda o próximo frame da animação
    animationId = requestAnimationFrame(update);
}

/* ========================================
    FUNÇÕES DE CONTROLE DA ANIMAÇÃO
    Descrição: Permitem pausar, continuar e reiniciar
======================================== */

function pauseAnimation() {
    isPaused = true;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
}

function resumeAnimation() {
    if (isPaused) {
        isPaused = false;
        update();
    }
}

function resetAnimation() {
    // Para a animação atual
    pauseAnimation();
    
    // Redefine as posições iniciais
    obj1.x = 80;
    obj1.y = canvas.height / 2;
    obj1.dx = 3;
    obj1.dy = 2;
    
    obj2.x = canvas.width - 80;
    obj2.y = canvas.height / 2;
    obj2.dx = -2.5;
    obj2.dy = -1.5;
    
    // Reinicia a animação
    collisionCount = 0;
    resumeAnimation();
}

function randomizeObjects() {
    // Gera posições aleatórias para os objetos
    obj1.x = obj1.radius + Math.random() * (canvas.width - 2 * obj1.radius);
    obj1.y = obj1.radius + Math.random() * (canvas.height - 2 * obj1.radius);
    
    obj2.x = obj2.radius + Math.random() * (canvas.width - 2 * obj2.radius);
    obj2.y = obj2.radius + Math.random() * (canvas.height - 2 * obj2.radius);
    
    // Gera velocidades aleatórias
    const dir1 = randomDirection(3);
    const dir2 = randomDirection(3);
    
    obj1.dx = dir1.dx;
    obj1.dy = dir1.dy;
    obj2.dx = dir2.dx;
    obj2.dy = dir2.dy;
}

/* ========================================
    INICIALIZAÇÃO DO PROGRAMA
    Descrição: Inicia a execução quando a página carrega
======================================== */

// Inicia a animação assim que o script carrega
update();

// Atualiza a interface inicial
updateUI();

console.log('🎯 Sistema de colisão inicializado!');
console.log('📚 Este projeto demonstra:');
console.log('   • Detecção de colisão entre círculos');
console.log('   • Física básica de movimento');
console.log('   • Animação com requestAnimationFrame');
console.log('   • Matemática aplicada (Teorema de Pitágoras)');