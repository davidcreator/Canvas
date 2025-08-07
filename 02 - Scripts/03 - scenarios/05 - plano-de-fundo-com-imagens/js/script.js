/*
===============================================
        JOGO DE FLORESTA - SCRIPT DIDÁTICO
===============================================

Este script cria um cenário de floresta usando HTML5 Canvas.
Ele desenha um fundo, chão, árvores e arbustos para formar
um ambiente natural.

Autor: Professor
Data: 2025
Disciplina: Desenvolvimento de Jogos
*/

// ===============================================
//              1. CONFIGURAÇÃO INICIAL
// ===============================================

// Obtém o elemento canvas do HTML e seu contexto de renderização 2D
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Configurações do jogo
const CANVAS_WIDTH = canvas.width;   // Largura do canvas (800px)
const CANVAS_HEIGHT = canvas.height; // Altura do canvas (600px)
const GROUND_HEIGHT = 520;          // Posição Y onde começa o chão

// ===============================================
//              2. CARREGAMENTO DAS IMAGENS
// ===============================================

console.log('🌲 Carregando recursos do jogo...');

// === IMAGEM DE FUNDO ===
const backgroundImage = new Image();
backgroundImage.src = 'images/background.jpg';

// === IMAGEM DO CHÃO/PLATAFORMA ===
const platformImage = new Image();
platformImage.src = 'images/platform.png';

// === IMAGENS DAS ÁRVORES ===
// Usando apenas tree4 para manter o código mais simples
const treeImage = new Image();
treeImage.src = 'images/tree4.png';

// === IMAGENS DOS ARBUSTOS ===
const bushImages = {
    bush1: new Image(),
    bush2: new Image(),
    bush3: new Image()
};

// Carrega as diferentes variações de arbustos
bushImages.bush1.src = 'images/bush.png';
bushImages.bush2.src = 'images/bush2.png';
bushImages.bush3.src = 'images/bush3.png';

// ===============================================
//              3. FUNÇÕES DE DESENHO
// ===============================================

/**
 * Desenha o plano de fundo da floresta
 * Esta função preenche toda a tela com a imagem de fundo
 */
function desenharFundo() {
    context.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    console.log('🎨 Fundo desenhado!');
}

/**
 * Desenha o chão/plataforma do jogo
 * O chão é posicionado na parte inferior da tela
 */
function desenharChao() {
    const chaoX = 0;                    // Posição X (início da tela)
    const chaoY = GROUND_HEIGHT;        // Posição Y (altura do chão)
    const chaoLargura = CANVAS_WIDTH;   // Largura (toda a tela)
    const chaoAltura = 100;             // Altura do chão
    
    context.drawImage(platformImage, chaoX, chaoY, chaoLargura, chaoAltura);
    console.log('🟫 Chão desenhado!');
}

/**
 * Desenha uma árvore na posição especificada
 * @param {number} x - Posição horizontal da árvore
 * @param {number} y - Posição vertical da árvore
 */
function desenharArvore(x, y) {
    const arvoreX = x;          // Posição X da árvore
    const arvoreY = y;          // Posição Y da árvore
    const arvoreLargura = 100;  // Largura da árvore
    const arvoreAltura = 180;   // Altura da árvore
    
    context.drawImage(treeImage, arvoreX, arvoreY, arvoreLargura, arvoreAltura);
}

/**
 * Desenha um arbusto na posição especificada
 * @param {number} x - Posição horizontal do arbusto
 * @param {number} y - Posição vertical do arbusto
 * @param {string} tipo - Tipo do arbusto (bush1, bush2 ou bush3)
 */
function desenharArbusto(x, y, tipo = 'bush1') {
    const arbustoX = x;         // Posição X do arbusto
    const arbustoY = y;         // Posição Y do arbusto
    const arbustoLargura = 44;  // Largura do arbusto
    const arbustoAltura = 24;   // Altura do arbusto
    
    // Seleciona a imagem do arbusto baseada no tipo
    const imagemArbusto = bushImages[tipo];
    
    if (imagemArbusto) {
        context.drawImage(imagemArbusto, arbustoX, arbustoY, arbustoLargura, arbustoAltura);
    }
}

// ===============================================
//              4. POSICIONAMENTO DOS ELEMENTOS
// ===============================================

/**
 * Desenha todas as árvores da floresta
 * As árvores são posicionadas em diferentes alturas para criar profundidade
 */
