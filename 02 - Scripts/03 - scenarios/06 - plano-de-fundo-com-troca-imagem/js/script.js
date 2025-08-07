// ===== VARIÁVEIS GLOBAIS DO JOGO =====
// Estas variáveis guardam os elementos principais do jogo

var myGamePiece;    // Armazena o personagem principal (smiley)
var myBackground;   // Armazena o fundo animado do jogo

// ===== FUNÇÃO DE INICIALIZAÇÃO DO JOGO =====
// Esta função é chamada quando a página carrega (onload="startGame()")
function startGame() {
    console.log("🎮 Iniciando o jogo...");
    
    // Criamos o personagem principal (30x30 pixels, na posição x:10, y:120)
    // Usa caminho relativo para a pasta images local
    myGamePiece = new component(30, 30, "images/smiley.gif", 10, 120, "image");
    
    // Criamos o fundo do jogo (656x270 pixels, na posição x:0, y:0)
    // Largura maior que o canvas para permitir o efeito de movimento
    myBackground = new component(656, 270, "images/citymarket.jpg", 0, 0, "background");
    
    // Iniciamos a área do jogo
    myGameArea.start();
    
    console.log("✅ Jogo iniciado com sucesso!");
}

// ===== OBJETO QUE CONTROLA A ÁREA DO JOGO =====
// Este objeto gerencia o canvas HTML5 onde o jogo é desenhado
var myGameArea = {
    canvas: document.createElement("canvas"), // Cria elemento canvas
    
    // Função que configura e inicia a área do jogo
    start: function() {
        console.log("🖼️ Configurando área do jogo...");
        
        // Define o tamanho do canvas (área visível do jogo)
        this.canvas.width = 480;   // Largura: 480 pixels
        this.canvas.height = 270;  // Altura: 270 pixels
        
        // Obtém o contexto 2D para desenhar no canvas
        this.context = this.canvas.getContext("2d");
        
        // Insere o canvas no início do body da página
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        
        // Contador de frames para controlar animações
        this.frameNo = 0;
        
        // Define um timer que atualiza o jogo a cada 20 milissegundos (50 FPS)
        this.interval = setInterval(updateGameArea, 20);
        
        console.log("✅ Área do jogo configurada!");
    },
    
    // Função que limpa todo o canvas para redesenhar
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    // Função que para o jogo (limpa o timer)
    stop: function() {
        clearInterval(this.interval);
        console.log("⏹️ Jogo parado.");
    }
}

