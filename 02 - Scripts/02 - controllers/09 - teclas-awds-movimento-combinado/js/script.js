// ==========================================
// JAVASCRIPT - LÓGICA DO JOGO
// ==========================================

// Variáveis Globais
var myGamePiece; // Variável para armazenar a peça principal do jogo (quadrado vermelho)

// ==========================================
// FUNÇÃO PRINCIPAL - INICIALIZAÇÃO DO JOGO
// ==========================================
function startGame() {
    console.log("🎮 Iniciando o jogo..."); // Log para debugging
    myGameArea.start(); // Inicializa a área do jogo (canvas e eventos)
    
    // Cria a peça principal do jogo:
    // Parâmetros: largura, altura, cor, posição X inicial, posição Y inicial
    myGamePiece = new component(30, 30, "red", 240, 135); // Posicionado no centro do canvas
}

// ==========================================
// OBJETO - ÁREA DO JOGO (CANVAS E CONTROLES)
// ==========================================
var myGameArea = {
    canvas: document.createElement("canvas"), // Cria um novo elemento canvas dinamicamente
    
    // Método para inicializar o canvas e eventos
    start: function() {
        // Configurações do Canvas
        this.canvas.width = 480;  // Define a largura do canvas (pixels)
        this.canvas.height = 270; // Define a altura do canvas (pixels)
        this.context = this.canvas.getContext("2d"); // Obtém o contexto 2D para desenhar
        
        // Insere o canvas na div game-container
        document.querySelector('.game-container').appendChild(this.canvas);
        
        // Configura o loop principal do jogo (50 FPS = 1000ms/20ms)
        this.interval = setInterval(updateGameArea, 20);
        
        // ========================================
        // SISTEMA DE CONTROLES - EVENTOS DE TECLADO
        // ========================================
        
        // Evento: Quando uma tecla é PRESSIONADA
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []); // Inicializa array de teclas se não existir
            myGameArea.keys[e.keyCode] = true; // Marca a tecla como pressionada
            console.log("🔽 Tecla pressionada:", e.keyCode); // Log para debugging
        });
        
        // Evento: Quando uma tecla é SOLTA
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false; // Marca a tecla como solta
            console.log("🔼 Tecla solta:", e.keyCode); // Log para debugging
        });
    },
    
    // Método para limpar o canvas a cada frame
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// ==========================================
// CLASSE - COMPONENTE DO JOGO (QUADRADO)
// ==========================================
function component(width, height, color, x, y) {
    // Propriedades Visuais
    this.width = width;   // Largura do componente (pixels)
    this.height = height; // Altura do componente (pixels)
    this.color = color;   // Cor do componente
    
    // Propriedades de Posição
    this.x = x; // Posição horizontal (coordenada X)
    this.y = y; // Posição vertical (coordenada Y)
    
    // Propriedades de Movimento
    this.speed = 0;     // Velocidade de movimento (pixels por frame)
    this.angle = 0;     // Ângulo atual de rotação (radianos)
    this.moveAngle = 0; // Velocidade de rotação (graus por frame)
    
    // ========================================
    // MÉTODO - DESENHAR O COMPONENTE NA TELA
    // ========================================
    this.update = function() {
        var ctx = myGameArea.context; // Referência ao contexto do canvas
        
        ctx.save(); // Salva o estado atual do contexto (importante para transformações)
        
        // Transformações: Posição e Rotação
        ctx.translate(this.x, this.y); // Move a origem do canvas para a posição do componente
        ctx.rotate(this.angle);        // Rotaciona o canvas de acordo com o ângulo do componente
        
        // Desenho do Componente
        ctx.fillStyle = this.color; // Define a cor de preenchimento
        
        // Desenha o retângulo centralizado na origem (por isso divide por -2)
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        
        ctx.restore(); // Restaura o estado original do contexto
    };
    
    // ========================================
    // MÉTODO - CALCULAR NOVA POSIÇÃO
    // ========================================
    this.newPos = function() {
        // Física da Rotação
        this.angle += this.moveAngle * Math.PI / 180; // Converte graus para radianos e aplica rotação
        
        // Física do Movimento (baseada no ângulo atual)
        this.x += this.speed * Math.sin(this.angle);  // Componente X do movimento
        this.y -= this.speed * Math.cos(this.angle);  // Componente Y do movimento (- porque Y cresce para baixo)
        
        // ========================================
        // SISTEMA DE BORDAS - IMPEDE QUE O QUADRADO SAIA DA TELA
        // ========================================
        
        // Verifica borda esquerda
        if (this.x < this.width/2) {
            this.x = this.width/2;
        }
        
        // Verifica borda direita
        if (this.x > myGameArea.canvas.width - this.width/2) {
            this.x = myGameArea.canvas.width - this.width/2;
        }
        
        // Verifica borda superior
        if (this.y < this.height/2) {
            this.y = this.height/2;
        }
        
        // Verifica borda inferior
        if (this.y > myGameArea.canvas.height - this.height/2) {
            this.y = myGameArea.canvas.height - this.height/2;
        }
    };
}

