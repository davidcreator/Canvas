/* ============================================
    TUTORIAL: DETECÇÃO DE COLISÃO EM CANVAS
    Autor: Professor
    Data: 2025
    Objetivo: Ensinar conceitos básicos de colisão
============================================ */

// ====================================
// 1. CONFIGURAÇÃO INICIAL DO CANVAS
// ====================================

// Seleciona o elemento canvas do HTML e define o contexto 2D para desenhar
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Seleciona o elemento que mostrará o status da animação
const statusElement = document.getElementById('status');

// ====================================
// 2. DEFINIÇÃO DOS OBJETOS DO JOGO
// ====================================

// Variável para controlar se a animação está pausada
let isPaused = false;
let animationId;

// Objeto 1: Círculo azul que se move da esquerda para a direita
let objeto1 = {
    x: 50,                    // Posição horizontal inicial
    y: canvas.height / 2,     // Posição vertical (centro do canvas)
    raio: 25,                 // Tamanho do círculo
    velocidadeX: 3,           // Velocidade de movimento horizontal
    velocidadeY: 0,           // Velocidade de movimento vertical
    cor: '#2196F3'            // Cor azul
};

// Objeto 2: Círculo vermelho que se move da direita para a esquerda
let objeto2 = {
    x: canvas.width - 50,     // Posição horizontal inicial (lado direito)
    y: canvas.height / 2,     // Posição vertical (centro do canvas)
    raio: 25,                 // Tamanho do círculo
    velocidadeX: -3,          // Velocidade negativa (move para a esquerda)
    velocidadeY: 0,           // Velocidade de movimento vertical
    cor: '#f44336'            // Cor vermelha
};

// ====================================
// 3. FUNÇÃO PARA DESENHAR UM OBJETO
// ====================================

/**
 * Desenha um objeto circular no canvas
 * @param {Object} obj - O objeto a ser desenhado
 */
function desenharObjeto(obj) {
    // Salva o estado atual do contexto
    ctx.save();
    
    // Inicia um novo caminho de desenho
    ctx.beginPath();
    
    // Desenha um círculo completo (0 a 2π radianos = 360 graus)
    ctx.arc(obj.x, obj.y, obj.raio, 0, Math.PI * 2);
    
    // Define a cor de preenchimento
    ctx.fillStyle = obj.cor;
    
    // Preenche o círculo com a cor
    ctx.fill();
    
    // Adiciona uma borda preta ao círculo
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fecha o caminho de desenho
    ctx.closePath();
    
    // Restaura o estado do contexto
    ctx.restore();
}

// ====================================
// 4. FUNÇÃO PARA DETECTAR COLISÃO
// ====================================

/**
 * Verifica se dois objetos circulares estão colidindo
 * @param {Object} obj1 - Primeiro objeto
 * @param {Object} obj2 - Segundo objeto
 * @returns {boolean} - true se houver colisão, false caso contrário
 */
function detectarColisao(obj1, obj2) {
    // Calcula a diferença entre as posições X dos objetos
    const diferencaX = obj1.x - obj2.x;
    
    // Calcula a diferença entre as posições Y dos objetos
    const diferencaY = obj1.y - obj2.y;
    
    // Calcula a distância entre os centros dos objetos usando o Teorema de Pitágoras
    const distancia = Math.sqrt(diferencaX * diferencaX + diferencaY * diferencaY);
    
    // Se a distância for menor que a soma dos raios, há colisão
    const somaRaios = obj1.raio + obj2.raio;
    
    return distancia < somaRaios;
}

// ====================================
// 5. FUNÇÃO PARA ATUALIZAR A ANIMAÇÃO
// ====================================

/**
 * Função principal que atualiza a animação a cada frame
 */
function atualizarAnimacao() {
    // Se a animação estiver pausada, não faz nada
    if (isPaused) {
        animationId = requestAnimationFrame(atualizarAnimacao);
        return;
    }
    
    // Limpa todo o canvas para redesenhar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o fundo com um gradiente sutil
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Verifica se há colisão entre os objetos
    const temColisao = detectarColisao(objeto1, objeto2);
    
    if (temColisao) {
        // Se houver colisão, para o movimento dos objetos
        objeto1.velocidadeX = 0;
        objeto2.velocidadeX = 0;
        
        // Atualiza o status visual
        statusElement.textContent = '🔴 COLISÃO DETECTADA! Os objetos pararam.';
        statusElement.className = 'status collision';
        
        // Adiciona efeito visual de colisão
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(objeto1.x, objeto1.y, objeto1.raio + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(objeto2.x, objeto2.y, objeto2.raio + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    } else {
        // Se não houver colisão, mantém o status normal
        statusElement.textContent = '🟢 Objetos em movimento - Aguardando colisão...';
        statusElement.className = 'status normal';
    }
    
    // Atualiza as posições dos objetos
    objeto1.x += objeto1.velocidadeX;
    objeto1.y += objeto1.velocidadeY;
    objeto2.x += objeto2.velocidadeX;
    objeto2.y += objeto2.velocidadeY;
    
    // Desenha os objetos nas novas posições
    desenharObjeto(objeto1);
    desenharObjeto(objeto2);
    
    // Desenha informações na tela
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText(`Objeto 1: X=${Math.round(objeto1.x)}, Y=${Math.round(objeto1.y)}`, 10, 20);
    ctx.fillText(`Objeto 2: X=${Math.round(objeto2.x)}, Y=${Math.round(objeto2.y)}`, 10, 40);
    
    const distancia = Math.sqrt(Math.pow(objeto1.x - objeto2.x, 2) + Math.pow(objeto1.y - objeto2.y, 2));
    ctx.fillText(`Distância entre objetos: ${Math.round(distancia)}px`, 10, 60);
    
    // Agenda o próximo frame da animação
    animationId = requestAnimationFrame(atualizarAnimacao);
}

// ====================================
// 6. FUNÇÕES DE CONTROLE
// ====================================

/**
 * Reinicia a animação com valores iniciais
 */
function restartAnimation() {
    // Cancela a animação atual
    cancelAnimationFrame(animationId);
    
    // Reseta as posições e velocidades dos objetos
    objeto1 = {
        x: 50,
        y: canvas.height / 2,
        raio: 25,
        velocidadeX: 3,
        velocidadeY: 0,
        cor: '#2196F3'
    };
    
    objeto2 = {
        x: canvas.width - 50,
        y: canvas.height / 2,
        raio: 25,
        velocidadeX: -3,
        velocidadeY: 0,
        cor: '#f44336'
    };
    
    // Reseta o status
    isPaused = false;
    statusElement.textContent = '🟢 Objetos em movimento - Aguardando colisão...';
    statusElement.className = 'status normal';
    
    // Reinicia a animação
    atualizarAnimacao();
}

/**
 * Pausa ou continua a animação
 */
function togglePause() {
    isPaused = !isPaused;
    const button = document.querySelector('button[onclick="togglePause()"]');
    button.textContent = isPaused ? '▶️ Continuar' : '⏸️ Pausar';
}

// ====================================
// 7. INICIALIZAÇÃO DO PROGRAMA
// ====================================

// Inicia a animação quando a página carregar
window.addEventListener('load', function() {
    console.log('🚀 Tutorial de Colisão iniciado!');
    console.log('📖 Observe como os objetos se movem e colidem');
    atualizarAnimacao();
});

// Adiciona controles de teclado
window.addEventListener('keydown', function(event) {
    switch(event.code) {
        case 'Space':
            event.preventDefault();
            togglePause();
            break;
        case 'KeyR':
            event.preventDefault();
            restartAnimation();
            break;
    }
});