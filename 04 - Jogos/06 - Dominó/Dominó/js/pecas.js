/**
 * SISTEMA DE PEÇAS DO DOMINÓ
 * 
 * Este arquivo contém todas as funções relacionadas às peças do jogo:
 * - Criação do conjunto de peças
 * - Embaralhamento
 * - Distribuição para jogadores
 * - Renderização das peças
 * - Validação de jogadas
 */

/**
 * Classe que representa uma peça de dominó
 */
class PecaDomino {
    /**
     * Construtor da peça
     * @param {number} lado1 - Primeiro valor da peça (0-6)
     * @param {number} lado2 - Segundo valor da peça (0-6)
     */
    constructor(lado1, lado2) {
        this.lado1 = lado1;
        this.lado2 = lado2;
        this.id = `${lado1}-${lado2}`; // Identificador único da peça
        this.rotacao = 0; // Rotação da peça no tabuleiro (em graus)
        this.x = 0; // Posição X no canvas
        this.y = 0; // Posição Y no canvas
        this.largura = 60; // Largura da peça em pixels
        this.altura = 30; // Altura da peça em pixels
    }

    /**
     * Verifica se a peça é uma dupla (dois lados iguais)
     * @returns {boolean} True se for dupla
     */
    ehDupla() {
        return this.lado1 === this.lado2;
    }

    /**
     * Calcula o valor total da peça (soma dos dois lados)
     * @returns {number} Soma dos valores dos lados
     */
    obterValorTotal() {
        return this.lado1 + this.lado2;
    }

    /**
     * Verifica se a peça pode se conectar com um número específico
     * @param {number} numero - Número para conectar
     * @returns {boolean} True se pode conectar
     */
    podeConectar(numero) {
        return this.lado1 === numero || this.lado2 === numero;
    }

    /**
     * Obtém o lado oposto ao conectado
     * @param {number} ladoConectado - Lado que está conectado
     * @returns {number} Valor do lado oposto
     */
    obterLadoOposto(ladoConectado) {
        if (this.lado1 === ladoConectado) {
            return this.lado2;
        } else if (this.lado2 === ladoConectado) {
            return this.lado1;
        }
        return -1; // Erro: lado não encontrado
    }

    /**
     * Cria uma cópia da peça
     * @returns {PecaDomino} Nova instância da peça
     */
    clonar() {
        const clone = new PecaDomino(this.lado1, this.lado2);
        clone.rotacao = this.rotacao;
        clone.x = this.x;
        clone.y = this.y;
        return clone;
    }
}

/**
 * Classe que gerencia o conjunto completo de peças do jogo
 */
class ConjuntoPecas {
    constructor() {
        this.todasPecas = []; // Array com todas as 28 peças
        this.monte = []; // Peças disponíveis para compra
        this.pecasJogadas = []; // Peças já jogadas no tabuleiro
    }

