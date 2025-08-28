/**
 * SISTEMA DE MENU E NAVEGAÇÃO
 * 
 * Este arquivo gerencia todas as telas do jogo:
 * - Menu principal
 * - Tela de configurações
 * - Tela de regras
 * - Transições entre telas
 * - Configurações do jogo
 */

/**
 * Classe principal que gerencia o sistema de menu
 */
class GerenciadorMenu {
    constructor() {
        // Referências dos elementos do DOM
        this.telaMenuPrincipal = document.getElementById('menu-principal');
        this.telaConfiguracoes = document.getElementById('configuracoes');
        this.telaRegras = document.getElementById('regras');
        this.telaJogo = document.getElementById('tela-jogo');
        this.modalFimJogo = document.getElementById('modal-fim-jogo');
        
        // Estado atual do menu
        this.telaAtual = 'menu-principal';
        this.configuracaoJogo = {
            modalidade: 'classico',
            numeroJogadores: 2,
            dificuldadeIA: 'medio'
        };
        
        // Histórico de telas para navegação
        this.historicoTelas = ['menu-principal'];
        
        console.log('🎮 Gerenciador de menu inicializado');
        
        // Configura eventos
        this.configurarEventos();
        
        // Aplica animações iniciais
        this.aplicarAnimacaoEntrada();
    }

