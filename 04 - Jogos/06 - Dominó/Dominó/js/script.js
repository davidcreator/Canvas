/**
 * LÓGICA PRINCIPAL DO JOGO DE DOMINÓ
 * 
 * Este é o arquivo central que coordena todo o jogo:
 * - Inicialização do jogo
 * - Gerenciamento de turnos
 * - Inteligência Artificial dos oponentes
 * - Validação de jogadas
 * - Controle de fim de jogo
 * - Integração entre todos os sistemas
 */

/**
 * Classe principal que controla todo o fluxo do jogo
 */
class JogoDomino {
    constructor() {
        // Componentes do jogo
        this.conjuntoPecas = null;
        this.tabuleiro = null;
        
        // Estado do jogo
        this.jogadores = []; // Array com as mãos de cada jogador
        this.jogadorAtual = 0; // Índice do jogador atual
        this.numeroJogadores = 2;
        this.modalidadeJogo = 'classico';
        
        // Configurações
        this.dificuldadeIA = 'medio';
        this.jogoAtivo = false;
        this.jogoInicializado = false;
        
        // Estatísticas da partida
        this.rodadaAtual = 1;
        this.pontuacaoJogadores = [];
        this.tempoInicio = null;
        this.historicoJogadas = [];
        
        // Interface
        this.pecaSelecionada = null;
        this.extremidadeSelecionada = null;
        
        console.log('🎮 Jogo de dominó inicializado');
    }

    /**
     * Inicializa um novo jogo com as configurações fornecidas
     * @param {Object} config - Configuração do jogo
     */
    inicializar(config) {
        console.log('🚀 Inicializando novo jogo:', config);
        
        // Aplica configurações
        this.numeroJogadores = config.numeroJogadores || 2;
        this.modalidadeJogo = config.modalidade || 'classico';
        this.dificuldadeIA = config.dificuldadeIA || 'medio';
        
        // Inicializa componentes
        this.conjuntoPecas = new ConjuntoPecas();
        this.tabuleiro = new TabuleiroJogo('canvas-jogo');
        
        // Prepara o jogo
        this.prepararNovoJogo();
        
        // Configura eventos
        this.configurarEventos();
        
        // Atualiza interface
        this.atualizarInterface();
        
        this.jogoInicializado = true;
        this.jogoAtivo = true;
        this.tempoInicio = Date.now();
        
        console.log('✅ Jogo inicializado com sucesso');
    }

    /**
     * Prepara um novo jogo do zero
     */
    prepararNovoJogo() {
        // Cria e embaralha as peças
        this.conjuntoPecas.criarConjuntoCompleto();
        this.conjuntoPecas.embaralhar();
        
        // Distribui peças para os jogadores
        this.jogadores = this.conjuntoPecas.distribuirPecas(this.numeroJogadores);
        
        // Inicializa pontuação
        this.pontuacaoJogadores = new Array(this.numeroJogadores).fill(0);
        
        // Limpa tabuleiro
        this.tabuleiro.limpar();
        
        // Determina quem começa
        this.determinarPrimeiroJogador();
        
        // Limpa seleções
        this.pecaSelecionada = null;
        this.extremidadeSelecionada = null;
        this.historicoJogadas = [];
        
        console.log(`🎯 Jogo preparado: ${this.numeroJogadores} jogadores, modalidade ${this.modalidadeJogo}`);
    }

    /**
     * Determina qual jogador faz a primeira jogada
     * Baseado na maior dupla ou maior peça
     */
    determinarPrimeiroJogador() {
        let maiorDupla = null;
        let jogadorComMaiorDupla = -1;
        let maiorValor = -1;
        
        // Procura a maior dupla entre todos os jogadores
        for (let i = 0; i < this.jogadores.length; i++) {
            const dupla = this.conjuntoPecas.encontrarMaiorDupla(this.jogadores[i]);
            if (dupla && dupla.lado1 > maiorValor) {
                maiorValor = dupla.lado1;
                maiorDupla = dupla;
                jogadorComMaiorDupla = i;
            }
        }
        
        // Se não há duplas, procura a peça de maior valor
        if (jogadorComMaiorDupla === -1) {
            let maiorPeca = null;
            maiorValor = -1;
            
            for (let i = 0; i < this.jogadores.length; i++) {
                for (const peca of this.jogadores[i]) {
                    if (peca.obterValorTotal() > maiorValor) {
                        maiorValor = peca.obterValorTotal();
                        maiorPeca = peca;
                        jogadorComMaiorDupla = i;
                    }
                }
            }
        }
        
        this.jogadorAtual = jogadorComMaiorDupla;
        console.log(`👑 Jogador ${this.jogadorAtual + 1} começa (peça de valor ${maiorValor})`);
        
        // Se for IA que começa, faz jogada automática após um delay
        if (this.jogadorAtual > 0) {
            setTimeout(() => {
                this.executarJogadaIA();
            }, 1000);
        }
    }

