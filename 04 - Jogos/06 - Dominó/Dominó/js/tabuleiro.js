/**
 * SISTEMA DE TABULEIRO DO DOMINÓ
 * 
 * Este arquivo gerencia toda a lógica do tabuleiro:
 * - Posicionamento das peças
 * - Conexões entre peças
 * - Cálculo de extremidades
 * - Renderização do tabuleiro
 * - Detecção de cliques e validação de posições
 */

/**
 * Classe que representa o tabuleiro do jogo de dominó
 */
class TabuleiroJogo {
    constructor(canvasId) {
        // Referências do canvas
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Configurações do tabuleiro
        this.larguraCanvas = this.canvas.width;
        this.alturaCanvas = this.canvas.height;
        this.centrX = this.larguraCanvas / 2;
        this.centrY = this.alturaCanvas / 2;
        
        // Array que armazena todas as peças jogadas no tabuleiro
        this.pecasNoTabuleiro = [];
        
        // Extremidades atuais do tabuleiro (valores que podem receber novas peças)
        this.extremidades = {
            esquerda: null,  // Valor da extremidade esquerda
            direita: null,   // Valor da extremidade direita
            posEsquerda: { x: this.centrX, y: this.centrY }, // Posição onde próxima peça esquerda deve ir
            posDireita: { x: this.centrX, y: this.centrY }   // Posição onde próxima peça direita deve ir
        };
        
        // Configurações de layout
        this.espacamentoPecas = 5; // Espaço entre peças adjacentes
        this.tamanhoPercaBase = { largura: 60, altura: 30 }; // Tamanho padrão das peças
        
        // Estado do tabuleiro
        this.primeiraJogada = true; // Flag para controlar primeira jogada
        this.direcaoAtual = 'horizontal'; // Direção atual do layout das peças
        
        // Configurar eventos de clique no canvas
        this.configurarEventos();
        
        console.log('🎮 Tabuleiro inicializado');
    }