    /**
     * Configura todos os eventos do menu
     */
    configurarEventos() {
        // Eventos de teclado para navegação
        document.addEventListener('keydown', (event) => {
            this.gerenciarTeclas(event);
        });
        
        // Eventos de redimensionamento
        window.addEventListener('resize', () => {
            this.ajustarLayoutResponsivo();
        });
        
        // Eventos de visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pausarAnimacoes();
            } else {
                this.retomarAnimacoes();
            }
        });
        
        console.log('⌨️ Eventos de menu configurados');
    }

    /**
     * Gerencia teclas de atalho no menu
     * @param {KeyboardEvent} event - Evento de teclado
     */
    gerenciarTeclas(event) {
        // Apenas processa teclas no menu, não durante o jogo
        if (this.telaAtual === 'jogo') return;
        
        switch (event.key) {
            case 'Escape':
                this.voltarTela();
                break;
            case '1':
                if (this.telaAtual === 'menu-principal') {
                    this.iniciarJogo('classico');
                }
                break;
            case '2':
                if (this.telaAtual === 'menu-principal') {
                    this.iniciarJogo('bloqueio');
                }
                break;
            case '3':
                if (this.telaAtual === 'menu-principal') {
                    this.iniciarJogo('pontuacao');
                }
                break;
            case 'h':
            case 'H':
                if (this.telaAtual === 'menu-principal') {
                    this.mostrarRegras();
                }
                break;
        }
    }

    /**
     * Mostra uma tela específica e esconde as outras
     * @param {string} nomeTela - Nome da tela para mostrar
     */
    mostrarTela(nomeTela) {
        // Lista de todas as telas
        const todasTelas = [
            this.telaMenuPrincipal,
            this.telaConfiguracoes,
            this.telaRegras,
            this.telaJogo
        ];
        
        // Esconde todas as telas
        todasTelas.forEach(tela => {
            if (tela) {
                tela.classList.add('hidden');
            }
        });
        
        // Mostra a tela solicitada
        let telaElemento;
        switch (nomeTela) {
            case 'menu-principal':
                telaElemento = this.telaMenuPrincipal;
                break;
            case 'configuracoes':
                telaElemento = this.telaConfiguracoes;
                break;
            case 'regras':
                telaElemento = this.telaRegras;
                break;
            case 'jogo':
                telaElemento = this.telaJogo;
                break;
            default:
                console.warn(`⚠️ Tela desconhecida: ${nomeTela}`);
                return;
        }
        
        if (telaElemento) {
            telaElemento.classList.remove('hidden');
            this.telaAtual = nomeTela;
            
            // Adiciona ao histórico se não for a mesma tela
            if (this.historicoTelas[this.historicoTelas.length - 1] !== nomeTela) {
                this.historicoTelas.push(nomeTela);
            }
            
            console.log(`📺 Tela alterada para: ${nomeTela}`);
            
            // Aplica animação de entrada
            this.aplicarAnimacaoEntrada(telaElemento);
        }
    }

    /**
     * Volta para a tela anterior no histórico
     */
    voltarTela() {
        if (this.historicoTelas.length > 1) {
            // Remove tela atual do histórico
            this.historicoTelas.pop();
            
            // Vai para tela anterior
            const telaAnterior = this.historicoTelas[this.historicoTelas.length - 1];
            this.mostrarTela(telaAnterior);
        }
    }

    /**
     * Aplica animação de entrada suave nas telas
     * @param {HTMLElement} elemento - Elemento para animar (opcional)
     */
    aplicarAnimacaoEntrada(elemento = null) {
        const alvo = elemento || document.querySelector('.tela-menu:not(.hidden)');
        
        if (alvo) {
            alvo.style.opacity = '0';
            alvo.style.transform = 'translateY(20px)';
            
            // Força reflow
            alvo.offsetHeight;
            
            // Aplica transição
            alvo.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            alvo.style.opacity = '1';
            alvo.style.transform = 'translateY(0)';
            
            // Remove transição após animação
            setTimeout(() => {
                if (alvo.style) {
                    alvo.style.transition = '';
                }
            }, 300);
        }
    }

    /**
     * Inicia o processo de configuração de um jogo
     * @param {string} modalidade - Modalidade do jogo ('classico', 'bloqueio', 'pontuacao')
     */
    iniciarJogo(modalidade) {
        this.configuracaoJogo.modalidade = modalidade;
        
        console.log(`🎯 Iniciando configuração para modalidade: ${modalidade}`);
        
        // Atualiza interface de configurações baseada na modalidade
        this.atualizarInterfaceConfiguracao(modalidade);
        
        // Vai para tela de configurações
        this.mostrarTela('configuracoes');
    }

    /**
     * Atualiza a interface de configuração baseada na modalidade escolhida
     * @param {string} modalidade - Modalidade do jogo
     */
    atualizarInterfaceConfiguracao(modalidade) {
        const titulo = document.querySelector('#configuracoes h2');
        
        // Atualiza título baseado na modalidade
        const titulos = {
            'classico': '⚙️ Configurar Jogo Clássico',
            'bloqueio': '⚙️ Configurar Jogo de Bloqueio', 
            'pontuacao': '⚙️ Configurar Jogo por Pontuação'
        };
        
        if (titulo) {
            titulo.textContent = titulos[modalidade] || '⚙️ Configurações do Jogo';
        }
        
        // Configura valores padrão dos selects
        const selectJogadores = document.getElementById('num-jogadores');
        const selectDificuldade = document.getElementById('dificuldade-ia');
        
        if (selectJogadores) {
            selectJogadores.value = this.configuracaoJogo.numeroJogadores.toString();
        }
        
        if (selectDificuldade) {
            selectDificuldade.value = this.configuracaoJogo.dificuldadeIA;
        }
        
        // Adiciona dicas específicas da modalidade
        this.adicionarDicasModalidade(modalidade);
    }

    /**
     * Adiciona dicas específicas para cada modalidade
     * @param {string} modalidade - Modalidade do jogo
     */
    adicionarDicasModalidade(modalidade) {
        const container = document.querySelector('#configuracoes .container-menu');
        
        // Remove dicas anteriores
        const dicasAnteriores = container.querySelector('.dicas-modalidade');
        if (dicasAnteriores) {
            dicasAnteriores.remove();
        }
        
        // Cria nova seção de dicas
        const dicasElement = document.createElement('div');
        dicasElement.className = 'dicas-modalidade';
        dicasElement.style.cssText = `
            background: #e6fffa;
            border-left: 4px solid #38b2ac;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 0.9em;
        `;
        
        const dicas = {
            'classico': '🎯 <strong>Jogo Clássico:</strong> O primeiro jogador a jogar todas as suas peças vence a partida.',
            'bloqueio': '🚫 <strong>Jogo de Bloqueio:</strong> Quando ninguém pode mais jogar, vence quem tiver menos pontos nas peças restantes.',
            'pontuacao': '🏆 <strong>Jogo por Pontuação:</strong> Jogue várias rodadas. O primeiro a atingir 100 pontos vence!'
        };
        
        dicasElement.innerHTML = dicas[modalidade] || '';
        
        // Insere antes dos botões
        const botoes = container.querySelector('.botoes-config');
        container.insertBefore(dicasElement, botoes);
    }

    /**
     * Confirma as configurações e inicia o jogo
     */
    confirmarJogo() {
        // Coleta configurações da interface
        const selectJogadores = document.getElementById('num-jogadores');
        const selectDificuldade = document.getElementById('dificuldade-ia');
        
        if (selectJogadores) {
            this.configuracaoJogo.numeroJogadores = parseInt(selectJogadores.value);
        }
        
        if (selectDificuldade) {
            this.configuracaoJogo.dificuldadeIA = selectDificuldade.value;
        }
        
        console.log('✅ Configurações confirmadas:', this.configuracaoJogo);
        
        // Transição para o jogo
        this.iniciarTransicaoJogo();
    }

    /**
     * Faz a transição animada para o jogo
     */
    iniciarTransicaoJogo() {
        // Mostra tela de carregamento temporária
        this.mostrarCarregamento();
        
        // Simula carregamento e depois inicia o jogo
        setTimeout(() => {
            this.mostrarTela('jogo');
            
            // Dispara evento para inicializar o jogo principal
            const evento = new CustomEvent('iniciarJogo', {
                detail: { configuracao: this.configuracaoJogo }
            });
            document.dispatchEvent(evento);
            
        }, 1000);
    }

    /**
     * Mostra tela de carregamento
     */
    mostrarCarregamento() {
        // Cria overlay de carregamento
        const overlay = document.createElement('div');
        overlay.id = 'overlay-carregamento';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; color: white;">
                <div class="spinner" style="
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(255,255,255,0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px auto;
                "></div>
                <h2>🁅 Preparando o jogo...</h2>
                <p>Embaralhando as peças...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Força reflow e aplica opacity
        overlay.offsetHeight;
        overlay.style.opacity = '1';
        
        // CSS da animação do spinner
        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove overlay após um tempo
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }, 800);
    }

    /**
     * Volta para o menu principal
     */
    voltarMenu() {
        // Limpa histórico e volta ao menu
        this.historicoTelas = ['menu-principal'];
        this.mostrarTela('menu-principal');
        
        // Dispara evento para pausar/finalizar jogo se necessário
        const evento = new CustomEvent('voltarMenu');
        document.dispatchEvent(evento);
    }

    /**
     * Mostra a tela de regras
     */
    mostrarRegras() {
        this.mostrarTela('regras');
    }

    /**
     * Mostra modal de fim de jogo
     * @param {Object} resultado - Resultado do jogo
     */
    mostrarFimJogo(resultado) {
        const modal = this.modalFimJogo;
        const titulo = document.getElementById('titulo-resultado');
        const texto = document.getElementById('texto-resultado');
        const pontuacao = document.getElementById('pontuacao-final');
        
        if (!modal) return;
        
        // Atualiza conteúdo baseado no resultado
        if (titulo) {
            titulo.textContent = resultado.venceu ? '🎉 Parabéns!' : '😔 Fim de Jogo';
        }
        
        if (texto) {
            texto.textContent = resultado.venceu ? 
                'Você venceu o jogo!' : 
                `${resultado.vencedor} venceu!`;
        }
        
        if (pontuacao) {
            pontuacao.innerHTML = this.formatarPontuacaoFinal(resultado);
        }
        
        // Mostra modal com animação
        modal.classList.remove('hidden');
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        }, 10);
        
        console.log('🏁 Modal de fim de jogo exibido');
    }

    /**
     * Formata a pontuação final para exibição
     * @param {Object} resultado - Resultado do jogo
     * @returns {string} HTML formatado da pontuação
     */
    formatarPontuacaoFinal(resultado) {
        let html = '<h3>📊 Pontuação Final</h3>';
        
        if (resultado.pontuacoes) {
            resultado.pontuacoes.forEach((pontos, jogador) => {
                const emoji = jogador === 0 ? '👤' : '🤖';
                const nome = jogador === 0 ? 'Você' : `Jogador ${jogador + 1}`;
                const destaque = resultado.vencedorIndex === jogador ? 
                    'style="color: #38a169; font-weight: bold;"' : '';
                
                html += `<p ${destaque}>${emoji} ${nome}: ${pontos} pontos</p>`;
            });
        }
        
        if (resultado.rodadas) {
            html += `<p><strong>Rodadas jogadas:</strong> ${resultado.rodadas}</p>`;
        }
        
        if (resultado.tempoJogo) {
            html += `<p><strong>Tempo de jogo:</strong> ${resultado.tempoJogo}</p>`;
        }
        
        return html;
    }

    /**
     * Esconde o modal de fim de jogo
     */
    esconderFimJogo() {
        const modal = this.modalFimJogo;
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    }

    /**
     * Inicia um novo jogo com as mesmas configurações
     */
    novoJogo() {
        this.esconderFimJogo();
        this.iniciarTransicaoJogo();
    }

    /**
     * Ajusta layout para diferentes tamanhos de tela
     */
    ajustarLayoutResponsivo() {
        const larguraTela = window.innerWidth;
        
        // Ajusta tamanho dos botões em telas pequenas
        const botoesMenu = document.querySelectorAll('.botao-menu');
        botoesMenu.forEach(botao => {
            if (larguraTela < 768) {
                botao.style.fontSize = '1rem';
                botao.style.padding = '15px';
            } else {
                botao.style.fontSize = '';
                botao.style.padding = '';
            }
        });
        
        // Ajusta container do menu
        const containers = document.querySelectorAll('.container-menu');
        containers.forEach(container => {
            if (larguraTela < 600) {
                container.style.maxWidth = '95%';
                container.style.padding = '20px';
            } else {
                container.style.maxWidth = '';
                container.style.padding = '';
            }
        });
        
        // Redimensiona canvas se estiver na tela de jogo
        if (this.telaAtual === 'jogo' && window.tabuleiro) {
            window.tabuleiro.redimensionar();
        }
    }

    /**
     * Pausa animações quando página não está visível
     */
    pausarAnimacoes() {
        document.body.style.animationPlayState = 'paused';
    }

    /**
     * Retoma animações quando página volta a ficar visível
     */
    retomarAnimacoes() {
        document.body.style.animationPlayState = 'running';
    }

    /**
     * Obtém configuração atual do jogo
     * @returns {Object} Configuração do jogo
     */
    obterConfiguracaoJogo() {
        return { ...this.configuracaoJogo };
    }

    /**
     * Define nova configuração do jogo
     * @param {Object} novaConfig - Nova configuração
     */
    definirConfiguracaoJogo(novaConfig) {
        this.configuracaoJogo = { ...this.configuracaoJogo, ...novaConfig };
    }

    /**
     * Mostra notificação temporária
     * @param {string} mensagem - Mensagem a exibir
     * @param {string} tipo - Tipo da notificação ('sucesso', 'erro', 'info')
     */
    mostrarNotificacao(mensagem, tipo = 'info') {
        // Remove notificação anterior se existir
        const notificacaoAntiga = document.getElementById('notificacao-temp');
        if (notificacaoAntiga) {
            notificacaoAntiga.remove();
        }
        
        // Cria nova notificação
        const notificacao = document.createElement('div');
        notificacao.id = 'notificacao-temp';
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        // Define cor baseada no tipo
        const cores = {
            'sucesso': '#48bb78',
            'erro': '#f56565',
            'info': '#4299e1',
            'aviso': '#ed8936'
        };
        
        notificacao.style.background = cores[tipo] || cores['info'];
        notificacao.textContent = mensagem;
        
        document.body.appendChild(notificacao);
        
        // Anima entrada
        setTimeout(() => {
            notificacao.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notificacao.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notificacao.parentNode) {
                    notificacao.parentNode.removeChild(notificacao);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Salva configurações no localStorage (se disponível)
     */
    salvarConfiguracoes() {
        try {
            const configuracoes = {
                numeroJogadores: this.configuracaoJogo.numeroJogadores,
                dificuldadeIA: this.configuracaoJogo.dificuldadeIA,
                ultimaModalidade: this.configuracaoJogo.modalidade
            };
            
            // Note: localStorage não funciona em artifacts do Claude
            // Esta função estaria disponível apenas em ambiente real
            console.log('💾 Configurações que seriam salvas:', configuracoes);
        } catch (erro) {
            console.log('ℹ️ Salvamento não disponível neste ambiente');
        }
    }

    /**
     * Carrega configurações salvas (se disponíveis)
     */
    carregarConfiguracoes() {
        try {
            // Note: localStorage não funciona em artifacts do Claude
            // Esta função estaria disponível apenas em ambiente real
            console.log('📂 Tentativa de carregar configurações (não disponível em artifacts)');
        } catch (erro) {
            console.log('ℹ️ Carregamento não disponível neste ambiente');
        }
    }

    /**
     * Exibe estatísticas do jogador (se houver)
     */
    mostrarEstatisticas() {
        const stats = {
            jogosJogados: 0,
            vitorias: 0,
            derrotas: 0,
            melhorTempo: 'N/A',
            modalidadeFavorita: 'Clássico'
        };
        
        // Em um ambiente real, estas estatísticas viriam do localStorage
        console.log('📈 Estatísticas do jogador:', stats);
        
        this.mostrarNotificacao('Estatísticas não disponíveis nesta demonstração', 'info');
    }

    /**
     * Reseta todas as configurações para padrão
     */
    resetarConfiguracoes() {
        this.configuracaoJogo = {
            modalidade: 'classico',
            numeroJogadores: 2,
            dificuldadeIA: 'medio'
        };
        
        console.log('🔄 Configurações resetadas para padrão');
        this.mostrarNotificacao('Configurações resetadas!', 'sucesso');
    }

    /**
     * Ativa/desativa modo tela cheia
     */
    alternarTelaCheia() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('❌ Erro ao ativar tela cheia:', err);
                this.mostrarNotificacao('Tela cheia não suportada', 'erro');
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Mostra/esconde tutorial interativo
     */
    mostrarTutorial() {
        // Em uma implementação completa, haveria um tutorial passo-a-passo
        this.mostrarNotificacao('Tutorial interativo seria implementado aqui!', 'info');
    }

    /**
     * Obtém informações sobre o estado atual do menu
     * @returns {Object} Estado atual do menu
     */
    obterEstado() {
        return {
            telaAtual: this.telaAtual,
            configuracao: this.configuracaoJogo,
            historico: [...this.historicoTelas]
        };
    }
}

/**
 * Funções globais para integração com HTML
 * Estas funções são chamadas diretamente pelos elementos do HTML
 */

// Instância global do gerenciador de menu
let gerenciadorMenu;

// Inicializa o gerenciador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    gerenciadorMenu = new GerenciadorMenu();
    console.log('🚀 Sistema de menu carregado');
});