    /**
     * Configura todos os eventos do jogo
     */
    configurarEventos() {
        // Evento de clique nas extremidades do tabuleiro
        document.getElementById('canvas-jogo').addEventListener('extremidadeClicada', (event) => {
            this.aoClicarExtremidade(event.detail.extremidade);
        });
        
        // Botões de controle
        const btnComprar = document.getElementById('btn-comprar');
        const btnPassar = document.getElementById('btn-passar');
        
        if (btnComprar) {
            btnComprar.addEventListener('click', () => this.comprarPeca());
        }
        
        if (btnPassar) {
            btnPassar.addEventListener('click', () => this.passarVez());
        }
        
        // Evento de iniciar jogo vindo do menu
        document.addEventListener('iniciarJogo', (event) => {
            this.inicializar(event.detail.configuracao);
        });
        
        // Evento de voltar ao menu
        document.addEventListener('voltarMenu', () => {
            this.pausarJogo();
        });
        
        console.log('⚡ Eventos do jogo configurados');
    }

    /**
     * Processa clique do jogador em uma peça
     * @param {PecaDomino} peca - Peça clicada
     */
    aoClicarPeca(peca) {
        if (!this.jogoAtivo || this.jogadorAtual !== 0) {
            return; // Não é vez do jogador humano
        }
        
        // Verifica se a peça pode ser jogada
        const extremidades = this.tabuleiro.obterExtremidades();
        const validacao = ValidadorJogadas.validarJogada(peca, extremidades);
        
        if (!validacao.valida) {
            mostrarNotificacao('Esta peça não pode ser jogada!', 'erro');
            return;
        }
        
        // Se só há uma opção de extremidade, joga automaticamente
        if (validacao.extremidadesDisponiveis.length === 1) {
            this.executarJogada(peca, validacao.extremidadesDisponiveis[0]);
        } else {
            // Seleciona a peça e aguarda escolha da extremidade
            this.pecaSelecionada = peca;
            RenderizadorPecas.destacarPeca(peca);
            
            // Destaca extremidades disponíveis
            validacao.extremidadesDisponiveis.forEach(ext => {
                this.tabuleiro.destacarExtremidade(ext, true);
            });
            
            mostrarNotificacao('Escolha onde colocar a peça', 'info');
        }
    }

    /**
     * Processa clique do jogador em uma extremidade do tabuleiro
     * @param {string} extremidade - 'esquerda' ou 'direita'
     */
    aoClicarExtremidade(extremidade) {
        if (!this.pecaSelecionada || !this.jogoAtivo || this.jogadorAtual !== 0) {
            return;
        }
        
        // Valida se pode jogar nesta extremidade
        const extremidades = this.tabuleiro.obterExtremidades();
        const validacao = ValidadorJogadas.validarJogada(this.pecaSelecionada, extremidades);
        
        if (!validacao.extremidadesDisponiveis.includes(extremidade)) {
            mostrarNotificacao('Não é possível jogar nesta extremidade!', 'erro');
            return;
        }
        
        // Executa a jogada
        this.executarJogada(this.pecaSelecionada, extremidade);
    }

