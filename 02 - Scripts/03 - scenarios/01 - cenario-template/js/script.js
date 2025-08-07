// ====== CÓDIGO JAVASCRIPT ======
// Aqui está toda a lógica para desenhar nosso cenário

// PASSO 1: Obter referências do Canvas
// Pegamos o elemento canvas do HTML e seu contexto 2D
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

console.log('Canvas carregado! Dimensões:', canvas.width, 'x', canvas.height);

// ====== FUNÇÕES DE DESENHO ======

/**
 * FUNÇÃO: drawBackground()
 * DESCRIÇÃO: Desenha o fundo do cenário (céu e terra)
 * Esta função cria duas partes: céu azul na parte superior e terra verde na inferior
 */
function drawBackground() {
    console.log('Desenhando o fundo...');
    
    // Desenha o céu (parte superior)
    context.fillStyle = '#87CEEB'; // Cor azul céu
    context.fillRect(0, 0, canvas.width, canvas.height / 2);
    console.log('✓ Céu desenhado');
    
    // Desenha a terra (parte inferior)
    context.fillStyle = '#228B22'; // Cor verde floresta
    context.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    console.log('✓ Terra desenhada');
}

/**
 * FUNÇÃO: drawSun()
 * DESCRIÇÃO: Desenha o sol no céu
 * Adiciona um elemento visual que torna o cenário mais interessante
 */
function drawSun() {
    console.log('Desenhando o sol...');
    
    // Desenha o sol como um círculo amarelo
    context.fillStyle = '#FFD700'; // Cor dourada
    context.beginPath();
    context.arc(650, 100, 50, 0, Math.PI * 2); // Círculo para o sol
    context.fill();
    console.log('✓ Sol desenhado');
}

/**
 * FUNÇÃO: drawClouds()
 * DESCRIÇÃO: Desenha nuvens no céu
 * Cria nuvens simples usando círculos sobrepostos
 */
function drawClouds() {
    console.log('Desenhando as nuvens...');
    
    context.fillStyle = '#FFFFFF'; // Cor branca para as nuvens
    
    // Nuvem 1 (esquerda)
    context.beginPath();
    context.arc(200, 120, 30, 0, Math.PI * 2);
    context.arc(230, 120, 35, 0, Math.PI * 2);
    context.arc(260, 120, 30, 0, Math.PI * 2);
    context.fill();
    
    // Nuvem 2 (centro)
    context.beginPath();
    context.arc(450, 80, 25, 0, Math.PI * 2);
    context.arc(475, 80, 30, 0, Math.PI * 2);
    context.arc(500, 80, 25, 0, Math.PI * 2);
    context.fill();
    
    console.log('✓ Nuvens desenhadas');
}

/**
 * FUNÇÃO: drawTrees()
 * DESCRIÇÃO: Desenha árvores no cenário
 * Cada árvore é composta por um tronco (retângulo) e copa (círculo)
 */
function drawTrees() {
    console.log('Desenhando as árvores...');
    
    // ÁRVORE 1 (esquerda)
    // Tronco da árvore 1
    context.fillStyle = '#8B4513'; // Cor marrom para o tronco
    context.fillRect(100, 350, 25, 100); // x, y, largura, altura
    
    // Copa da árvore 1
    context.fillStyle = '#228B22'; // Cor verde para as folhas
    context.beginPath();
    context.arc(112, 330, 45, 0, Math.PI * 2); // Círculo para a copa
    context.fill();
    console.log('✓ Árvore 1 desenhada');
    
    // ÁRVORE 2 (centro)
    // Tronco da árvore 2
    context.fillStyle = '#8B4513'; // Cor marrom
    context.fillRect(400, 370, 20, 80);
    
    // Copa da árvore 2
    context.fillStyle = '#006400'; // Verde mais escuro
    context.beginPath();
    context.arc(410, 350, 40, 0, Math.PI * 2);
    context.fill();
    console.log('✓ Árvore 2 desenhada');
    
    // ÁRVORE 3 (direita)
    // Tronco da árvore 3
    context.fillStyle = '#A0522D'; // Marrom mais claro
    context.fillRect(600, 340, 30, 110);
    
    // Copa da árvore 3
    context.fillStyle = '#32CD32'; // Verde lima
    context.beginPath();
    context.arc(615, 320, 50, 0, Math.PI * 2);
    context.fill();
    console.log('✓ Árvore 3 desenhada');
}

/**
 * FUNÇÃO: drawHouse()
 * DESCRIÇÃO: Desenha uma casa simples no cenário
 * A casa é composta por paredes, teto e uma porta
 */
function drawHouse() {
    console.log('Desenhando a casa...');
    
    // Paredes da casa
    context.fillStyle = '#DEB887'; // Cor bege
    context.fillRect(300, 380, 80, 70); // Base da casa
    
    // Teto da casa
    context.fillStyle = '#8B0000'; // Cor vermelha escura
    context.beginPath();
    context.moveTo(290, 380); // Ponto esquerdo do teto
    context.lineTo(340, 350); // Pico do teto
    context.lineTo(390, 380); // Ponto direito do teto
    context.closePath();
    context.fill();
    
    // Porta da casa
    context.fillStyle = '#654321'; // Cor marrom escura
    context.fillRect(325, 420, 15, 30);
    
    // Janela da casa
    context.fillStyle = '#87CEEB'; // Cor azul claro
    context.fillRect(310, 395, 12, 12);
    
    console.log('✓ Casa desenhada');
}

/**
 * FUNÇÃO PRINCIPAL: draw()
 * DESCRIÇÃO: Função principal que chama todas as outras funções de desenho
 * Esta é a função que orquestra todo o processo de criação do cenário
 */
function draw() {
    console.log('🎨 Iniciando o desenho do cenário...');
    
    // Limpa o canvas antes de desenhar
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha todos os elementos do cenário na ordem correta
    drawBackground();  // 1º - Fundo (céu e terra)
    drawSun();        // 2º - Sol
    drawClouds();     // 3º - Nuvens
    drawHouse();      // 4º - Casa
    drawTrees();      // 5º - Árvores (por último, para ficarem na frente)
    
    console.log('🎉 Cenário completamente desenhado!');
}

// ====== EXECUÇÃO DO PROGRAMA ======
// Chama a função principal para desenhar o cenário
console.log('🚀 Iniciando aplicação...');
draw();

// Adiciona interatividade: redesenha quando clicar no canvas
canvas.addEventListener('click', function() {
    console.log('👆 Canvas clicado! Redesenhando...');
    draw();
});

console.log('✅ Aplicação carregada com sucesso!');