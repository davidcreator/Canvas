/* ========================================
    JAVASCRIPT - LÓGICA DO DESENHO
======================================== */

// 1. CONFIGURAÇÃO INICIAL
// Obtém referência do elemento canvas e seu contexto 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Definindo constantes para facilitar manutenção
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const GROUND_HEIGHT = 100; // Altura do solo do deserto

// 2. CORES UTILIZADAS NO PROJETO
const CORES = {
    CEU: '#87CEEB',           // Azul claro para o céu
    SOL: '#FFD700',           // Amarelo dourado para o sol
    SOLO: '#DEB887',          // Bege para o solo do deserto
    CACTO: '#228B22',         // Verde para os cactos
    DUNA: '#F4A460',          // Areia clara para as dunas
    ROCHA: '#A9A9A9'          // Cinza para as rochas
};

/* ========================================
    3. FUNÇÕES DE DESENHO - ELEMENTOS INDIVIDUAIS
======================================== */

/**
 * Desenha o fundo do cenário (céu e solo)
 * Esta função cria a base do nosso cenário
 */
function desenharFundo() {
    // Desenha o céu (toda a área do canvas)
    ctx.fillStyle = CORES.CEU;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Desenha o solo do deserto (parte inferior)
    ctx.fillStyle = CORES.SOLO;
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);
}

/**
 * Desenha o sol no céu
 * Utiliza a função arc() para criar um círculo
 */
function desenharSol() {
    ctx.fillStyle = CORES.SOL;
    ctx.beginPath();
    ctx.arc(700, 80, 40, 0, Math.PI * 2); // (x, y, raio, ângulo inicial, ângulo final)
    ctx.fill();
    
    // Adiciona um brilho ao sol
    ctx.shadowColor = CORES.SOL;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0; // Remove o efeito de sombra
}

/**
 * Desenha um cacto na posição especificada
 * @param {number} x - Coordenada X (horizontal)
 * @param {number} y - Coordenada Y (vertical)
 */
function desenharCacto(x, y) {
    ctx.fillStyle = CORES.CACTO;
    
    // Corpo principal do cacto (retângulo vertical)
    ctx.fillRect(x, y - 60, 20, 60);

    // Braço esquerdo do cacto
    ctx.fillRect(x - 10, y - 40, 10, 20);

    // Braço direito do cacto
    ctx.fillRect(x + 20, y - 40, 10, 20);

    // Adiciona espinhos (pequenos detalhes)
    ctx.fillStyle = '#006400'; // Verde mais escuro
    ctx.fillRect(x + 2, y - 55, 2, 2);
    ctx.fillRect(x + 6, y - 45, 2, 2);
    ctx.fillRect(x + 12, y - 50, 2, 2);
}

/**
 * Desenha uma duna de areia (forma triangular)
 * @param {number} x - Coordenada X da base da duna
 * @param {number} y - Coordenada Y da base da duna
 */
function desenharDuna(x, y) {
    ctx.fillStyle = CORES.DUNA;
    ctx.beginPath();
    ctx.moveTo(x, y);           // Ponto inicial (base esquerda)
    ctx.lineTo(x + 100, y);     // Base direita
    ctx.lineTo(x + 50, y - 40); // Topo da duna (ponto médio)
    ctx.closePath();            // Fecha o triângulo
    ctx.fill();
}

/**
 * Desenha uma rocha (círculo)
 * @param {number} x - Coordenada X do centro da rocha
 * @param {number} y - Coordenada Y do centro da rocha
 */
function desenharRocha(x, y) {
    ctx.fillStyle = CORES.ROCHA;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2); // Círculo com raio 20
    ctx.fill();
    
    // Adiciona sombra para dar profundidade
    ctx.fillStyle = '#808080'; // Cinza mais escuro
    ctx.beginPath();
    ctx.arc(x + 5, y + 5, 15, 0, Math.PI * 2); // Sombra deslocada
    ctx.fill();
}

/**
 * Desenha algumas nuvens no céu para completar o cenário
 * @param {number} x - Coordenada X da nuvem
 * @param {number} y - Coordenada Y da nuvem
 */
function desenharNuvem(x, y) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Branco translúcido
    
    // Nuvem feita com vários círculos sobrepostos
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 20, y - 15, 15, 0, Math.PI * 2);
    ctx.arc(x + 30, y - 15, 15, 0, Math.PI * 2);
    ctx.fill();
}

/* ========================================
    4. FUNÇÃO PRINCIPAL - DESENHA O CENÁRIO COMPLETO
======================================== */

/**
 * Função principal que desenha todo o cenário
 * Chama todas as outras funções na ordem correta
 */
function desenharCenario() {
    // Limpa o canvas (importante para animações futuras)
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 1. Desenha elementos de fundo primeiro
    desenharFundo();
    
    // 2. Desenha o sol
    desenharSol();
    
    // 3. Desenha algumas nuvens
    desenharNuvem(100, 120);
    desenharNuvem(450, 80);
    
    // 4. Desenha as dunas (atrás dos outros elementos)
    desenharDuna(100, CANVAS_HEIGHT - GROUND_HEIGHT);
    desenharDuna(400, CANVAS_HEIGHT - GROUND_HEIGHT);
    desenharDuna(650, CANVAS_HEIGHT - GROUND_HEIGHT);
    
    // 5. Desenha as rochas
    desenharRocha(300, CANVAS_HEIGHT - 80);
    desenharRocha(500, CANVAS_HEIGHT - 75);
    desenharRocha(150, CANVAS_HEIGHT - 85);
    
    // 6. Desenha os cactos (elementos principais em primeiro plano)
    desenharCacto(60, CANVAS_HEIGHT - GROUND_HEIGHT);
    desenharCacto(340, CANVAS_HEIGHT - GROUND_HEIGHT);
    desenharCacto(600, CANVAS_HEIGHT - GROUND_HEIGHT);
    desenharCacto(750, CANVAS_HEIGHT - GROUND_HEIGHT);
}

/* ========================================
    5. EXECUÇÃO DO PROGRAMA
======================================== */

// Desenha o cenário quando a página carrega
desenharCenario();

// Mensagem no console para os estudantes
console.log("🎉 Cenário de deserto carregado com sucesso!");
console.log("💡 Dica: Abra as Ferramentas do Desenvolvedor para ver este código!");
console.log("📚 Experimente modificar as cores e posições dos elementos!");