    /**
     * Executa uma jogada no tabuleiro
     * @param {PecaDomino} peca - Peça a ser jogada
     * @param {string} extremidade - Extremidade onde jogar
     * @returns {boolean} True se jogada foi executada com sucesso
     */
    executarJogada(peca, extremidade) {
        try {
            // Remove peça da mão do jogador
            const maoJogador = this.jogadores[this.jogadorAtual];
            const indicePeca = maoJogador.indexOf(peca);
            if (indicePeca === -1) {
                throw new Error('Peça não encontrada na mão do jogador');
            }
            
            maoJogador.splice(indicePeca, 1);
            
            // Adiciona peça ao tabuleiro
            const sucesso = this.tabuleiro.adicionarPeca(peca, extremidade);
            if (!sucesso) {
                // Reverte remoção da peça se falhou
                maoJogador.push(peca);
                throw new Error('Falha ao adicionar peça ao tabuleiro');
            }
            
            // Registra jogada no histórico
            this.historicoJogadas.push({
                jogador: this.jogadorAtual,
                peca: `${peca.lado1}|${peca.lado2}`,
                extremidade: extremidade,
                tempo: Date.now() - this.tempoInicio
            });
            
            console.log(`✅ Jogador ${this.jogadorAtual + 1} jogou ${peca.id} na ${extremidade}`);
            
            // Limpa seleções
            this.pecaSelecionada = null;
            RenderizadorPecas.removerDestaques();
            
            // Atualiza interface
            this.atualizarInterface();
            
            // Verifica fim de jogo
            if (this.verificarFimJogo()) {
                return true;
            }
            
            // Próximo jogador
            this.proximoJogador();
            
            return true;
        } catch (erro) {
            console.error('❌ Erro na jogada:', erro.message);
            mostrarNotificacao('Erro ao executar jogada!', 'erro');
            return false;
        }
    }

    /**
     * Executa jogada da Inteligência Artificial
     */
    executarJogadaIA() {
        if (!this.jogoAtivo || this.jogadorAtual === 0) {
            return; // Não é vez da IA
        }
        
        const maoIA = this.jogadores[this.jogadorAtual];
        const extremidades = this.tabuleiro.obterExtremidades();
        
        // Encontra jogadas possíveis
        const pecasJogaveis = ValidadorJogadas.obterPecasJogaveis(maoIA, extremidades);
        
        if (pecasJogaveis.length === 0) {
            // IA não pode jogar, tenta comprar ou passa
            if (this.conjuntoPecas.temPecasNoMonte()) {
                this.comprarPecaIA();
            } else {
                this.passarVezIA();
            }
            return;
        }
        
        // Escolhe melhor jogada baseada na dificuldade
        const jogada = this.escolherJogadaIA(pecasJogaveis, extremidades);
        
        if (jogada) {
            // Delay para simular "pensamento" da IA
            setTimeout(() => {
                this.executarJogada(jogada.peca, jogada.extremidade);
            }, 1000 + Math.random() * 1000); // 1-2 segundos
        }
    }

    /**
     * Escolhe a melhor jogada para a IA baseada na dificuldade
     * @param {Array} pecasJogaveis - Peças que podem ser jogadas
     * @param {Array} extremidades - Extremidades do tabuleiro
     * @returns {Object} Jogada escolhida {peca, extremidade}
     */
    escolherJogadaIA(pecasJogaveis, extremidades) {
        const [extremidadeEsq, extremidadeDir] = extremidades;
        
        switch (this.dificuldadeIA) {
            case 'facil':
                return this.jogadaIAFacil(pecasJogaveis, extremidades);
            case 'medio':
                return this.jogadaIAMedio(pecasJogaveis, extremidades);
            case 'dificil':
                return this.jogadaIADificil(pecasJogaveis, extremidades);
            default:
                return this.jogadaIAFacil(pecasJogaveis, extremidades);
        }
    }

    /**
     * Estratégia da IA fácil - jogadas aleatórias
     */
    jogadaIAFacil(pecasJogaveis, extremidades) {
        const pecaEscolhida = pecasJogaveis[Math.floor(Math.random() * pecasJogaveis.length)];
        const validacao = ValidadorJogadas.validarJogada(pecaEscolhida, extremidades);
        const extremidade = validacao.extremidadesDisponiveis[
            Math.floor(Math.random() * validacao.extremidadesDisponiveis.length)
        ];
        
        return { peca: pecaEscolhida, extremidade };
    }

