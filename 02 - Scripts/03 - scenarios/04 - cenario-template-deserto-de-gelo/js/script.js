/* ========================================
    SCRIPT JAVASCRIPT - CENÁRIO DE DESERTO GELADO
    Autor: [Seu Nome]
    Descrição: Desenha um cenário completo de deserto gelado
    usando Canvas HTML5 e JavaScript
======================================== */

// === CONFIGURAÇÃO INICIAL ===
// Obtém o elemento canvas do HTML
const canvas = document.getElementById('gameCanvas');
// Obtém o contexto 2D para desenhar no canvas
const context = canvas.getContext('2d');

// === PALETA DE CORES ===
const CORES = {
    ceuAzul: '#87CEEB',        // Azul claro para o céu
    neve: '#FFFFFF',           // Branco para neve
    montanha: '#A9A9A9',       // Cinza para montanhas
    tronco: '#8B4513',         // Marrom para troncos
    folhas: '#228B22',         // Verde para folhagem
    lago: '#1E90FF',           // Azul para água
    gelo: 'rgba(255, 255, 255, 0.7)', // Branco semi-transparente
    igluEntrada: '#DCDCDC'     // Cinza claro
};

/* ========================================
    FUNÇÃO 1: DESENHAR FUNDO
    Descrição: Cria o cenário base com céu e solo
======================================== */
function desenharFundo() {
    console.log('🎨 Desenhando o fundo...');
    
    // Desenha o céu azul
    context.fillStyle = CORES.ceuAzul;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o solo de neve
    context.fillStyle = CORES.neve;
    context.fillRect(0, canvas.height - 100, canvas.width, 100);
}

/* ========================================
    FUNÇÃO 2: DESENHAR MONTANHA
    Parâmetros: x (posição horizontal), y (posição vertical)
    Descrição: Desenha uma montanha triangular com cume nevado
======================================== */
function desenharMontanha(x, y) {
    console.log(`🏔️ Desenhando montanha na posição (${x}, ${y})`);
    
    // Corpo principal da montanha (triângulo cinza)
    context.fillStyle = CORES.montanha;
    context.beginPath();
    context.moveTo(x, y);                    // Ponto base esquerdo
    context.lineTo(x + 100, y - 150);        // Pico da montanha
    context.lineTo(x + 200, y);              // Ponto base direito
    context.closePath();
    context.fill();

    // Cume nevado (triângulo menor branco)
    context.fillStyle = CORES.neve;
    context.beginPath();
    context.moveTo(x + 100, y - 150);        // Pico
    context.lineTo(x + 130, y - 120);        // Lado direito do cume
    context.lineTo(x + 70, y - 120);         // Lado esquerdo do cume
    context.closePath();
    context.fill();
}

/* ========================================
    FUNÇÃO 3: DESENHAR ÁRVORE NEVADA
    Parâmetros: x (posição horizontal), y (posição vertical)
    Descrição: Desenha uma árvore com tronco marrom e copa verde com neve
======================================== */
function desenharArvoreNevada(x, y) {
    console.log(`🌲 Desenhando árvore nevada na posição (${x}, ${y})`);
    
    // Tronco da árvore (retângulo marrom)
    context.fillStyle = CORES.tronco;
    context.fillRect(x, y - 50, 20, 50);

    // Copa da árvore (triângulo verde)
    context.fillStyle = CORES.folhas;
    context.beginPath();
    context.moveTo(x - 30, y - 50);          // Base esquerda
    context.lineTo(x + 10, y - 100);         // Topo da copa
    context.lineTo(x + 50, y - 50);          // Base direita
    context.closePath();
    context.fill();

    // Neve na copa (triângulo branco menor)
    context.fillStyle = CORES.neve;
    context.beginPath();
    context.moveTo(x - 20, y - 60);          // Base esquerda da neve
    context.lineTo(x + 10, y - 90);          // Topo da neve
    context.lineTo(x + 40, y - 60);          // Base direita da neve
    context.closePath();
    context.fill();
}

