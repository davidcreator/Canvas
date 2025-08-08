/* ===================================================================
    SIMULAÇÃO DE VEÍCULOS - DEMONSTRAÇÃO DE FÍSICA APLICADA
    ===================================================================
    
    Este código demonstra conceitos fundamentais de física através de
    uma simulação interativa de veículos com diferentes características.
*/

// ===== VARIÁVEIS GLOBAIS =====
var veiculos = []; // Array que armazena todos os veículos da simulação

// ===== FUNÇÃO PRINCIPAL - INICIALIZAÇÃO DA SIMULAÇÃO =====
function iniciarSimulacao() {
    console.log("🚀 Iniciando simulação de veículos...");
    
    // Criando veículos com características físicas diferentes
    // Parâmetros: (tipo, largura, altura, cor, posX, posY, aceleração, atrito)
    veiculos.push(new Veiculo("CARRO", 50, 30, "red", 30, 100, 0.2, 0.05));
    veiculos.push(new Veiculo("MOTO", 30, 20, "blue", 30, 150, 0.3, 0.03));
    
    // Iniciando a área de simulação
    areaSimulacao.iniciar();
    
    console.log("✅ Simulação iniciada com sucesso!");
}

// ===== OBJETO GERENCIADOR DA ÁREA DE SIMULAÇÃO =====
var areaSimulacao = {
    canvas: document.createElement("canvas"), // Elemento canvas para desenhar
    contexto: null, // Contexto 2D para desenho
    intervalo: null, // ID do intervalo de atualização
    
    // Método para inicializar a área de simulação
    iniciar: function() {
        console.log("🎨 Configurando área de simulação...");
        
        // Definindo dimensões do canvas
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Obtendo contexto 2D para desenho
        this.contexto = this.canvas.getContext("2d");
        
        // Inserindo canvas no documento
        document.body.appendChild(this.canvas);
        
        // Iniciando loop de atualização (50 FPS = 20ms)
        this.intervalo = setInterval(atualizarSimulacao, 20);
        
        console.log("✅ Área de simulação configurada!");
    },
    
    // Método para parar a simulação
    parar: function() {
        clearInterval(this.intervalo);
        console.log("⏹️ Simulação pausada");
    },
    
    // Método para limpar a tela
    limpar: function() {
        this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

// ===== CLASSE CONSTRUTOR DE VEÍCULOS =====
function Veiculo(tipo, largura, altura, cor, x, y, aceleracao, atrito) {
    // === PROPRIEDADES FÍSICAS ===
    this.tipo = tipo;                    // Tipo do veículo (CARRO, MOTO, etc.)
    this.largura = largura;              // Largura em pixels
    this.altura = altura;                // Altura em pixels
    this.cor = cor;                      // Cor do veículo
    
    // === PROPRIEDADES DE MOVIMENTO ===
    this.x = x;                         // Posição horizontal
    this.y = y;                         // Posição vertical
    this.velocidade = 0;                // Velocidade atual (px/frame)
    this.aceleracao = aceleracao;       // Taxa de aceleração
    this.atrito = atrito;               // Coeficiente de atrito
    
    // === MÉTODO PARA DESENHAR O VEÍCULO ===
    this.desenhar = function() {
        var ctx = areaSimulacao.contexto;
        
        // Desenhando o corpo do veículo
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        
        // Adicionando borda
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.largura, this.altura);
        
        // Desenhando o rótulo do veículo
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.tipo, this.x + this.largura/2, this.y - 15);
        
        // Mostrando velocidade
        ctx.font = "10px Arial";
        ctx.fillText("V: " + Math.abs(this.velocidade.toFixed(1)), 
                    this.x + this.largura/2, this.y - 5);
    };
    
    // === MÉTODO PARA ATUALIZAR POSIÇÃO ===
    this.atualizarPosicao = function() {
        // Aplicando atrito (força que se opõe ao movimento)
        this.velocidade = this.velocidade * (1 - this.atrito);
        
        // Atualizando posição baseada na velocidade
        this.x += this.velocidade;
        
        // Verificando colisões com bordas
        this.verificarBordas();
    };
    
    // === MÉTODO PARA ACELERAR ===
    this.acelerar = function() {
        this.velocidade += this.aceleracao;
        console.log(`🚗 ${this.tipo} acelerando! Velocidade: ${this.velocidade.toFixed(2)}`);
    };
    
    // === MÉTODO PARA FRENAR ===
    this.frenar = function() {
        this.velocidade -= this.aceleracao;
        console.log(`🛑 ${this.tipo} freando! Velocidade: ${this.velocidade.toFixed(2)}`);
    };
    
    // === MÉTODO PARA VERIFICAR COLISÕES COM BORDAS ===
    this.verificarBordas = function() {
        // Borda direita
        if (this.x > areaSimulacao.canvas.width - this.largura) {
            this.x = areaSimulacao.canvas.width - this.largura;
            this.velocidade = 0; // Para completamente ao colidir
            console.log(`💥 ${this.tipo} colidiu com a borda direita!`);
        }
        
        // Borda esquerda
        if (this.x < 0) {
            this.x = 0;
            this.velocidade = 0; // Para completamente ao colidir
            console.log(`💥 ${this.tipo} colidiu com a borda esquerda!`);
        }
    };
}

// ===== FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO =====
function atualizarSimulacao() {
    // Limpando a tela
    areaSimulacao.limpar();
    
    // Desenhando linha do chão
    var ctx = areaSimulacao.contexto;
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(areaSimulacao.canvas.width, 200);
    ctx.stroke();
    
    // Atualizando todos os veículos
    for (var i = 0; i < veiculos.length; i++) {
        veiculos[i].atualizarPosicao();
        veiculos[i].desenhar();
    }
}

// ===== SISTEMA DE CONTROLES POR TECLADO =====
window.addEventListener('keydown', function(evento) {
    var tecla = evento.key;
    
    // Controles do carro (veículo 0)
    if (tecla === 'ArrowRight') {
        evento.preventDefault();
        veiculos[0].acelerar();
    }
    if (tecla === 'ArrowLeft') {
        evento.preventDefault();
        veiculos[0].frenar();
    }
    
    // Controles da moto (veículo 1)
    if (tecla === 'd' || tecla === 'D') {
        veiculos[1].acelerar();
    }
    if (tecla === 'a' || tecla === 'A') {
        veiculos[1].frenar();
    }
});

// ===== LOGS INFORMATIVOS =====
console.log("📋 Sistema de Simulação de Veículos Carregado!");
console.log("🎯 Pressione as teclas para controlar os veículos:");
console.log("   🚗 Carro: ← (frenar) / → (acelerar)");
console.log("   🏍️ Moto: A (frenar) / D (acelerar)");