    /**
     * Estratégia da IA média - prioriza peças de maior valor
     */
    jogadaIAMedio(pecasJogaveis, extremidades) {
        // Ordena peças por valor total (decrescente)
        const pecasOrdenadas = [...pecasJogaveis].sort((a, b) => 
            b.obterValorTotal() - a.obterValorTotal()
        );
        
        const pecaEscolhida = pecasOrdenadas[0];
        const validacao = ValidadorJogadas.validarJogada(pecaEscolhida, extremidades);
        
        // Prefere extremidade que gera mais opções futuras
        let extremidadeEscolhida = validacao.extremidadesDisponiveis[0];
        
        if (validacao.extremidadesDisponiveis.length > 1) {
            // Lógica simples: prefere extremidade que resulta em número menos comum
            const maoIA = this.jogadores[this.jogadorAtual];
            const contadores = { esquerda: 0, direita: 0 };
            
            validacao.extremidadesDisponiveis.forEach(ext => {
                const novoValor = pecaEscolhida.obterLadoOposto(extremidades[ext === 'esquerda' ? 0 : 1]);
                contadores[ext] = maoIA.filter(p => p.podeConectar(novoValor)).length;
            });
            
            extremidadeEscolhida = contadores.esquerda <= contadores.direita ? 'esquerda' : 'direita';
        }
        
        return { peca: pecaEscolhida, extremidade: extremidadeEscolhida };
    }

    /**
     * Estratégia da IA difícil - análise avançada
     */
    jogadaIADificil(pecasJogaveis, extremidades) {
        let melhorJogada = null;
        let melhorPontuacao = -1;
        
        for (const peca of pecasJogaveis) {
            const validacao = ValidadorJogadas.validarJogada(peca, extremidades);
            
            for (const extremidade of validacao.extremidadesDisponiveis) {
                const pontuacao = this.avaliarJogada(peca, extremidade, extremidades);
                
                if (pontuacao > melhorPontuacao) {
                    melhorPontuacao = pontuacao;
                    melhorJogada = { peca, extremidade };
                }
            }
        }
        
        return melhorJogada;
    }

    /**
     * Avalia uma jogada específica para a IA difícil
     * @param {PecaDomino} peca - Peça a avaliar
     * @param {string} extremidade - Extremidade onde jogar
     * @param {Array} extremidades - Estado atual das extremidades
     * @returns {number} Pontuação da jogada
     */
    avaliarJogada(peca, extremidade, extremidades) {
        const maoIA = this.jogadores[this.jogadorAtual];
        let pontuacao = 0;
        
        // Pontuação base: valor da peça (para se livrar de peças altas)
        pontuacao += peca.obterValorTotal();
        
        // Bônus para duplas (são difíceis de jogar)
        if (peca.ehDupla()) {
            pontuacao += 20;
        }
        
        // Simula resultado da jogada
        const novoValor = peca.obterLadoOposto(extremidades[extremidade === 'esquerda' ? 0 : 1]);
        
        // Conta quantas peças da mão podem conectar com o novo valor
        const pecasCompativeis = maoIA.filter(p => p !== peca && p.podeConectar(novoValor)).length;
        pontuacao += pecasCompativeis * 5;
        
        // Penaliza se criar extremidade que o oponente pode ter muitas peças
        // (análise simplificada baseada na distribuição estatística)
        if (novoValor >= 3 && novoValor <= 4) {
            pontuacao -= 5; // Números mais comuns
        }
        
        return pontuacao;
    }

    /**
     * IA compra uma peça do monte
     */
    comprarPecaIA() {
        const peca = this.conjuntoPecas.comprarPeca();
        if (peca) {
            this.jogadores[this.jogadorAtual].push(peca);
            console.log(`🤖 Jogador ${this.jogadorAtual + 1} comprou uma peça`);
            
            // Tenta jogar a peça comprada
            const extremidades = this.tabuleiro.obterExtremidades();
            const validacao = ValidadorJogadas.validarJogada(peca, extremidades);
            
            if (validacao.valida) {
                // Pode jogar a peça comprada
                setTimeout(() => {
                    const jogada = this.escolherJogadaIA([peca], extremidades);
                    if (jogada) {
                        this.executarJogada(jogada.peca, jogada.extremidade);
                    }
                }, 500);
            } else {
                // Não pode jogar, passa a vez
                setTimeout(() => {
                    this.passarVezIA();
                }, 500);
            }
        } else {
            // Monte vazio, passa a vez
            this.passarVezIA();
        }
        
        this.atualizarInterface();
    }

    /**
     * IA passa a vez
     */
    passarVezIA() {
        console.log(`🤖 Jogador ${this.jogadorAtual + 1} passou a vez`);
        
        this.historicoJogadas.push({
            jogador: this.jogadorAtual,
            peca: null,
            extremidade: null,
            acao: 'passou',
            tempo: Date.now() - this.tempoInicio
        });
        
        this.proximoJogador();
    }

