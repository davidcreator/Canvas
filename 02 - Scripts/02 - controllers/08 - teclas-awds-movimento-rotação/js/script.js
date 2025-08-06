/* ===== CÓDIGO JAVASCRIPT ===== */

// 🎯 VARIÁVEIS GLOBAIS
var myGamePiece; // Variável para armazenar o quadrado jogável

// 🚀 FUNÇÃO PARA INICIAR O JOGO
function startGame() {
    console.log("🎮 Iniciando o jogo...");
    // Cria o quadrado vermelho com largura=30, altura=30, cor="red", posição x=240, y=135
    myGamePiece = new component(30, 30, "red", 240, 135); 
    myGameArea.start(); // Inicializa a área do jogo
}

// 🖼️ OBJETO QUE CONTROLA A ÁREA DO JOGO (CANVAS)
var myGameArea = {
    canvas: document.createElement("canvas"), // Cria um novo elemento canvas
    
    // 🏁 Função para inicializar o jogo
    start: function() {
        console.log("🖼️ Configurando o canvas...");
        
        // Configurações do canvas
        this.canvas.width = 480;  // Largura do canvas em pixels
        this.canvas.height = 270; // Altura do canvas em pixels
        this.canvas.style.cursor = "crosshair"; // Muda o cursor quando sobre o canvas
        
        // Obtém o contexto 2D para desenhar no canvas
        this.context = this.canvas.getContext("2d");
        
        // Insere o canvas na div game-container
        document.querySelector('.game-container').appendChild(this.canvas);
        
        // Variáveis de controle
        this.frameNo = 0; // Contador de frames (para animações futuras)
        this.keys = []; // Array para armazenar o estado das teclas
        
        // Inicia o loop do jogo (atualiza 50 vezes por segundo)
        this.interval = setInterval(updateGameArea, 20);
        
        // 🎮 CONFIGURAÇÃO DOS CONTROLES DE TECLADO
        this.setupControls();
    },
    
    // ⌨️ Função para configurar os controles de teclado
    setupControls: function() {
        console.log("⌨️ Configurando controles...");
        
        // Quando uma tecla é pressionada
        window.addEventListener('keydown', (e) => {
            e.preventDefault(); // Previne o comportamento padrão do navegador
            this.keys[e.keyCode] = true; // Marca a tecla como pressionada
            
            // Log para debug - mostra qual tecla foi pressionada
            console.log(`🔥 Tecla pressionada: ${e.keyCode} (${String.fromCharCode(e.keyCode)})`);
        });
        
        // Quando uma tecla é solta
        window.addEventListener('keyup', (e) => {
            this.keys[e.keyCode] = false; // Marca a tecla como não pressionada
        });
    },
    
    // 🛑 Função para parar o jogo
    stop: function() {
        clearInterval(this.interval);
        console.log("🛑 Jogo parado!");
    },
    
    // 🧹 Função para limpar a tela
    clear: function() {
        // Limpa todo o canvas (como se fosse uma borracha)
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// 🎲 CLASSE COMPONENT - Representa objetos do jogo (como o quadrado)
function component(width, height, color, x, y) {
    console.log(`🎲 Criando componente: ${width}x${height}, cor=${color}, posição=(${x},${y})`);
    
    // 📏 PROPRIEDADES FÍSICAS
    this.width = width;   // Largura do componente
    this.height = height; // Altura do componente
    this.x = x;          // Posição horizontal (eixo X)
    this.y = y;          // Posição vertical (eixo Y)
    
    // 🏃‍♂️ PROPRIEDADES DE MOVIMENTO
    this.speed = 0;      // Velocidade de movimento (0 = parado)
    this.angle = 0;      // Ângulo atual do componente (em radianos)
    this.moveAngle = 0;  // Velocidade de rotação (graus por frame)
    
    // 🎨 Cor do componente
    this.color = color;

    // 🖊️ MÉTODO PARA DESENHAR O COMPONENTE NA TELA
    this.update = function() {
        var ctx = myGameArea.context; // Pega o contexto do canvas
        
        ctx.save(); // Salva as configurações atuais do canvas
        
        // Move o "centro de desenho" para a posição do componente
        ctx.translate(this.x, this.y);
        
        // Rotaciona o canvas de acordo com o ângulo do componente
        ctx.rotate(this.angle);
        
        // Configura a cor e desenha o retângulo
        ctx.fillStyle = this.color;
        // Desenha o retângulo centralizado na posição
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        
        ctx.restore(); // Restaura as configurações originais do canvas
    };

    // 🧮 MÉTODO PARA CALCULAR NOVA POSIÇÃO
    this.newPos = function() {
        // Atualiza o ângulo baseado na velocidade de rotação
        this.angle += this.moveAngle * Math.PI / 180; // Converte graus para radianos
        
        // Calcula nova posição baseada na velocidade e ângulo
        // Math.sin e Math.cos calculam a direção baseada no ângulo
        this.x += this.speed * Math.sin(this.angle); // Movimento horizontal
        this.y -= this.speed * Math.cos(this.angle); // Movimento vertical (- porque Y cresce para baixo)
        
        // 🚧 VERIFICAÇÃO DE LIMITES - Impede que o quadrado saia da tela
        this.checkBounds();
    };
    
    // 🚧 Método para verificar se o componente saiu dos limites da tela
    this.checkBounds = function() {
        // Se saiu pela esquerda, volta pela direita
        if (this.x < 0) this.x = myGameArea.canvas.width;
        // Se saiu pela direita, volta pela esquerda  
        if (this.x > myGameArea.canvas.width) this.x = 0;
        // Se saiu por cima, volta por baixo
        if (this.y < 0) this.y = myGameArea.canvas.height;
        // Se saiu por baixo, volta por cima
        if (this.y > myGameArea.canvas.height) this.y = 0;
    };
}

// 🔄 FUNÇÃO PRINCIPAL DO LOOP DO JOGO
function updateGameArea() {
    // 🧹 Limpa a tela para o próximo frame
    myGameArea.clear();
    
    // 🔄 Reseta os valores de movimento
    myGamePiece.moveAngle = 0; // Para de rotacionar
    myGamePiece.speed = 0;     // Para de se mover
    
    // 🎮 VERIFICAÇÃO DOS CONTROLES - Códigos das teclas:
    // A = 65, D = 68, W = 87, S = 83
    
    if (myGameArea.keys && myGameArea.keys[65]) { // Tecla 'A'
        myGamePiece.moveAngle = -3; // Rotaciona para a esquerda
    }
    if (myGameArea.keys && myGameArea.keys[68]) { // Tecla 'D'  
        myGamePiece.moveAngle = 3;  // Rotaciona para a direita
    }
    if (myGameArea.keys && myGameArea.keys[87]) { // Tecla 'W'
        myGamePiece.speed = 2; // Move para frente
    }
    if (myGameArea.keys && myGameArea.keys[83]) { // Tecla 'S'
        myGamePiece.speed = -2; // Move para trás
    }
    
    // 🧮 Calcula a nova posição baseada nos controles
    myGamePiece.newPos();
    
    // 🎨 Desenha o componente na nova posição
    myGamePiece.update();
}

// 📚 FUNÇÕES UTILITÁRIAS PARA ENSINO

// Função para mostrar informações do jogo no console
function showGameInfo() {
    console.log("📊 Informações do jogo:");
    console.log(`Posição: (${Math.round(myGamePiece.x)}, ${Math.round(myGamePiece.y)})`);
    console.log(`Ângulo: ${Math.round(myGamePiece.angle * 180 / Math.PI)}°`);
    console.log(`Velocidade: ${myGamePiece.speed}`);
}

// Chama showGameInfo a cada 2 segundos (opcional, para debug)
// setInterval(showGameInfo, 2000);

console.log("🎓 Script carregado! O jogo iniciará quando a página terminar de carregar.");