function desenharTodasArvores() {
    console.log('🌳 Desenhando árvores...');
    
    // === PRIMEIRA FILEIRA DE ÁRVORES (mais ao fundo) ===
    const arvoresFileira1 = [
        { x: 0, y: 345 },    // Árvore na posição 0
        { x: 100, y: 345 },  // Árvore na posição 100
        { x: 200, y: 345 },  // Árvore na posição 200
        { x: 300, y: 315 },  // Árvore um pouco mais alta (efeito de profundidade)
        { x: 400, y: 345 },  // Árvore na posição 400
        { x: 500, y: 345 },  // Árvore na posição 500
        { x: 600, y: 315 },  // Árvore um pouco mais alta
        { x: 700, y: 345 }   // Árvore na posição 700
    ];
    
    // Desenha cada árvore da primeira fileira
    arvoresFileira1.forEach(arvore => {
        desenharArvore(arvore.x, arvore.y);
    });
    
    // === SEGUNDA FILEIRA DE ÁRVORES (mais à frente) ===
    const arvoresFileira2 = [
        { x: 50, y: 345 },   // Árvore entre as árvores da primeira fileira
        { x: 150, y: 345 },  // Cria um efeito de densidade na floresta
        { x: 250, y: 345 },
        { x: 350, y: 315 },  // Variação na altura
        { x: 450, y: 345 },
        { x: 550, y: 345 },
        { x: 650, y: 315 }
    ];
    
    // Desenha cada árvore da segunda fileira
    arvoresFileira2.forEach(arvore => {
        desenharArvore(arvore.x, arvore.y);
    });
}

/**
 * Desenha todos os arbustos da floresta
 * Os arbustos são espalhados pelo chão para criar um ambiente mais natural
 */
function desenharTodosArbustos() {
    console.log('🌿 Desenhando arbustos...');
    
    // === ARBUSTOS ESPALHADOS PELO CHÃO ===
    const arbustos = [
        // Arbustos usando diferentes tipos para variedade visual
        { x: 0, y: 502, tipo: 'bush1' },
        { x: 40, y: 502, tipo: 'bush2' },
        { x: 80, y: 502, tipo: 'bush1' },
        { x: 120, y: 502, tipo: 'bush3' },
        { x: 160, y: 502, tipo: 'bush2' },
        { x: 200, y: 502, tipo: 'bush1' },
        { x: 240, y: 502, tipo: 'bush2' },
        { x: 280, y: 502, tipo: 'bush3' },
        { x: 320, y: 502, tipo: 'bush2' },
        { x: 360, y: 502, tipo: 'bush1' },
        { x: 400, y: 502, tipo: 'bush2' },
        { x: 440, y: 502, tipo: 'bush3' },
        { x: 480, y: 502, tipo: 'bush2' },
        { x: 520, y: 502, tipo: 'bush1' },
        { x: 560, y: 502, tipo: 'bush2' },
        { x: 600, y: 502, tipo: 'bush3' },
        { x: 640, y: 502, tipo: 'bush2' },
        { x: 680, y: 502, tipo: 'bush1' },
        { x: 720, y: 502, tipo: 'bush2' }
    ];
    
    // Desenha cada arbusto na posição especificada
    arbustos.forEach(arbusto => {
        desenharArbusto(arbusto.x, arbusto.y, arbusto.tipo);
    });
}

// ===============================================
//              5. FUNÇÃO PRINCIPAL
// ===============================================

/**
 * Função principal que desenha todo o cenário
 * Esta função é chamada para renderizar todos os elementos da floresta
 */
function desenharCenario() {
    console.log('🎮 Iniciando desenho do cenário...');
    
    // Limpa o canvas antes de desenhar (boa prática)
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Desenha os elementos em ordem de camadas (fundo para frente)
    desenharFundo();           // 1º - Fundo da floresta
    desenharTodasArvores();    // 2º - Árvores (atrás dos arbustos)
    desenharChao();            // 3º - Chão/plataforma
    desenharTodosArbustos();   // 4º - Arbustos (na frente das árvores)
    
    console.log('✅ Cenário desenhado com sucesso!');
}

// ===============================================
//              6. INICIALIZAÇÃO DO JOGO
// ===============================================

/**
 * Função executada quando a página termina de carregar
 * Aguarda todas as imagens serem carregadas antes de desenhar
 */
window.onload = function() {
    console.log('📚 Página carregada! Iniciando jogo de floresta...');
    console.log('📊 Dimensões do canvas:', CANVAS_WIDTH, 'x', CANVAS_HEIGHT);
    
    // Desenha o cenário inicial
    desenharCenario();
    
    console.log('🎯 Jogo pronto para uso!');
};

// ===============================================
//              7. INFORMAÇÕES ADICIONAIS
// ===============================================

/*
📝 EXPLICAÇÕES PARA OS ALUNOS:

1. CANVAS: É como uma "tela de pintura" digital onde desenhamos os elementos do jogo.

2. CONTEXT: É o "pincel" que usamos para desenhar no canvas.

3. IMAGENS: São carregadas na memória antes de serem desenhadas na tela.

4. COORDENADAS: 
   - X = horizontal (0 = esquerda, 800 = direita)
   - Y = vertical (0 = topo, 600 = fundo)

5. ORDEM DE DESENHO: É importante desenhar na ordem correta:
   - Fundo primeiro
   - Elementos de trás para frente
   - Elementos da frente por último

6. FUNÇÕES: Dividimos o código em funções para:
   - Organizar melhor o código
   - Reutilizar funcionalidades
   - Facilitar manutenção e entendimento

🎯 ATIVIDADES SUGERIDAS:
- Experimente mudar as posições das árvores
- Adicione mais tipos de arbustos
- Modifique as cores ou tamanhos
- Crie animações simples
*/