    /**
     * Jogador humano compra uma peça
     */
    comprarPeca() {
        if (!this.jogoAtivo || this.jogadorAtual !== 0) {
            mostrarNotificacao('Não é sua vez!', 'erro');
            return;
        }
        
        const peca = this.conjuntoPecas.comprarPeca();
        if (peca) {
            this.jogadores[0].push(peca);
            console.log(`👤 Jogador humano comprou: ${peca.id}`);
            mostrarNotificacao(`Você comprou: ${peca.id}`, 'sucesso');
            
            this.atualizarInterface();
            
            // Verifica se pode jogar a peça comprada
            const extremidades = this.tabuleiro.obterExtremidades();
            const validacao = ValidadorJogadas.validarJogada(peca, extremidades);
            
            if (validacao.valida) {
                mostrarNotificacao('A peça comprada pode ser jogada!', 'info');
            } else {
                mostrarNotificacao('Você deve passar a vez', 'info');
            }
        } else {
            mostrarNotificacao('Monte vazio!', 'erro');
        }
    }

    /**
     * Jogador humano passa a vez
     */
    passarVez() {
        if (!this.jogoAtivo || this.jogadorAtual !== 0) {
            mostrarNotificacao('Não é sua vez!', 'erro');
            return;
        }
        
        // Verifica se realmente não pode jogar
        const maoJogador = this.jogadores[0];
        const extremidades = this.tabuleiro.obterExtremidades();
        
        if (ValidadorJogadas.temJogadasValidas(maoJogador, extremidades)) {
            mostrarNotificacao('Você ainda pode jogar!', 'erro');
            return;
        }
        
        // Se tem peças no monte, deve comprar primeiro
        if (this.conjuntoPecas.temPecasNoMonte()) {
            mostrarNotificacao('Você deve comprar do monte primeiro!', 'erro');
            return;
        }
        
        console.log('👤 Jogador humano passou a vez');
        mostrarNotificacao('Você passou a vez', 'info');
        
        this.historicoJogadas.push({
            jogador: 0,
            peca: null,
            extremidade: null,
            acao: 'passou',
            tempo: Date.now() - this.tempoInicio
        });
        
        this.proximoJogador();
    }

    /**
     * Avança para o próximo jogador
     */
    proximoJogador() {
        this.jogadorAtual = (this.jogadorAtual + 1) % this.numeroJogadores;
        
        this.atualizarInterface();
        
        // Se é vez da IA, executa jogada após delay
        if (this.jogadorAtual > 0) {
            setTimeout(() => {
                this.executarJogadaIA();
            }, 1000);
        }
        
        console.log(`🔄 Vez do jogador ${this.jogadorAtual + 1}`);
    }

    /**
     * Verifica se o jogo terminou
     * @returns {boolean} True se o jogo terminou
     */
    verificarFimJogo() {
        // Verifica se algum jogador não tem mais peças
        for (let i = 0; i < this.jogadores.length; i++) {
            if (this.jogadores[i].length === 0) {
                this.finalizarJogo('acabou_pecas', i);
                return true;
            }
        }
        
        // Verifica se jogo está travado (ninguém pode jogar)
        if (this.verificarTravamento()) {
            this.finalizarJogo('travado');
            return true;
        }
        
        return false;
    }

    /**
     * Verifica se o jogo está travado
     * @returns {boolean} True se travado
     */
    verificarTravamento() {
        const extremidades = this.tabuleiro.obterExtremidades();
        
        // Verifica se algum jogador pode jogar
        for (const maoJogador of this.jogadores) {
            if (ValidadorJogadas.temJogadasValidas(maoJogador, extremidades)) {
                return false; // Pelo menos um jogador pode jogar
            }
        }
        
        // Ninguém pode jogar e monte está vazio
        return !this.conjuntoPecas.temPecasNoMonte();
    }

    /**
     * Finaliza o jogo e determina vencedor
     * @param {string} tipoFim - Tipo de fim do jogo
     * @param {number} vencedorIndex - Índice do vencedor (se aplicável)
     */
    finalizarJogo(tipoFim, vencedorIndex = -1) {
        this.jogoAtivo = false;
        
        console.log(`🏁 Jogo finalizado: ${tipoFim}`);
        
        const resultado = this.calcularResultado(tipoFim, vencedorIndex);
        this.atualizarEstatisticas(resultado);
        
        // Mostra resultado após um pequeno delay
        setTimeout(() => {
            gerenciadorMenu.mostrarFimJogo(resultado);
        }, 1500);
    }