    /**
     * Configura os eventos de mouse no canvas
     */
    configurarEventos() {
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            this.aoClicarTabuleiro(x, y);
        });

        // Efeito visual ao passar mouse sobre o canvas
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            this.aoMoverMouse(x, y);
        });
    }

    /**
     * Limpa completamente o tabuleiro
     */
    limpar() {
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.larguraCanvas, this.alturaCanvas);
        
        // Desenha o fundo do tabuleiro
        this.desenharFundo();
        
        // Reseta todas as variáveis
        this.pecasNoTabuleiro = [];
        this.extremidades = {
            esquerda: null,
            direita: null,
            posEsquerda: { x: this.centrX, y: this.centrY },
            posDireita: { x: this.centrX, y: this.centrY }
        };
        this.primeiraJogada = true;
        this.direcaoAtual = 'horizontal';
        
        console.log('🧹 Tabuleiro limpo');
    }

    /**
     * Desenha o fundo verde do tabuleiro com detalhes visuais
     */
    desenharFundo() {
        // Gradiente de fundo
        const gradiente = this.ctx.createLinearGradient(0, 0, 0, this.alturaCanvas);
        gradiente.addColorStop(0, '#2d5a27');
        gradiente.addColorStop(1, '#1a4c1a');
        
        this.ctx.fillStyle = gradiente;
        this.ctx.fillRect(0, 0, this.larguraCanvas, this.alturaCanvas);
        
        // Linhas decorativas sutis
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Linhas horizontais
        for (let y = 50; y < this.alturaCanvas; y += 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.larguraCanvas, y);
            this.ctx.stroke();
        }
        
        // Linhas verticais
        for (let x = 50; x < this.larguraCanvas; x += 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.alturaCanvas);
            this.ctx.stroke();
        }
        
        // Marca central
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.centrX, this.centrY, 10, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    /**
     * Adiciona uma peça ao tabuleiro
     * @param {PecaDomino} peca - Peça a ser adicionada
     * @param {string} extremidade - 'esquerda' ou 'direita'
     * @returns {boolean} True se a peça foi adicionada com sucesso
     */
    adicionarPeca(peca, extremidade) {
        try {
            if (this.primeiraJogada) {
                return this.colocarPrimeiraPeca(peca);
            } else {
                return this.colocarPecaNaExtremidade(peca, extremidade);
            }
        } catch (erro) {
            console.error('❌ Erro ao adicionar peça:', erro.message);
            return false;
        }
    }

    /**
     * Coloca a primeira peça no centro do tabuleiro
     * @param {PecaDomino} peca - Primeira peça do jogo
     * @returns {boolean} True se colocada com sucesso
     */
    colocarPrimeiraPeca(peca) {
        // Define posição central para a primeira peça
        peca.x = this.centrX - peca.largura / 2;
        peca.y = this.centrY - peca.altura / 2;
        peca.rotacao = 0; // Horizontal

        // Adiciona ao tabuleiro
        this.pecasNoTabuleiro.push(peca);
        
        // Define as extremidades iniciais
        this.extremidades.esquerda = peca.lado1;
        this.extremidades.direita = peca.lado2;
        
        // Calcula posições para próximas peças
        this.extremidades.posEsquerda = {
            x: peca.x - this.espacamentoPecas - peca.largura,
            y: peca.y
        };
        this.extremidades.posDireita = {
            x: peca.x + peca.largura + this.espacamentoPecas,
            y: peca.y
        };
        
        this.primeiraJogada = false;
        
        console.log(`🎯 Primeira peça colocada: ${peca.id}`);
        console.log(`📍 Extremidades: ${this.extremidades.esquerda} | ${this.extremidades.direita}`);
        
        this.redesenhar();
        return true;
    }

    /**
     * Coloca uma peça em uma das extremidades
     * @param {PecaDomino} peca - Peça a ser colocada
     * @param {string} extremidade - 'esquerda' ou 'direita'
     * @returns {boolean} True se colocada com sucesso
     */
    colocarPecaNaExtremidade(peca, extremidade) {
        const extremidadeValor = this.extremidades[extremidade];
        
        // Verifica se a peça pode conectar com a extremidade
        if (!peca.podeConectar(extremidadeValor)) {
            console.log(`❌ Peça ${peca.id} não pode conectar com ${extremidadeValor}`);
            return false;
        }
        
        // Orienta a peça corretamente para a conexão
        this.orientarPeca(peca, extremidadeValor, extremidade);
        
        // Posiciona a peça
        const posicao = this.extremidades[extremidade === 'esquerda' ? 'posEsquerda' : 'posDireita'];
        peca.x = posicao.x;
        peca.y = posicao.y;
        
        // Adiciona ao tabuleiro
        this.pecasNoTabuleiro.push(peca);
        
        // Atualiza as extremidades
        this.atualizarExtremidades(peca, extremidade);
        
        console.log(`✅ Peça ${peca.id} adicionada na ${extremidade}`);
        console.log(`📍 Novas extremidades: ${this.extremidades.esquerda} | ${this.extremidades.direita}`);
        
        this.redesenhar();
        return true;
    }

    /**
     * Orienta uma peça para conectar corretamente com uma extremidade
     * @param {PecaDomino} peca - Peça a ser orientada
     * @param {number} valorConexao - Valor que deve conectar
     * @param {string} extremidade - Extremidade onde será colocada
     */
    orientarPeca(peca, valorConexao, extremidade) {
        // Se a peça é uma dupla, não precisa orientar
        if (peca.ehDupla()) {
            peca.rotacao = 90; // Duplas são sempre verticais
            return;
        }
        
        // Determina qual lado da peça deve ficar do lado da conexão
        let ladoConexao, ladoOposto;
        
        if (peca.lado1 === valorConexao) {
            ladoConexao = peca.lado1;
            ladoOposto = peca.lado2;
        } else {
            ladoConexao = peca.lado2;
            ladoOposto = peca.lado1;
            // Inverte os lados da peça
            [peca.lado1, peca.lado2] = [peca.lado2, peca.lado1];
        }
        
        // Define rotação baseada na extremidade
        peca.rotacao = 0; // Horizontal por padrão
        
        console.log(`🔄 Peça ${peca.id} orientada: conexão=${ladoConexao}, oposto=${ladoOposto}`);
    }

    /**
     * Atualiza as extremidades do tabuleiro após adicionar uma peça
     * @param {PecaDomino} peca - Peça que foi adicionada
     * @param {string} extremidade - Extremidade onde foi adicionada
     */
    atualizarExtremidades(peca, extremidade) {
        if (extremidade === 'esquerda') {
            // Nova extremidade esquerda é o lado oposto da peça
            this.extremidades.esquerda = peca.obterLadoOposto(this.extremidades.esquerda);
            
            // Calcula nova posição para próxima peça na esquerda
            this.extremidades.posEsquerda = {
                x: peca.x - this.espacamentoPecas - peca.largura,
                y: peca.y
            };
        } else {
            // Nova extremidade direita é o lado oposto da peça
            this.extremidades.direita = peca.obterLadoOposto(this.extremidades.direita);
            
            // Calcula nova posição para próxima peça na direita
            this.extremidades.posDireita = {
                x: peca.x + peca.largura + this.espacamentoPecas,
                y: peca.y
            };
        }
        
        // Verifica se precisa quebrar linha (tabuleiro muito longo)
        this.verificarQubraLinha();
    }

    /**
     * Verifica se o tabuleiro está muito longo e precisa quebrar linha
     */
    verificarQubraLinha() {
        const margemSeguranca = 100;
        
        // Verifica extremidade esquerda
        if (this.extremidades.posEsquerda.x < margemSeguranca) {
            this.quebrarLinhaEsquerda();
        }
        
        // Verifica extremidade direita
        if (this.extremidades.posDireita.x > this.larguraCanvas - margemSeguranca) {
            this.quebrarLinhaDireita();
        }
    }

    /**
     * Quebra linha na extremidade esquerda
     */
    quebrarLinhaEsquerda() {
        console.log('📐 Quebrando linha na esquerda');
        
        // Move extremidade esquerda para baixo
        this.extremidades.posEsquerda.y += this.tamanhoPercaBase.altura + this.espacamentoPecas * 2;
        this.extremidades.posEsquerda.x = this.centrX - this.tamanhoPercaBase.largura / 2;
    }

    /**
     * Quebra linha na extremidade direita
     */
    quebrarLinhaDireita() {
        console.log('📐 Quebrando linha na direita');
        
        // Move extremidade direita para baixo
        this.extremidades.posDireita.y += this.tamanhoPercaBase.altura + this.espacamentoPecas * 2;
        this.extremidades.posDireita.x = this.centrX + this.tamanhoPercaBase.largura / 2;
    }

    /**
     * Redesenha todo o tabuleiro
     */
    redesenhar() {
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.larguraCanvas, this.alturaCanvas);
        
        // Desenha o fundo
        this.desenharFundo();
        
        // Desenha todas as peças
        this.pecasNoTabuleiro.forEach(peca => {
            RenderizadorPecas.desenharPeca(this.ctx, peca, peca.x, peca.y, false);
        });
        
        // Desenha indicadores de extremidades se o tabuleiro não estiver vazio
        if (!this.primeiraJogada) {
            this.desenharIndicadoresExtremidades();
        }
    }

    /**
     * Desenha indicadores visuais das extremidades onde peças podem ser colocadas
     */
    desenharIndicadoresExtremidades() {
        const corIndicador = 'rgba(255, 255, 255, 0.3)';
        
        this.ctx.strokeStyle = corIndicador;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]); // Linha tracejada
        
        // Indicador extremidade esquerda
        const posEsq = this.extremidades.posEsquerda;
        this.ctx.strokeRect(posEsq.x, posEsq.y, this.tamanhoPercaBase.largura, this.tamanhoPercaBase.altura);
        
        // Indicador extremidade direita
        const posDir = this.extremidades.posDireita;
        this.ctx.strokeRect(posDir.x, posDir.y, this.tamanhoPercaBase.largura, this.tamanhoPercaBase.altura);
        
        // Reseta linha tracejada
        this.ctx.setLineDash([]);
        
        // Texto com valores das extremidades
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        
        this.ctx.fillText(
            this.extremidades.esquerda.toString(),
            posEsq.x + this.tamanhoPercaBase.largura / 2,
            posEsq.y - 10
        );
        
        this.ctx.fillText(
            this.extremidades.direita.toString(),
            posDir.x + this.tamanhoPercaBase.largura / 2,
            posDir.y - 10
        );
    }

    /**
     * Função chamada quando o usuário clica no tabuleiro
     * @param {number} x - Coordenada X do clique
     * @param {number} y - Coordenada Y do clique
     */
    aoClicarTabuleiro(x, y) {
        // Verifica se clicou em uma área de extremidade
        const extremidadeClicada = this.detectarCliqueExtremidade(x, y);
        
        if (extremidadeClicada) {
            console.log(`👆 Clique detectado na extremidade: ${extremidadeClicada}`);
            
            // Dispara evento customizado para o jogo principal
            const evento = new CustomEvent('extremidadeClicada', {
                detail: { extremidade: extremidadeClicada }
            });
            this.canvas.dispatchEvent(evento);
        }
    }

    /**
     * Detecta se um clique foi em uma área de extremidade
     * @param {number} x - Coordenada X do clique
     * @param {number} y - Coordenada Y do clique
     * @returns {string|null} 'esquerda', 'direita' ou null
     */
    detectarCliqueExtremidade(x, y) {
        if (this.primeiraJogada) return null;
        
        // Verifica extremidade esquerda
        const posEsq = this.extremidades.posEsquerda;
        if (x >= posEsq.x && x <= posEsq.x + this.tamanhoPercaBase.largura &&
            y >= posEsq.y && y <= posEsq.y + this.tamanhoPercaBase.altura) {
            return 'esquerda';
        }
        
        // Verifica extremidade direita
        const posDir = this.extremidades.posDireita;
        if (x >= posDir.x && x <= posDir.x + this.tamanhoPercaBase.largura &&
            y >= posDir.y && y <= posDir.y + this.tamanhoPercaBase.altura) {
            return 'direita';
        }
        
        return null;
    }
}