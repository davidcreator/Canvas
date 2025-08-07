/* =========================================
   JAVASCRIPT - MOTOR DO EFEITO PARALLAX
   ========================================= */

// VARIÁVEIS GLOBAIS DO PROJETO
var canvas;              // Elemento HTML5 Canvas
var ctx;                 // Contexto 2D para desenhar
var camadas = [];        // Array com todas as camadas de fundo
var animacaoId;          // ID da animação para controle

// Configurações do parallax com tamanhos específicos das imagens
var configuracao = {
    velocidades: [0.5, 1.0, 1.5],      // Velocidade de cada camada
    caminhoImagens: "images/",          // Pasta das imagens
    camadas: [        
        { nome: "background2.png", largura: 1024, altura: 290, alinhamento: "bottom", descricao: "Cidade" },
        { nome: "background3.png", largura: 1026, altura: 55,  alinhamento: "bottom", descricao: "Chão" }
    ],
    fps: 60                             // Frames por segundo
};

/* =====================================
   🚀 FUNÇÃO DE INICIALIZAÇÃO PRINCIPAL
   ===================================== */
function iniciarJogo() {
    console.log("🎮 === INICIANDO EFEITO PARALLAX ===");
    
    // 1. Configurar o canvas
    configurarCanvas();
    
    // 2. Criar as camadas de fundo
    criarCamadasParallax();
    
    // 3. Iniciar loop de animação
    iniciarAnimacao();
    
    // 4. Configurar eventos
    configurarEventos();
}

/* =====================================
   📐 CONFIGURAÇÃO DO CANVAS
   ===================================== */
function configurarCanvas() {
    canvas = document.getElementById("parallaxCanvas");
    ctx = canvas.getContext("2d");
    
    // Ajusta tamanho para tela cheia
    redimensionarCanvas();
    
    console.log(`📏 Canvas configurado: ${canvas.width} x ${canvas.height}`);
}

function redimensionarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/* =====================================
   🏞️ CRIAÇÃO DAS CAMADAS PARALLAX
   ===================================== */
function criarCamadasParallax() {
    console.log("🏞️ Criando camadas de parallax...");
    
    // Limpa camadas existentes
    camadas = [];
    
    // Cria cada camada com sua configuração específica
    configuracao.camadas.forEach((configCamada, indice) => {
        var caminhoCompleto = configuracao.caminhoImagens + configCamada.nome;
        var velocidade = configuracao.velocidades[indice];
        
        var novaCamada = new CamadaParallax(
            caminhoCompleto, 
            velocidade, 
            configCamada.descricao,
            configCamada.largura,
            configCamada.altura,
            configCamada.alinhamento
        );
        
        camadas.push(novaCamada);
        
        console.log(`✅ ${configCamada.descricao} criada (${configCamada.largura}x${configCamada.altura} - velocidade: ${velocidade}x)`);
    });
}

/* =====================================
   🎭 CLASSE CAMADA PARALLAX
   ===================================== */
class CamadaParallax {
    constructor(caminhoImagem, velocidade, descricao, larguraImg, alturaImg, alinhamento) {
        this.imagem = new Image();
        this.imagem.src = caminhoImagem;
        this.posicaoX = 0;
        this.velocidade = velocidade;
        this.descricao = descricao;
        this.larguraOriginal = larguraImg;
        this.alturaOriginal = alturaImg;
        this.alinhamento = alinhamento; // 'top', 'center' ou 'bottom'
        this.carregada = false;
        
        // Callback quando imagem carregar
        this.imagem.onload = () => {
            this.carregada = true;
            console.log(`🖼️ Imagem carregada: ${this.descricao} (${this.larguraOriginal}x${this.alturaOriginal})`);
        };
        
        // Callback se houver erro no carregamento
        this.imagem.onerror = () => {
            console.error(`❌ Erro ao carregar: ${this.descricao}`);
        };
    }
    
    /* Método para calcular posição vertical baseada no alinhamento */
    calcularPosicaoY() {
        switch(this.alinhamento) {
            case 'top':
                return 0;
            case 'center':
                return (canvas.height - this.alturaOriginal) / 2;
            case 'bottom':
                return canvas.height - this.alturaOriginal;
            default:
                return 0;
        }
    }
    
    /* Método para calcular quantas repetições da imagem são necessárias */
    calcularRepeticoes() {
        return Math.ceil(canvas.width / this.larguraOriginal) + 1;
    }
    
    /* Método para atualizar posição da camada */
    atualizar() {
        // Move a camada para a esquerda
        this.posicaoX -= this.velocidade;
        
        // Reset quando uma imagem completa sair da tela
        if (this.posicaoX <= -this.larguraOriginal) {
            this.posicaoX = 0;
        }
    }
    
    /* Método para desenhar a camada */
    desenhar() {
        // Só desenha se a imagem foi carregada
        if (!this.carregada) return;
        
        const posY = this.calcularPosicaoY();
        const repeticoes = this.calcularRepeticoes();
        
        // Desenha múltiplas repetições para cobrir toda a largura da tela
        for (let i = 0; i < repeticoes; i++) {
            const posX = this.posicaoX + (i * this.larguraOriginal);
            ctx.drawImage(this.imagem, posX, posY, this.larguraOriginal, this.alturaOriginal);
        }
    }
}

/* =====================================
   🔄 LOOP DE ANIMAÇÃO PRINCIPAL
   ===================================== */
function iniciarAnimacao() {
    function loopAnimacao() {
        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Atualiza e desenha cada camada
        camadas.forEach(camada => {
            camada.atualizar();
            camada.desenhar();
        });
        
        // Solicita próximo frame
        animacaoId = requestAnimationFrame(loopAnimacao);
    }
    
    // Inicia o loop
    loopAnimacao();
    console.log("🔄 Loop de animação iniciado");
}

/* =====================================
   🎮 CONFIGURAÇÃO DE EVENTOS
   ===================================== */
function configurarEventos() {
    // Redimensiona canvas quando janela mudar
    window.addEventListener('resize', redimensionarCanvas);
    
    // Pausa/retoma animação quando janela perde/ganha foco
    window.addEventListener('blur', pausarAnimacao);
    window.addEventListener('focus', retomarAnimacao);
    
    console.log("🎮 Eventos configurados");
}

/* Funções de controle da animação */
function pausarAnimacao() {
    if (animacaoId) {
        cancelAnimationFrame(animacaoId);
        console.log("⏸️ Animação pausada");
    }
}

function retomarAnimacao() {
    iniciarAnimacao();
    console.log("▶️ Animação retomada");
}

/* =====================================
   🔧 FUNÇÕES UTILITÁRIAS (PARA DEBUG)
   ===================================== */
function mostrarStatus() {
    console.log("=== STATUS DO PARALLAX ===");
    console.log(`Canvas: ${canvas.width}x${canvas.height}`);
    console.log(`Camadas ativas: ${camadas.length}`);
    camadas.forEach((camada, i) => {
        console.log(`  ${i+1}. ${camada.descricao} - Posição: ${camada.posicaoX.toFixed(1)}`);
    });
}

// Descomente a linha abaixo para debug automático
// setInterval(mostrarStatus, 3000);