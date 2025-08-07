/* ===== JAVASCRIPT - CRIANDO NOSSA FLORESTA ===== */

// PASSO 1: Conectar com o canvas
// Pegamos o elemento canvas do HTML
const canvas = document.getElementById('gameCanvas');
// Criamos o contexto 2D para desenhar
const context = canvas.getContext('2d');

/* ===== FUNÇÃO 1: DESENHAR O FUNDO ===== */
// Esta função cria o céu azul e o chão verde
function drawBackground() {
    console.log("🎨 Desenhando o fundo...");
    
    // Desenha o céu azul claro
    context.fillStyle = '#87CEEB'; // Cor azul céu
    context.fillRect(0, 0, canvas.width, canvas.height); // Preenche toda a tela
    
    // Desenha o chão verde (terra)
    context.fillStyle = '#228B22'; // Verde floresta
    context.fillRect(0, canvas.height - 100, canvas.width, 100); // 100px de altura do chão
}

/* ===== FUNÇÃO 2: DESENHAR NUVENS ===== */
// Cria nuvens brancas flutuando no céu
function drawClouds() {
    console.log("☁️ Desenhando as nuvens...");
    
    context.fillStyle = '#FFFFFF'; // Cor branca para as nuvens
    
    // PRIMEIRA NUVEM (esquerda) - 3 círculos unidos
    context.beginPath();
    context.arc(150, 80, 30, 0, Math.PI * 2); // Círculo esquerdo
    context.arc(180, 80, 40, 0, Math.PI * 2); // Círculo central (maior)
    context.arc(210, 80, 30, 0, Math.PI * 2); // Círculo direito
    context.fill();

    // SEGUNDA NUVEM (direita) - 3 círculos menores
    context.beginPath();
    context.arc(350, 50, 20, 0, Math.PI * 2); // Círculo esquerdo
    context.arc(380, 50, 30, 0, Math.PI * 2); // Círculo central
    context.arc(410, 50, 20, 0, Math.PI * 2); // Círculo direito
    context.fill();
}

/* ===== FUNÇÃO 3: DESENHAR UMA ÁRVORE ===== */
// Desenha uma árvore individual na posição (x, y)
function drawTree(x, y) {
    console.log(`🌳 Desenhando árvore na posição (${x}, ${y})...`);
    
    // TRONCO da árvore
    context.fillStyle = '#8B4513'; // Marrom para o tronco
    context.fillRect(x, y - 60, 20, 60); // Retângulo: largura=20, altura=60
    
    // COPA da árvore (folhas)
    context.fillStyle = '#006400'; // Verde escuro para as folhas
    context.beginPath();
    context.arc(x + 10, y - 80, 40, 0, Math.PI * 2); // Círculo centralizado no tronco
    context.fill();
}

/* ===== FUNÇÃO 4: DESENHAR O LAGO ===== */
// Cria um pequeno lago azul no cenário
function drawLake() {
    console.log("🏞️ Desenhando o lago...");
    
    context.fillStyle = '#1E90FF'; // Azul água
    context.beginPath();
    // Elipse: centro(600, 520), raio horizontal=80, raio vertical=20
    context.ellipse(600, 520, 80, 20, 0, 0, Math.PI * 2);
    context.fill();
}

/* ===== FUNÇÃO 5: DESENHAR PLANTAS E FLORES ===== */
// Adiciona pequenas plantas coloridas no chão
function drawPlantsAndFlowers() {
    console.log("🌸 Desenhando plantas e flores...");
    
    // PLANTA 1 com flor rosa
    context.fillStyle = '#32CD32'; // Verde lima para a haste
    context.fillRect(150, canvas.height - 100, 5, 30); // Haste fina e alta
    
    context.fillStyle = '#FF69B4'; // Rosa para a flor
    context.beginPath();
    context.arc(152, canvas.height - 105, 8, 0, Math.PI * 2); // Flor pequena
    context.fill();

    // PLANTA 2 com flor amarela
    context.fillStyle = '#32CD32'; // Verde lima para a haste
    context.fillRect(250, canvas.height - 90, 5, 25); // Haste um pouco menor
    
    context.fillStyle = '#FFD700'; // Amarelo ouro para a flor
    context.beginPath();
    context.arc(252, canvas.height - 95, 8, 0, Math.PI * 2); // Flor pequena
    context.fill();

    // PLANTA 3 com flor vermelha
    context.fillStyle = '#32CD32';
    context.fillRect(450, canvas.height - 85, 5, 20);
    
    context.fillStyle = '#FF4500'; // Vermelho alaranjado
    context.beginPath();
    context.arc(452, canvas.height - 90, 7, 0, Math.PI * 2);
    context.fill();
}

/* ===== FUNÇÃO PRINCIPAL: DESENHAR TUDO ===== */
// Esta é a função que coordena todo o desenho
function draw() {
    console.log("🎬 Iniciando o desenho da floresta...");
    
    // Ordem importa! Desenhamos de trás para frente
    drawBackground();           // 1º: Fundo (céu e chão)
    drawClouds();              // 2º: Nuvens no céu
    
    // Fileira de árvores no fundo (mais longe)
    drawTree(100, canvas.height - 100);  // Árvore 1
    drawTree(300, canvas.height - 100);  // Árvore 2  
    drawTree(500, canvas.height - 100);  // Árvore 3
    
    // Fileira de árvores na frente (mais perto)
    drawTree(200, canvas.height - 100);  // Árvore 4
    drawTree(400, canvas.height - 100);  // Árvore 5
    drawTree(700, canvas.height - 100);  // Árvore 6
    
    drawLake();                // Lago
    drawPlantsAndFlowers();    // Plantas e flores por último
    
    console.log("✅ Floresta criada com sucesso!");
}

/* ===== EXECUTAR O PROGRAMA ===== */
// Chama a função principal para desenhar tudo
draw();

/* ===== DICAS PARA OS ALUNOS ===== */
console.log(`
🎓 DICAS DE APRENDIZADO:
✅ Canvas HTML5 é como uma folha em branco onde podemos desenhar
✅ Sempre definimos context.fillStyle antes de desenhar
✅ fillRect() desenha retângulos, arc() desenha círculos
✅ A ordem das funções importa - o que é desenhado depois fica na frente
✅ Coordenadas: (0,0) é o canto superior esquerdo
✅ Math.PI * 2 representa um círculo completo (360 graus)
`);