// ===== CONSTRUTOR DE COMPONENTES DO JOGO =====
// Esta função cria todos os objetos do jogo (personagem, fundo, etc.)
function component(width, height, color, x, y, type) {
    console.log(`🔧 Criando componente: ${type}, tamanho: ${width}x${height}`);
    
    // Define o tipo do componente (image, background, ou shape)
    this.type = type;
    this.imageLoaded = false; // Flag para controlar se a imagem carregou
    
    // Se for imagem ou fundo, cria objeto Image
    if (type == "image" || type == "background") {
        this.image = new Image();
        
        // Variável para referenciar 'this' dentro dos callbacks
        var self = this;
        
        // Callback quando a imagem carrega com sucesso
        this.image.onload = function() {
            console.log(`✅ Imagem carregada: ${color}`);
            self.imageLoaded = true; // Marca como carregada
        };
        
        // Callback quando há erro no carregamento
        this.image.onerror = function() {
            console.error(`❌ Erro ao carregar imagem: ${color}`);
            console.log(`💡 Verifique se o arquivo existe na pasta correta!`);
            self.imageLoaded = false;
        };
        
        // Define o caminho da imagem
        this.image.src = color; // 'color' na verdade é o caminho da imagem
    }
    
    // Propriedades de tamanho e posição
    this.width = width;     // Largura do componente
    this.height = height;   // Altura do componente
    this.speedX = 0;        // Velocidade horizontal
    this.speedY = 0;        // Velocidade vertical
    this.x = x;             // Posição X (horizontal)
    this.y = y;             // Posição Y (vertical)
    
    // MÉTODO DE DESENHO - desenha o componente no canvas
    this.update = function() {
        var ctx = myGameArea.context;
        
        if (type == "image" || type == "background") {
            // Só desenha se a imagem foi carregada com sucesso
            if (this.imageLoaded && this.image.complete) {
                // Desenha a imagem na posição atual
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
                
                // Se for fundo, desenha uma segunda cópia para criar loop infinito
                if (type == "background") {
                    ctx.drawImage(this.image, 
                                this.x + this.width,  // Segunda imagem ao lado da primeira
                                this.y, 
                                this.width, 
                                this.height);
                }
            } else {
                // Se a imagem não carregou, desenha um retângulo colorido no lugar
                if (type == "image") {
                    // Personagem: desenha um círculo amarelo (emoji substituto)
                    ctx.fillStyle = "#FFD700";
                    ctx.beginPath();
                    ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, 2 * Math.PI);
                    ctx.fill();
                    // Adiciona "rosto" simples
                    ctx.fillStyle = "#000";
                    ctx.fillRect(this.x + 8, this.y + 8, 4, 4); // Olho esquerdo
                    ctx.fillRect(this.x + 18, this.y + 8, 4, 4); // Olho direito
                    ctx.fillRect(this.x + 8, this.y + 18, 14, 2); // Boca
                } else {
                    // Fundo: desenha um gradiente azul-verde
                    var gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
                    gradient.addColorStop(0, "#87CEEB"); // Azul claro
                    gradient.addColorStop(1, "#98FB98"); // Verde claro
                    ctx.fillStyle = gradient;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    if (type == "background") {
                        ctx.fillRect(this.x + this.width, this.y, this.width, this.height);
                    }
                }
            }
        } else {
            // Para formas geométricas simples (retângulos coloridos)
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    // MÉTODO DE MOVIMENTO - atualiza a posição do componente
    this.newPos = function() {
        // Move o componente baseado na velocidade
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Para fundos: quando sai completamente da tela, volta ao início
        if (this.type == "background") {
            if (this.x <= -(this.width)) {
                this.x = 0; // Reseta posição para criar loop infinito
            }
        }
        
        // Limita o personagem dentro da tela
        if (this.type == "image") {
            // Não deixa sair pela esquerda
            if (this.x < 0) this.x = 0;
            // Não deixa sair pela direita
            if (this.x > myGameArea.canvas.width - this.width) {
                this.x = myGameArea.canvas.width - this.width;
            }
            // Não deixa sair por cima
            if (this.y < 0) this.y = 0;
            // Não deixa sair por baixo
            if (this.y > myGameArea.canvas.height - this.height) {
                this.y = myGameArea.canvas.height - this.height;
            }
        }
    }
}

// ===== LOOP PRINCIPAL DO JOGO =====
// Esta função é chamada 50 vezes por segundo para atualizar tudo
function updateGameArea() {
    // 1. Limpa a tela
    myGameArea.clear();
    
    // 2. Move o fundo automaticamente (cria sensação de movimento)
    myBackground.speedX = -1; // Move para a esquerda
    myBackground.newPos();    // Atualiza posição
    myBackground.update();    // Desenha o fundo
    
    // 3. Atualiza e desenha o personagem
    myGamePiece.newPos();     // Atualiza posição do personagem
    myGamePiece.update();     // Desenha o personagem
    
    // 4. Incrementa contador de frames
    myGameArea.frameNo += 1;
}

// ===== FUNÇÕES DE CONTROLE DO PERSONAGEM =====

// Função chamada quando um botão de movimento é pressionado
function move(dir) {
    console.log(`🏃 Movendo para: ${dir}`);
    
    // Tenta mudar a imagem do personagem para "bravo" se a imagem existir
    if (myGamePiece.type == "image") {
        var angryImage = new Image();
        angryImage.onload = function() {
            myGamePiece.image = angryImage;
            myGamePiece.imageLoaded = true;
        };
        angryImage.onerror = function() {
            console.log("⚠️ Imagem 'angry.gif' não encontrada, mantendo imagem atual");
        };
        angryImage.src = "images/angry.gif";
    }
    
    // Define a velocidade baseada na direção
    if (dir == "up") { 
        myGamePiece.speedY = -2; // Velocidade negativa = sobe
        console.log("⬆️ Subindo");
    }
    if (dir == "down") { 
        myGamePiece.speedY = 2;  // Velocidade positiva = desce
        console.log("⬇️ Descendo");
    }
    if (dir == "left") { 
        myGamePiece.speedX = -2; // Velocidade negativa = esquerda
        console.log("⬅️ Indo para esquerda");
    }
    if (dir == "right") { 
        myGamePiece.speedX = 2;  // Velocidade positiva = direita
        console.log("➡️ Indo para direita");
    }
}

// Função chamada quando um botão de movimento é solto
function clearmove() {
    console.log("⏹️ Parando movimento");
    
    // Tenta voltar para a imagem normal (sorrindo)
    if (myGamePiece.type == "image") {
        var smileyImage = new Image();
        smileyImage.onload = function() {
            myGamePiece.image = smileyImage;
            myGamePiece.imageLoaded = true;
        };
        smileyImage.onerror = function() {
            console.log("⚠️ Imagem 'smiley.gif' não encontrada, mantendo imagem atual");
        };
        smileyImage.src = "images/smiley.gif";
    }
    
    // Para o movimento (velocidade = 0)
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

// ===== FUNÇÃO PARA TROCAR FUNDO =====
// Chamada quando o usuário seleciona um novo cenário
function changeBackground() {
    // Obtém o elemento select
    var select = document.getElementById("backgroundSelect");
    
    // Pega o valor selecionado
    var selectedValue = select.options[select.selectedIndex].value;
    
    console.log(`🖼️ Trocando fundo para: ${selectedValue}`);
    
    // Cria nova imagem para o fundo
    var newBgImage = new Image();
    newBgImage.onload = function() {
        console.log(`✅ Novo fundo carregado: ${selectedValue}`);
        myBackground.image = newBgImage;
        myBackground.imageLoaded = true;
    };
    newBgImage.onerror = function() {
        console.error(`❌ Erro ao carregar fundo: ${selectedValue}`);
        console.log(`💡 Verifique se o arquivo ${selectedValue} existe na pasta images/`);
    };
    
    // Define o novo caminho da imagem
    newBgImage.src = "images/" + selectedValue;
}

// ===== CONTROLES PELO TECLADO (OPCIONAL) =====
// Adiciona suporte para controle via teclado
document.addEventListener('keydown', function(event) {
    switch(event.code) {
        case 'ArrowUp':
        case 'KeyW':
            move('up');
            event.preventDefault(); // Evita scroll da página
            break;
        case 'ArrowDown':
        case 'KeyS':
            move('down');
            event.preventDefault();
            break;
        case 'ArrowLeft':
        case 'KeyA':
            move('left');
            event.preventDefault();
            break;
        case 'ArrowRight':
        case 'KeyD':
            move('right');
            event.preventDefault();
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.code) {
        case 'ArrowUp':
        case 'KeyW':
        case 'ArrowDown':
        case 'KeyS':
        case 'ArrowLeft':
        case 'KeyA':
        case 'ArrowRight':
        case 'KeyD':
            clearmove();
            event.preventDefault();
            break;
    }
});

// ===== INFORMAÇÕES PARA DEBUG =====
// Adiciona informações úteis no console para os alunos aprenderem
console.log("🎯 DICAS PARA OS ALUNOS:");
console.log("• Abra o Console do navegador (F12) para ver os logs do jogo");
console.log("• Experimente modificar os valores de velocidade nas funções");
console.log("• Tente mudar o tamanho do canvas ou do personagem");
console.log("• Use as setas do teclado ou WASD para controlar também!");
console.log("• Examine o código para entender como funciona cada parte");
