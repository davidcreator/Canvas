/* =================================
    VARIÁVEIS GLOBAIS
    ================================= */

// Array que armazena todos os veículos da simulação
var veiculos = [];

/* =================================
    FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
    ================================= */

/**
 * Função que inicia toda a simulação
 * Cria os veículos com suas características específicas e inicia a área de simulação
 */
function iniciarSimulacao() {
    console.log("🚀 Iniciando simulação de veículos...");
    
    // Criando cada veículo com parâmetros específicos:
    // Parâmetros: (tipo, largura, altura, cor, posX, posY, aceleração, atrito)
    
    veiculos.push(new Veiculo("Carro", 50, 30, "red", 30, 50, 0.2, 0.05));
    veiculos.push(new Veiculo("Moto", 30, 20, "blue", 30, 100, 0.3, 0.03)); 
    veiculos.push(new Veiculo("Caminhão", 70, 40, "green", 30, 150, 0.1, 0.07));
    veiculos.push(new Veiculo("Bicicleta", 25, 15, "yellow", 30, 200, 0.35, 0.02));
    veiculos.push(new Veiculo("Ônibus", 80, 45, "purple", 30, 250, 0.15, 0.06));
    
    // Iniciar a área de simulação
    areaSimulacao.iniciar();
}

/* =================================
    OBJETO GERENCIADOR DA SIMULAÇÃO
    ================================= */

/**
 * Objeto responsável por gerenciar a área de simulação (canvas)
 * Controla a criação, atualização e limpeza da tela
 */
var areaSimulacao = {
    canvas: document.createElement("canvas"),
    
    /**
     * Inicia a simulação criando o canvas e definindo o loop de animação
     */
    iniciar: function() {
        console.log("🎨 Criando área de simulação...");
        
        // Configurações do canvas
        this.canvas.width = 640;
        this.canvas.height = 320;
        this.context = this.canvas.getContext("2d");
        
        // Inserir o canvas na página
        document.querySelector('.area-simulacao').appendChild(this.canvas);
        
        // Iniciar loop de animação (atualiza a cada 20 milissegundos = 50 FPS)
        this.intervalo = setInterval(atualizarSimulacao, 20);
    },
    
    /**
     * Para a simulação
     */
    parar: function() {
        clearInterval(this.intervalo);
    },
    
    /**
     * Limpa toda a tela para o próximo frame
     */
    limpar: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

/* =================================
    CLASSE CONSTRUTOR DE VEÍCULOS
    ================================= */

/**
 * Construtor para criar objetos veículo
 * @param {string} tipo - Nome do tipo de veículo
 * @param {number} largura - Largura do veículo em pixels
 * @param {number} altura - Altura do veículo em pixels  
 * @param {string} cor - Cor do veículo
 * @param {number} x - Posição horizontal inicial
 * @param {number} y - Posição vertical inicial
 * @param {number} aceleracao - Taxa de aceleração do veículo
 * @param {number} atrito - Coeficiente de atrito (resistência)
 */
function Veiculo(tipo, largura, altura, cor, x, y, aceleracao, atrito) {
    // Propriedades físicas do veículo
    this.tipo = tipo;
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
    
    // Propriedades de posição e movimento
    this.x = x;
    this.y = y;
    this.velocidade = 0;
    
    // Propriedades físicas de movimento
    this.aceleracao = aceleracao;
    this.atrito = atrito;
    
    /**
     * Desenha o veículo na tela
     * Renderiza o retângulo colorido e o nome do veículo
     */
    this.desenhar = function() {
        var ctx = areaSimulacao.context;
        
        // Desenhar o corpo do veículo
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        
        // Adicionar borda para melhor visibilidade
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.largura, this.altura);
        
        // Desenhar o nome do veículo acima dele
        ctx.fillStyle = "black";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.tipo, this.x + this.largura/2, this.y - 5);
        
        // Mostrar velocidade atual (para fins educativos)
        ctx.font = "10px Arial";
        ctx.fillStyle = "navy";
        ctx.fillText("V: " + Math.abs(this.velocidade).toFixed(1), 
                    this.x + this.largura/2, this.y + this.altura + 15);
    };
    
    /**
     * Atualiza a posição do veículo baseado na física
     * Aplica atrito e move o veículo baseado na velocidade atual
     */
    this.atualizarPosicao = function() {
        // Aplicar atrito (reduz a velocidade gradualmente)
        this.velocidade *= (1 - this.atrito);
        
        // Parar o veículo se a velocidade for muito baixa (evita vibração)
        if (Math.abs(this.velocidade) < 0.01) {
            this.velocidade = 0;
        }
        
        // Atualizar posição baseada na velocidade
        this.x += this.velocidade;
        
        // Verificar colisão com as bordas
        this.verificarColisaoBordas();
    };
    
    /**
     * Acelera o veículo para frente
     * Aumenta a velocidade baseada na aceleração do veículo
     */
    this.acelerar = function() {
        this.velocidade += this.aceleracao;
        console.log(`🚀 ${this.tipo} acelerando! Velocidade: ${this.velocidade.toFixed(2)}`);
    };
    
    /**
     * Freia o veículo
     * Reduz a velocidade baseada na aceleração do veículo
     */
    this.frenar = function() {
        this.velocidade -= this.aceleracao;
        console.log(`🛑 ${this.tipo} freando! Velocidade: ${this.velocidade.toFixed(2)}`);
    };
    
    /**
     * Verifica e resolve colisões com as bordas da tela
     * Impede que o veículo saia dos limites da simulação
     */
    this.verificarColisaoBordas = function() {
        // Colidir com borda direita
        if (this.x + this.largura > areaSimulacao.canvas.width) {
            this.x = areaSimulacao.canvas.width - this.largura;
            this.velocidade = 0; // Parar ao colidir
        }
        
        // Colidir com borda esquerda  
        if (this.x < 0) {
            this.x = 0;
            this.velocidade = 0; // Parar ao colidir
        }
    };
}