// ==========================================
// LOOP PRINCIPAL - ATUALIZAÇÃO DO JOGO
// ==========================================
function updateGameArea() {
    // Limpa a tela para o próximo frame
    myGameArea.clear();
    
    // Reseta os controles do componente
    myGamePiece.moveAngle = 0; // Para de rotacionar
    myGamePiece.speed = 0;     // Para de mover
    
    // ========================================
    // SISTEMA DE CONTROLES - MAPEAMENTO DE TECLAS
    // ========================================
    
    // Verifica se existem teclas pressionadas
    if (myGameArea.keys) {
        // Tecla A (código 65) - Rotação para a ESQUERDA
        if (myGameArea.keys[65]) {
            myGamePiece.moveAngle = -3; // Rotaciona 3 graus por frame no sentido anti-horário
        }
        
        // Tecla D (código 68) - Rotação para a DIREITA  
        if (myGameArea.keys[68]) {
            myGamePiece.moveAngle = 3; // Rotaciona 3 graus por frame no sentido horário
        }
        
        // Tecla W (código 87) - Movimento para FRENTE
        if (myGameArea.keys[87]) {
            myGamePiece.speed = 2; // Move 2 pixels por frame na direção que está apontando
        }
        
        // Tecla S (código 83) - Movimento para TRÁS
        if (myGameArea.keys[83]) {
            myGamePiece.speed = -2; // Move 2 pixels por frame na direção contrária
        }
    }
    
    // Atualiza a física do jogo
    myGamePiece.newPos(); // Calcula a nova posição baseada nos controles
    myGamePiece.update(); // Desenha o componente na nova posição
}

// ==========================================
// INFORMAÇÕES ADICIONAIS PARA OS ALUNOS
// ==========================================

/*
📚 CONCEITOS IMPORTANTES DEMONSTRADOS NESTE CÓDIGO:

1. 🎨 CANVAS HTML5: 
    - Elemento para desenhar gráficos em tempo real
    - Context 2D para operações de desenho

2. 🎮 GAME LOOP: 
    - setInterval() para criar um loop contínuo
    - 50 FPS (20ms de intervalo)

3. 🎯 SISTEMA DE COORDENADAS:
    - (0,0) fica no canto superior esquerdo
    - X cresce para a direita, Y cresce para baixo

4. 🔄 TRANSFORMAÇÕES:
    - translate(): move o ponto de origem
    - rotate(): rotaciona o contexto
    - save()/restore(): salva/restaura estado

5. ⌨️ EVENTOS DE TECLADO:
    - keydown: quando tecla é pressionada
    - keyup: quando tecla é solta
    - keyCode: código numérico da tecla

6. 📐 TRIGONOMETRIA:
    - Math.sin() e Math.cos() para movimento circular
    - Conversão de graus para radianos (π/180)

7. 🎲 ORIENTAÇÃO A OBJETOS:
    - Função construtora component()
    - Métodos update() e newPos()
    - Propriedades do objeto

⚡ DESAFIOS PARA OS ALUNOS:
- Adicionar mais peças no jogo
- Criar obstáculos
- Implementar sistema de pontuação
- Adicionar sons
- Mudar cores dinamicamente
*/