/**
 * Inicia jogo com modalidade específica
 * Chamada pelos botões do menu principal
 */
function iniciarJogo(modalidade) {
    if (gerenciadorMenu) {
        gerenciadorMenu.iniciarJogo(modalidade);
    } else {
        console.error('❌ Gerenciador de menu não inicializado');
    }
}

/**
 * Mostra tela de regras
 * Chamada pelo botão "Como Jogar"
 */
function mostrarRegras() {
    if (gerenciadorMenu) {
        gerenciadorMenu.mostrarRegras();
    }
}

/**
 * Volta para tela anterior
 * Chamada pelos botões "Voltar"
 */
function voltarMenu() {
    if (gerenciadorMenu) {
        gerenciadorMenu.voltarMenu();
    }
}

/**
 * Confirma configurações e inicia jogo
 * Chamada pelo botão "Começar Jogo" na tela de configurações
 */
function confirmarJogo() {
    if (gerenciadorMenu) {
        gerenciadorMenu.confirmarJogo();
    }
}

/**
 * Inicia novo jogo com mesmas configurações
 * Chamada pelo botão "Jogar Novamente" no modal de fim de jogo
 */
function novoJogo() {
    if (gerenciadorMenu) {
        gerenciadorMenu.novoJogo();
    }
}

/**
 * Mostra notificação na tela
 * Função utilitária para outros scripts
 */
function mostrarNotificacao(mensagem, tipo = 'info') {
    if (gerenciadorMenu) {
        gerenciadorMenu.mostrarNotificacao(mensagem, tipo);
    }
}

/**
 * Obtém configuração atual do jogo
 * Usada por outros scripts para configurar o jogo
 */
function obterConfiguracaoJogo() {
    return gerenciadorMenu ? gerenciadorMenu.obterConfiguracaoJogo() : null;
}

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.GerenciadorMenu = GerenciadorMenu;
    window.gerenciadorMenu = null; // Será definido após inicialização
}