/* =================================
    LOOP PRINCIPAL DA SIMULAÇÃO
    ================================= */

/**
 * Função que atualiza toda a simulação a cada frame
 * Limpa a tela, atualiza posições e redesenha todos os veículos
 */
function atualizarSimulacao() {
    // Limpar a tela
    areaSimulacao.limpar();
    
    // Atualizar cada veículo
    for (var i = 0; i < veiculos.length; i++) {
        veiculos[i].atualizarPosicao();
        veiculos[i].desenhar();
    }
}

/* =================================
    SISTEMA DE CONTROLES POR TECLADO
    ================================= */

/**
 * Gerencia as entradas do teclado para controlar os veículos
 * Mapeia teclas específicas para cada veículo
 */
window.addEventListener('keydown', function (evento) {
    var tecla = evento.key;
    
    // Mapear teclas para ações dos veículos
    switch (tecla) {
        // Controles do Carro (vermelho) - índice 0
        case 'ArrowRight':
            veiculos[0].acelerar();
            break;
        case 'ArrowLeft':
            veiculos[0].frenar();
            break;
            
        // Controles da Moto (azul) - índice 1
        case 'd':
        case 'D':
            veiculos[1].acelerar();
            break;
        case 'a':
        case 'A':
            veiculos[1].frenar();
            break;
            
        // Controles do Caminhão (verde) - índice 2
        case 'ArrowUp':
            veiculos[2].acelerar();
            break;
        case 'ArrowDown':
            veiculos[2].frenar();
            break;
            
        // Controles da Bicicleta (amarela) - índice 3
        case 'w':
        case 'W':
            veiculos[3].acelerar();
            break;
        case 's':
        case 'S':
            veiculos[3].frenar();
            break;
            
        // Controles do Ônibus (roxo) - índice 4
        case 'e':
        case 'E':
            veiculos[4].acelerar();
            break;
        case 'q':
        case 'Q':
            veiculos[4].frenar();
            break;
    }
    
    // Prevenir comportamento padrão das setas
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(tecla)) {
        evento.preventDefault();
    }
});

/* =================================
    INFORMAÇÕES PARA DEBUG (OPCIONAL)
    ================================= */

console.log("🎓 Simulação Didática de Veículos carregada!");
console.log("📊 Esta simulação demonstra conceitos de:");
console.log("   • Aceleração e velocidade");
console.log("   • Atrito e resistência"); 
console.log("   • Inércia de diferentes massas");
console.log("   • Colisões e limites físicos");