    /**
     * Calcula o resultado final do jogo
     * @param {string} tipoFim - Tipo de fim do jogo
     * @param {number} vencedorIndex - Índice do vencedor
     * @returns {Object} Resultado detalhado
     */
    calcularResultado(tipoFim, vencedorIndex) {
        const pontuacaoFinal = this.jogadores.map(mao => 
            mao.reduce((total, peca) => total + peca.obterValorTotal(), 0)
        );
        
        let vencedor;
        let vencedorFinal;
        
        if (tipoFim === 'acabou_pecas') {
            vencedor = vencedorIndex;
            vencedorFinal = vencedorIndex;
        } else {
            // Jogo travado - vence quem tem menos pontos
            const menorPontuacao = Math.min(...pontuacaoFinal);
            vencedor = pontuacaoFinal.indexOf(menorPontuacao);
            vencedorFinal = vencedor;
        }
        
        // Atualiza pontuação da rodada baseada na modalidade
        this.atualizarPontuacaoModalidade(pontuacaoFinal, vencedorFinal, tipoFim);
        
        const tempoJogo = this.formatarTempo(Date.now() - this.tempoInicio);
        
        return {
            tipoFim,
            vencedorIndex: vencedorFinal,
            vencedor: vencedorFinal === 0 ? 'Você' : `Jogador ${vencedorFinal + 1}`,
            venceu: vencedorFinal === 0,
            pontuacoes: pontuacaoFinal,
            pontuacaoJogo: [...this.pontuacaoJogadores],
            rodadas: this.rodadaAtual,
            tempoJogo,
            modalidade: this.modalidadeJogo
        };
    }

    /**
     * Atualiza pontuação baseada na modalidade do jogo
     */
    atualizarPontuacaoModalidade(pontuacaoFinal, vencedor, tipoFim) {
        switch (this.modalidadeJogo) {
            case 'classico':
                // No clássico, vencedor ganha pontos dos outros jogadores
                if (tipoFim === 'acabou_pecas') {
                    const pontosGanhos = pontuacaoFinal.reduce((total, pontos, index) => 
                        index !== vencedor ? total + pontos : total, 0
                    );
                    this.pontuacaoJogadores[vencedor] += pontosGanhos;
                }
                break;
                
            case 'bloqueio':
                // No bloqueio, sempre conta pontos restantes
                const menorPontuacao = Math.min(...pontuacaoFinal);
                const indiceMenor = pontuacaoFinal.indexOf(menorPontuacao);
                this.pontuacaoJogadores[indiceMenor] += 1; // 1 ponto pela vitória
                break;
                
            case 'pontuacao':
                // Jogo por pontuação - acumula até 100
                const pontosRodada = tipoFim === 'acabou_pecas' ? 
                    pontuacaoFinal.reduce((sum, p) => sum + p, 0) : 0;
                this.pontuacaoJogadores[vencedor] += pontosRodada;
                break;
        }
    }

    /**
     * Atualiza todas as informações da interface
     */
    atualizarInterface() {
        this.atualizarInfoJogador();
        this.atualizarPecasJogador();
        this.atualizarBotoes();
        this.atualizarPontuacao();
    }

    /**
     * Atualiza informações do jogador atual na interface
     */
    atualizarInfoJogador() {
        const elementoJogador = document.getElementById('jogador-atual');
        const elementoModo = document.getElementById('modo-jogo');
        
        if (elementoJogador) {
            const nomeJogador = this.jogadorAtual === 0 ? 'Sua Vez' : `Jogador ${this.jogadorAtual + 1}`;
            elementoJogador.textContent = nomeJogador;
            elementoJogador.style.color = this.jogadorAtual === 0 ? '#38a169' : '#e53e3e';
        }
        
        if (elementoModo) {
            const nomesModo = {
                'classico': 'Clássico',
                'bloqueio': 'Bloqueio',
                'pontuacao': 'Pontuação'
            };
            elementoModo.textContent = nomesModo[this.modalidadeJogo] || 'Dominó';
        }
    }

    /**
     * Atualiza exibição das peças do jogador humano
     */
    atualizarPecasJogador() {
        if (this.jogadores.length > 0) {
            RenderizadorPecas.atualizarPecasJogador(this.jogadores[0], (peca) => {
                this.aoClicarPeca(peca);
            });
        }
    }

