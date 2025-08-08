// ===== SIMULADOR DE FÍSICA - EFEITO BOUNCE =====

/* 
    * VARIÁVEIS GLOBAIS
    * Armazenam os objetos principais do jogo
    */
var myGamePiece;    // O quadrado vermelho que irá quicar
var frameCount = 0; // Contador de frames para animação suave

/* 
    * FUNÇÃO PRINCIPAL - INICIALIZAR O JOGO
    * Esta função é chamada quando a página carrega (onload)
    */
function startGame() {
    console.log("🎮 Iniciando simulador de física...");
    
    // Cria um novo componente (quadrado vermelho)
    // Parâmetros: largura, altura, cor, posição X, posição Y
    myGamePiece = new component(30, 30, "red", 80, 75);
    
    // Inicia a área do jogo
    myGameArea.start();
    
    console.log("✅ Simulador iniciado com sucesso!");
}

/* 
    * OBJETO PRINCIPAL - ÁREA DO JOGO
    * Gerencia o canvas, a renderização e o loop principal
    */
var myGameArea = {
    canvas: document.createElement("canvas"), // Cria elemento canvas
    
    // Método para inicializar a área do jogo
    start: function() {
        console.log("🖼️ Configurando canvas...");
        
        // Define as dimensões do canvas
        this.canvas.width = 480;   // Largura em pixels
        this.canvas.height = 270;  // Altura em pixels
        
        // Obtém o contexto 2D para desenhar
        this.context = this.canvas.getContext("2d");
        
        // Insere o canvas no início do body
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        // Inicia o loop principal (60 FPS = atualização a cada ~16ms)
        this.interval = setInterval(updateGameArea, 16);
        
        console.log("✅ Canvas configurado: " + this.canvas.width + "x" + this.canvas.height);
    },
    
    // Método para parar o jogo
    stop: function() {
        clearInterval(this.interval);
        console.log("⏹️ Jogo pausado");
    },
    
    // Método para limpar o canvas a cada frame
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

/* 
    * CLASSE COMPONENT - REPRESENTA OBJETOS DO JOGO
    * Esta é a "classe" que define como os objetos se comportam
    */
function component(width, height, color, x, y, type) {
    console.log("🔴 Criando componente: " + width + "x" + height + " na posição (" + x + "," + y + ")");
    
    // === PROPRIEDADES DO OBJETO ===
    this.type = type;           // Tipo do componente (opcional)
    this.width = width;         // Largura em pixels
    this.height = height;       // Altura em pixels
    this.x = x;                // Posição X (horizontal)
    this.y = y;                // Posição Y (vertical)
    
    // === PROPRIEDADES DE MOVIMENTO ===
    this.speedX = 0;           // Velocidade horizontal
    this.speedY = 0;           // Velocidade vertical
    
    // === PROPRIEDADES FÍSICAS ===
    this.gravity = 0.15;       // Força da gravidade (acelera para baixo)
    this.gravitySpeed = 0;     // Velocidade atual devido à gravidade
    this.bounce = 0.6;         // Coeficiente de restituição (0 = sem bounce, 1 = bounce perfeito)
    
    /* 
        * MÉTODO UPDATE - DESENHA O COMPONENTE
        * Atualiza a aparência visual do objeto na tela
        */
    this.update = function() {
        let ctx = myGameArea.context;  // Contexto do canvas
        ctx.fillStyle = color;         // Define a cor
        // Desenha um retângulo preenchido
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    /* 
        * MÉTODO NEWPOS - CALCULA NOVA POSIÇÃO
        * Aplica as leis da física para movimento realista
        */
    this.newPos = function() {
        // APLICAR GRAVIDADE
        // A gravidade aumenta a velocidade vertical constantemente
        this.gravitySpeed += this.gravity;
        
        // CALCULAR NOVA POSIÇÃO
        // Atualiza posição com base na velocidade
        this.x += this.speedX;                           // Movimento horizontal
        this.y += this.speedY + this.gravitySpeed;       // Movimento vertical + gravidade
        
        // VERIFICAR COLISÕES
        this.hitBottom();  // Verifica se bateu no chão
    };

    /* 
        * MÉTODO HITBOTTOM - DETECTA COLISÃO COM O CHÃO
        * Implementa o efeito bounce quando o objeto toca o solo
        */
    this.hitBottom = function() {
        // Calcula a posição do "chão" (fundo do canvas)
        let rockbottom = myGameArea.canvas.height - this.height;
        
        // Verifica se o objeto passou do chão
        if (this.y > rockbottom) {
            console.log("💥 BOUNCE! Energia antes: " + Math.abs(this.gravitySpeed).toFixed(2));
            
            // Reposiciona o objeto exatamente no chão
            this.y = rockbottom;
            
            // APLICAR EFEITO BOUNCE
            // Inverte a direção e aplica o coeficiente de restituição
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            
            console.log("🎾 Energia depois: " + Math.abs(this.gravitySpeed).toFixed(2) + " (perda de " + ((1-this.bounce)*100) + "%)");
            
            // Para pequenas velocidades, para o movimento (simula atrito)
            if (Math.abs(this.gravitySpeed) < 0.5) {
                this.gravitySpeed = 0;
                console.log("⏹️ Objeto parou (energia muito baixa)");
            }
        }
    };
}

/* 
    * FUNÇÃO PRINCIPAL DO LOOP - ATUALIZA O JOGO
    * Chamada 60 vezes por segundo para criar animação suave
    */
function updateGameArea() {
    frameCount++;  // Incrementa contador de frames
    
    // Limpa o canvas
    myGameArea.clear();
    
    // Calcula nova posição do objeto
    myGamePiece.newPos();
    
    // Redesenha o objeto na nova posição
    myGamePiece.update();
    
    // A cada 300 frames (5 segundos), mostra informações no console
    if (frameCount % 300 === 0) {
        console.log("📊 Frame " + frameCount + " - Posição Y: " + myGamePiece.y.toFixed(1) + ", Velocidade: " + myGamePiece.gravitySpeed.toFixed(2));
    }
}

/* 
    * EXPERIMENTOS PARA OS ALUNOS:
    * 
    * 1. Altere o valor de 'this.bounce' na linha 185:
    *    - Teste com 0.8 (bounce alto)
    *    - Teste com 0.3 (bounce baixo)
    *    - Teste com 1.0 (bounce infinito - não realista!)
    * 
    * 2. Altere o valor de 'this.gravity' na linha 182:
    *    - Teste com 0.05 (gravidade da Lua)
    *    - Teste com 0.25 (gravidade forte)
    * 
    * 3. Mude a posição inicial alterando os valores em startGame():
    *    - Teste iniciando de alturas diferentes
    * 
    * 4. Adicione movimento horizontal:
    *    - Defina this.speedX = 2; no construtor
    *    - Implemente colisão com as paredes laterais
    */