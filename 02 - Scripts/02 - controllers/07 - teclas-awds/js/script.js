// ===== VARIÁVEIS GLOBAIS =====
let jogador;           // O quadrado vermelho que controlamos
let areaDoJogo;        // Objeto que gerencia o canvas e o jogo
let teclasPressionadas = {}; // Objeto para rastrear quais teclas estão pressionadas

// ===== CLASSE JOGADOR =====
// Esta classe representa o quadrado vermelho que o jogador controla
class QuadradoJogador {
    constructor(largura, altura, cor, posicaoX, posicaoY) {
        // Propriedades visuais
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
        
        // Posição no canvas
        this.x = posicaoX;
        this.y = posicaoY;
        
        // Velocidade de movimento
        this.velocidadeX = 0;
        this.velocidadeY = 0;
        this.velocidadeMaxima = 3; // Pixels por frame
    }

    // Método para desenhar o quadrado na tela
    desenhar() {
        const ctx = areaDoJogo.contexto;
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
        
        // Desenha uma bordinha preta para ficar mais bonito
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.largura, this.altura);
    }

    // Método para atualizar a posição do quadrado
    atualizarPosicao() {
        // Move o quadrado baseado na velocidade atual
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        
        // Impede que o quadrado saia das bordas do canvas
        this.manterDentroDasTelas();
        
        // Atualiza a informação de posição na tela
        this.atualizarInfoPosicao();
    }

    // Impede que o quadrado saia do canvas
    manterDentroDasTelas() {
        // Borda esquerda
        if (this.x < 0) {
            this.x = 0;
        }
        // Borda direita
        if (this.x + this.largura > areaDoJogo.canvas.width) {
            this.x = areaDoJogo.canvas.width - this.largura;
        }
        // Borda superior
        if (this.y < 0) {
            this.y = 0;
        }
        // Borda inferior
        if (this.y + this.altura > areaDoJogo.canvas.height) {
            this.y = areaDoJogo.canvas.height - this.altura;
        }
    }

    // Atualiza a informação de posição mostrada na tela
    atualizarInfoPosicao() {
        const infoElement = document.getElementById('posicaoInfo');
        infoElement.textContent = `Posição: X=${Math.round(this.x)}, Y=${Math.round(this.y)}`;
    }

    // Define a velocidade baseada nas teclas pressionadas
    processarMovimento() {
        // Reseta a velocidade
        this.velocidadeX = 0;
        this.velocidadeY = 0;

        // Verifica cada tecla e ajusta a velocidade
        if (teclasPressionadas['KeyA']) { // Tecla A - Esquerda
            this.velocidadeX = -this.velocidadeMaxima;
        }
        if (teclasPressionadas['KeyD']) { // Tecla D - Direita
            this.velocidadeX = this.velocidadeMaxima;
        }
        if (teclasPressionadas['KeyW']) { // Tecla W - Cima
            this.velocidadeY = -this.velocidadeMaxima;
        }
        if (teclasPressionadas['KeyS']) { // Tecla S - Baixo
            this.velocidadeY = this.velocidadeMaxima;
        }
    }
}

// ===== OBJETO DE GERENCIAMENTO DO JOGO =====
const gerenciadorDoJogo = {
    canvas: null,
    contexto: null,
    intervaloAnimacao: null,

    // Inicializa o jogo
    iniciar() {
        // Cria o elemento canvas
        this.canvas = document.createElement("canvas");
        this.canvas.width = 600;  // Largura do canvas
        this.canvas.height = 400; // Altura do canvas
        this.canvas.style.cursor = "crosshair";
        
        // Obtém o contexto 2D para desenhar
        this.contexto = this.canvas.getContext("2d");
        
        // Adiciona o canvas à página
        const container = document.getElementById('game-container');
        container.appendChild(this.canvas);
        
        // Configura os eventos de teclado
        this.configurarEventosTeclado();
        
        // Inicia o loop de animação (60 FPS)
        this.intervaloAnimacao = setInterval(() => this.atualizarJogo(), 1000/60);
        
        console.log("🎮 Jogo iniciado com sucesso!");
    },

    // Configura os eventos de pressionar e soltar teclas
    configurarEventosTeclado() {
        // Quando uma tecla é pressionada
        window.addEventListener('keydown', (evento) => {
            teclasPressionadas[evento.code] = true;
            this.atualizarIndicadoresTeclas(evento.code, true);
            evento.preventDefault(); // Impede ações padrão do navegador
        });

        // Quando uma tecla é solta
        window.addEventListener('keyup', (evento) => {
            teclasPressionadas[evento.code] = false;
            this.atualizarIndicadoresTeclas(evento.code, false);
        });

        // Garante que o canvas tenha foco para receber eventos de teclado
        this.canvas.addEventListener('click', () => {
            this.canvas.focus();
        });
    },

    // Atualiza os indicadores visuais das teclas na página
    atualizarIndicadoresTeclas(codigoTecla, pressionada) {
        const mapeamentoTeclas = {
            'KeyW': 'teclaW',
            'KeyA': 'teclaA',
            'KeyS': 'teclaS',
            'KeyD': 'teclaD'
        };

        const elementoId = mapeamentoTeclas[codigoTecla];
        if (elementoId) {
            const elemento = document.getElementById(elementoId);
            if (pressionada) {
                elemento.classList.add('ativa');
            } else {
                elemento.classList.remove('ativa');
            }
        }
    },

    // Limpa o canvas inteiro
    limparTela() {
        this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // Função principal que roda a cada frame
    atualizarJogo() {
        // 1. Limpa a tela
        this.limparTela();
        
        // 2. Processa o movimento do jogador
        jogador.processarMovimento();
        
        // 3. Atualiza a posição do jogador
        jogador.atualizarPosicao();
        
        // 4. Desenha o jogador na nova posição
        jogador.desenhar();
    }
};

// ===== INICIALIZAÇÃO DO JOGO =====
// Esta função é chamada quando a página termina de carregar
function iniciarJogo() {
    // Define a variável global para facilitar o acesso
    areaDoJogo = gerenciadorDoJogo;
    
    // Inicializa o sistema do jogo
    areaDoJogo.iniciar();
    
    // Cria o jogador (quadrado vermelho)
    // Parâmetros: largura, altura, cor, posição X inicial, posição Y inicial
    jogador = new QuadradoJogador(40, 40, "#FF4444", 50, 180);
    
    console.log("✅ Jogador criado na posição:", jogador.x, jogador.y);
}

// Inicia o jogo quando a página carregar completamente
window.addEventListener('load', iniciarJogo);

// ===== EXPLICAÇÕES PARA OS ALUNOS =====
/*
🎓 CONCEITOS IMPORTANTES DEMONSTRADOS NESTE CÓDIGO:

1. **Classes ES6**: A classe QuadradoJogador mostra como organizar código relacionado

2. **Manipulação do Canvas**: Como criar, desenhar e animar elementos gráficos

3. **Eventos de Teclado**: Como capturar e processar entradas do usuário

4. **Game Loop**: O conceito de atualizar o jogo continuamente (60x por segundo)

5. **Detecção de Colisão**: Como manter o jogador dentro dos limites da tela

6. **Manipulação do DOM**: Como adicionar elementos e atualizar o conteúdo da página

7. **Objetos JavaScript**: Como organizar funcionalidades relacionadas

8. **Debugging**: Como usar console.log() para acompanhar o que está acontecendo

💡 DESAFIOS PARA OS ALUNOS:
- Mudarem a cor do quadrado
- Alterarem a velocidade de movimento
- Adicionarem mais quadrados
- Criarem obstáculos no canvas
- Adicionarem pontuação
*/