    /**
     * Atualiza estado dos botões de controle
     */
    atualizarBotoes() {
        const btnComprar = document.getElementById('btn-comprar');
        const btnPassar = document.getElementById('btn-passar');
        
        const isVezJogador = this.jogadorAtual === 0 && this.jogoAtivo;
        const temMonte = this.conjuntoPecas && this.conjuntoPecas.temPecasNoMonte();
        
        if (btnComprar) {
            btnComprar.disabled = !isVezJogador || !temMonte;
            btnComprar.style.opacity = btnComprar.disabled ? '0.5' : '1';
        }
        
        if (btnPassar) {
            btnPassar.disabled = !isVezJogador;
            btnPassar.style.opacity = btnPassar.disabled ? '0.5' : '1';
        }
    }

    /**
     * Atualiza exibição da pontuação
     */
    atualizarPontuacao() {
        const elementoPontos = document.getElementById('pontos-jogador');
        const elementoPecas = document.getElementById('pecas-restantes');
        
        if (elementoPontos && this.pontuacaoJogadores.length > 0) {
            elementoPontos.textContent = `Pontos: ${this.pontuacaoJogadores[0]}`;
        }
        
        if (elementoPecas && this.jogadores.length > 0) {
            elementoPecas.textContent = `Peças: ${this.jogadores[0].length}`;
        }
    }

    /**
     * Atualiza estatísticas do jogo
     */
    atualizarEstatisticas(resultado) {
        // Em uma implementação completa, salvaria estatísticas
        console.log('📊 Estatísticas atualizadas:', {
            vencedor: resultado.vencedor,
            tempoJogo: resultado.tempoJogo,
            totalJogadas: this.historicoJogadas.length,
            modalidade: this.modalidadeJogo
        });
    }

    /**
     * Pausa o jogo atual
     */
    pausarJogo() {
        this.jogoAtivo = false;
        console.log('⏸️ Jogo pausado');
    }

    /**
     * Resume o jogo pausado
     */
    resumirJogo() {
        if (this.jogoInicializado) {
            this.jogoAtivo = true;
            console.log('▶️ Jogo resumido');
        }
    }

    /**
     * Formata tempo em milissegundos para string legível
     * @param {number} ms - Tempo em milissegundos
     * @returns {string} Tempo formatado
     */
    formatarTempo(ms) {
        const segundos = Math.floor(ms / 1000);
        const minutos = Math.floor(segundos / 60);
        const segsRestantes = segundos % 60;
        
        return `${minutos}:${segsRestantes.toString().padStart(2, '0')}`;
    }

    /**
     * Obtém estatísticas do jogo atual
     * @returns {Object} Estatísticas detalhadas
     */
    obterEstatisticas() {
        return {
            jogoAtivo: this.jogoAtivo,
            jogadorAtual: this.jogadorAtual,
            rodadaAtual: this.rodadaAtual,
            tempoDecorrido: this.tempoInicio ? Date.now() - this.tempoInicio : 0,
            totalJogadas: this.historicoJogadas.length,
            pecasRestantesMonte: this.conjuntoPecas ? this.conjuntoPecas.pecasRestantesMonte() : 0,
            pontuacaoAtual: [...this.pontuacaoJogadores]
        };
    }
}

/**
 * Instância global do jogo
 */
let jogoAtual = null;

/**
 * Inicializa o jogo quando o documento estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    jogoAtual = new JogoDomino();
    console.log('🎮 Sistema de jogo carregado');
});

/**
 * Funções utilitárias globais
 */

/**
 * Obtém instância atual do jogo
 */
function obterJogoAtual() {
    return jogoAtual;
}

/**
 * Reinicia o jogo com as mesmas configurações
 */
function reiniciarJogo() {
    if (jogoAtual && jogoAtual.jogoInicializado) {
        const config = {
            modalidade: jogoAtual.modalidadeJogo,
            numeroJogadores: jogoAtual.numeroJogadores,
            dificuldadeIA: jogoAtual.dificuldadeIA
        };
        jogoAtual.inicializar(config);
    }
}

/**
 * Exporta para uso global
 */
if (typeof window !== 'undefined') {
    window.JogoDomino = JogoDomino;
    window.jogoAtual = null; // Será definido após inicialização
    window.obterJogoAtual = obterJogoAtual;
    window.reiniciarJogo = reiniciarJogo;
}