/* ========================================
    FUNÇÃO 4: DESENHAR LAGO CONGELADO
    Descrição: Desenha um lago elíptico com camada de gelo
======================================== */
function desenharLagoCongelado() {
    console.log('🏊 Desenhando lago congelado...');
    
    // Água do lago (elipse azul)
    context.fillStyle = CORES.lago;
    context.beginPath();
    context.ellipse(400, canvas.height - 50, 100, 50, 0, 0, Math.PI * 2);
    context.fill();

    // Camada de gelo (elipse branca semi-transparente)
    context.fillStyle = CORES.gelo;
    context.beginPath();
    context.ellipse(400, canvas.height - 50, 80, 40, 0, 0, Math.PI * 2);
    context.fill();
}

/* ========================================
    FUNÇÃO 5: DESENHAR IGLU
    Parâmetros: x (posição horizontal), y (posição vertical)
    Descrição: Desenha um iglu com entrada escura
======================================== */
function desenharIglu(x, y) {
    console.log(`🏠 Desenhando iglu na posição (${x}, ${y})`);
    
    // Corpo do iglu (semicírculo branco)
    context.fillStyle = CORES.neve;
    context.beginPath();
    context.arc(x, y, 40, 0, Math.PI, true);  // Semicírculo superior
    context.fill();
    context.fillRect(x - 40, y, 80, 30);      // Base retangular

    // Entrada do iglu (semicírculo menor cinza)
    context.fillStyle = CORES.igluEntrada;
    context.beginPath();
    context.arc(x, y, 20, 0, Math.PI, true);
    context.fill();
}

/* ========================================
    FUNÇÃO 6: ADICIONAR FLOCOS DE NEVE
    Descrição: Adiciona pequenos flocos de neve no ar
======================================== */
function adicionarFlocosDeNeve() {
    console.log('❄️ Adicionando flocos de neve...');
    
    context.fillStyle = CORES.neve;
    
    // Desenha vários flocos pequenos em posições aleatórias
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height - 100);
        
        context.beginPath();
        context.arc(x, y, 2, 0, Math.PI * 2);
        context.fill();
    }
}

/* ========================================
    FUNÇÃO PRINCIPAL: DESENHAR CENÁRIO COMPLETO
    Descrição: Chama todas as funções na ordem correta
======================================== */
function desenharCenarioCompleto() {
    console.log('🎬 Iniciando desenho do cenário...');
    
    // 1. Desenha o fundo (sempre primeiro)
    desenharFundo();
    
    // 2. Desenha as montanhas ao fundo
    desenharMontanha(50, canvas.height - 100);     // Montanha da esquerda
    desenharMontanha(550, canvas.height - 100);    // Montanha da direita
    
    // 3. Desenha o lago congelado
    desenharLagoCongelado();
    
    // 4. Desenha as árvores nevadas
    desenharArvoreNevada(200, canvas.height - 100);  // Árvore da esquerda
    desenharArvoreNevada(650, canvas.height - 100);  // Árvore da direita
    
    // 5. Desenha o iglu
    desenharIglu(400, canvas.height - 130);
    
    // 6. Adiciona flocos de neve no ar
    adicionarFlocosDeNeve();
    
    console.log('✅ Cenário desenhado com sucesso!');
}

/* ========================================
    EXECUÇÃO DO PROGRAMA
======================================== */

// Aguarda o carregamento completo da página
window.addEventListener('load', function() {
    console.log('📖 Página carregada. Iniciando desenho...');
    desenharCenarioCompleto();
});

// Permite redesenhar o cenário clicando no canvas
canvas.addEventListener('click', function() {
    console.log('🖱️ Canvas clicado. Redesenhando...');
    desenharCenarioCompleto();
});

/* ========================================
    INFORMAÇÕES TÉCNICAS PARA OS ALUNOS:
    
    🎨 Canvas HTML5: Elemento para desenho 2D
    📐 Coordenadas: (0,0) = canto superior esquerdo
    🎯 Context 2D: Interface para desenhar formas
    🌈 fillStyle: Define a cor de preenchimento
    📏 fillRect(): Desenha retângulos preenchidos
    ⭕ arc(): Desenha círculos e arcos
    📐 beginPath(): Inicia um novo caminho
    ✏️ moveTo()/lineTo(): Define pontos de linha
    🔒 closePath(): Fecha o caminho atual
======================================== */