    /**
     * Cria o conjunto completo de 28 peças do dominó duplo-6
     * Cada peça é única, de 0-0 até 6-6
     */
    criarConjuntoCompleto() {
        this.todasPecas = []; // Limpa o array

        // Loop para criar todas as combinações possíveis
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                // Cria uma nova peça com os valores i e j
                const peca = new PecaDomino(i, j);
                this.todasPecas.push(peca);
            }
        }

        console.log(`✅ Conjunto criado: ${this.todasPecas.length} peças`);
        return this.todasPecas;
    }

    /**
     * Embaralha as peças usando o algoritmo Fisher-Yates
     * Este algoritmo garante uma distribuição uniforme e aleatória
     */
    embaralhar() {
        const pecas = this.todasPecas;
        
        // Loop reverso para embaralhar
        for (let i = pecas.length - 1; i > 0; i--) {
            // Escolhe um índice aleatório de 0 até i
            const j = Math.floor(Math.random() * (i + 1));
            
            // Troca as peças de posição
            [pecas[i], pecas[j]] = [pecas[j], pecas[i]];
        }

        console.log('🔀 Peças embaralhadas');
    }

    /**
     * Distribui peças para os jogadores
     * @param {number} numeroJogadores - Quantidade de jogadores (2-4)
     * @returns {Array} Array com as mãos de cada jogador
     */
    distribuirPecas(numeroJogadores = 2) {
        // Define quantas peças cada jogador recebe
        const pecasPorJogador = numeroJogadores === 4 ? 6 : 7;
        
        const maosJogadores = []; // Array que conterá as mãos de todos os jogadores
        let indiceAtual = 0; // Índice para pegar peças do monte

        // Distribui peças para cada jogador
        for (let jogador = 0; jogador < numeroJogadores; jogador++) {
            const maoJogador = [];
            
            // Cada jogador recebe o número determinado de peças
            for (let i = 0; i < pecasPorJogador; i++) {
                if (indiceAtual < this.todasPecas.length) {
                    maoJogador.push(this.todasPecas[indiceAtual]);
                    indiceAtual++;
                }
            }
            
            maosJogadores.push(maoJogador);
            console.log(`🎮 Jogador ${jogador + 1}: ${maoJogador.length} peças`);
        }

        // As peças restantes formam o monte
        this.monte = this.todasPecas.slice(indiceAtual);
        console.log(`📚 Monte: ${this.monte.length} peças restantes`);

        return maosJogadores;
    }

    /**
     * Compra uma peça do monte
     * @returns {PecaDomino|null} Peça comprada ou null se monte vazio
     */
    comprarPeca() {
        if (this.monte.length > 0) {
            const peca = this.monte.pop(); // Remove a última peça do monte
            console.log(`🛒 Peça comprada: ${peca.id}`);
            return peca;
        }
        
        console.log('❌ Monte vazio - não é possível comprar');
        return null;
    }

    /**
     * Encontra a maior dupla entre as peças fornecidas
     * @param {Array} pecas - Array de peças para verificar
     * @returns {PecaDomino|null} A maior dupla encontrada ou null
     */
    encontrarMaiorDupla(pecas) {
        let maiorDupla = null;
        let maiorValor = -1;

        // Procura por duplas nas peças
        for (const peca of pecas) {
            if (peca.ehDupla() && peca.lado1 > maiorValor) {
                maiorValor = peca.lado1;
                maiorDupla = peca;
            }
        }

        if (maiorDupla) {
            console.log(`👑 Maior dupla encontrada: ${maiorDupla.id}`);
        }

        return maiorDupla;
    }

    /**
     * Conta quantas peças restam no monte
     * @returns {number} Número de peças no monte
     */
    pecasRestantesMonte() {
        return this.monte.length;
    }

    /**
     * Verifica se ainda há peças no monte
     * @returns {boolean} True se monte não está vazio
     */
    temPecasNoMonte() {
        return this.monte.length > 0;
    }

    /**
     * Reinicia o conjunto de peças para um novo jogo
     */
    reiniciar() {
        this.todasPecas = [];
        this.monte = [];
        this.pecasJogadas = [];
        console.log('🔄 Conjunto de peças reiniciado');
    }

    /**
     * Obtém estatísticas das peças
     * @returns {Object} Objeto com estatísticas
     */
    obterEstatisticas() {
        return {
            totalPecas: this.todasPecas.length,
            pecasMonte: this.monte.length,
            pecasJogadas: this.pecasJogadas.length,
            duplasRestantes: this.monte.filter(p => p.ehDupla()).length
        };
    }
}

/**
 * Funções utilitárias para renderização das peças
 */
class RenderizadorPecas {
    /**
     * Desenha uma peça no canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     * @param {PecaDomino} peca - Peça para desenhar
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} tamanho - Tamanho da peça
     */
    desenharPeca(ctx, peca, x, y, tamanho) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(peca.angulo * (Math.PI / 180));
        ctx.fillStyle = peca.cor;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(tamanho, 0);
        ctx.lineTo(tamanho / 2, tamanho);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

// Exporta as classes para uso externo
export { PecaDomino, ConjuntoPecas, RenderizadorPecas };