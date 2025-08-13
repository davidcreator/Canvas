// ====================================
//  SEÇÃO JAVASCRIPT: CLASSE PRINCIPAL
// ====================================

/**
 * Classe principal que gerencia todo o jogo
 * Responsável por controlar o estado, interface e lógica do puzzle
 */
class PuzzleGame {
    constructor() {
        // ELEMENTOS DA INTERFACE (DOM)
        this.movesElement = document.getElementById("moves-count");
        this.scoreElement = document.getElementById("score-count");
        this.timeElement = document.getElementById("time-count");
        this.boardElement = document.getElementById("puzzle-board");
        this.overlayElement = document.getElementById("overlay");
        this.victoryElement = document.getElementById("victory-message");

        // VARIÁVEIS DE CONTROLE DO JOGO
        this.moves = 0;           // Contador de movimentos
        this.score = 0;           // Pontuação atual
        this.time = 0;            // Tempo em segundos
        this.timerInterval = null; // Referência do cronômetro
        this.isGameActive = false; // Status do jogo

        // CONFIGURAÇÃO DO PUZZLE
        this.boardSize = 3;       // Tabuleiro 3x3
        this.totalPieces = this.boardSize * this.boardSize; // 9 peças total
        this.emptyPosition = this.totalPieces - 1; // Posição da peça vazia (índice 8)

        // ESTADO INICIAL DO PUZZLE (solução)
        this.solutionState = Array.from({length: this.totalPieces}, (_, i) => i + 1);
        this.solutionState[this.emptyPosition] = null; // Última posição fica vazia

        // ESTADO ATUAL DO PUZZLE
        this.currentState = [...this.solutionState];

        // INICIALIZAR O JOGO
        this.initializeGame();
    }

    // ====================================
    //  SEÇÃO: INICIALIZAÇÃO DO JOGO
    // ====================================
    
    /**
     * Inicializa todos os componentes do jogo
     */
    initializeGame() {
        console.log("🎮 Inicializando o Jogo de Puzzle...");
        
        this.createPuzzleBoard();  // Criar o tabuleiro visual
        this.updateUI();          // Atualizar interface
        this.shufflePuzzle();     // Embaralhar as peças
        this.startTimer();        // Iniciar cronômetro
        this.isGameActive = true;
        
        console.log("✅ Jogo iniciado com sucesso!");
    }

    // ====================================
    //  SEÇÃO: CRIAÇÃO DO TABULEIRO VISUAL
    // ====================================
    
    /**
     * Cria os elementos visuais das peças do puzzle
     */
    createPuzzleBoard() {
        console.log("🔨 Criando tabuleiro visual...");
        
        // Limpar tabuleiro existente
        this.boardElement.innerHTML = '';

        // Criar cada peça do puzzle
        for (let i = 0; i < this.totalPieces; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.position = i; // Armazenar posição no elemento
            
            // Adicionar evento de clique
            piece.addEventListener('click', () => this.handlePieceClick(i));
            
            // Adicionar ao tabuleiro
            this.boardElement.appendChild(piece);
        }
        
        console.log(`✅ ${this.totalPieces} peças criadas!`);
    }

    // ====================================
    //  SEÇÃO: ATUALIZAÇÃO DA INTERFACE
    // ====================================
    
    /**
     * Atualiza todos os elementos visuais do jogo
     */
    updateUI() {
        // Atualizar contadores na interface
        this.movesElement.textContent = this.moves;
        this.scoreElement.textContent = this.score;
        this.timeElement.textContent = this.formatTime(this.time);
        
        // Atualizar visual das peças
        this.updateBoardVisual();
    }

    /**
     * Atualiza o visual das peças no tabuleiro
     */
    updateBoardVisual() {
        const pieces = this.boardElement.children;
        
        for (let i = 0; i < this.totalPieces; i++) {
            const piece = pieces[i];
            const value = this.currentState[i];
            
            if (value === null) {
                // Peça vazia
                piece.textContent = '';
                piece.className = 'puzzle-piece empty-piece';
            } else {
                // Peça com número
                piece.textContent = value;
                piece.className = 'puzzle-piece';
            }
        }
    }

    /**
     * Formata o tempo em formato MM:SS
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    }

    // ====================================
    //  SEÇÃO: LÓGICA DO PUZZLE
    // ====================================
    
    /**
     * Manipula o clique em uma peça do puzzle
     */
    handlePieceClick(position) {
        if (!this.isGameActive) return;
        
        console.log(`🖱️ Clique na posição ${position}`);
        
        // Verificar se o movimento é válido
        if (this.canMovePiece(position)) {
            this.movePiece(position);
            this.incrementMoves();
            this.updateUI();
            
            // Verificar vitória
            if (this.checkVictory()) {
                this.handleVictory();
            }
        } else {
            console.log("❌ Movimento inválido");
        }
    }

    /**
     * Verifica se uma peça pode ser movida
     */
    canMovePiece(position) {
        const emptyPos = this.findEmptyPosition();
        const row = Math.floor(position / this.boardSize);
        const col = position % this.boardSize;
        const emptyRow = Math.floor(emptyPos / this.boardSize);
        const emptyCol = emptyPos % this.boardSize;
        
        // Verificar se está na mesma linha ou coluna e é adjacente
        const sameRow = row === emptyRow && Math.abs(col - emptyCol) === 1;
        const sameCol = col === emptyCol && Math.abs(row - emptyRow) === 1;
        
        return sameRow || sameCol;
    }

    /**
     * Move uma peça para a posição vazia
     */
    movePiece(position) {
        const emptyPos = this.findEmptyPosition();
        
        // Trocar a peça com a posição vazia
        [this.currentState[position], this.currentState[emptyPos]] = 
        [this.currentState[emptyPos], this.currentState[position]];
        
        console.log(`✅ Peça movida da posição ${position} para ${emptyPos}`);
    }

    /**
     * Encontra a posição atual da peça vazia
     */
    findEmptyPosition() {
        return this.currentState.findIndex(piece => piece === null);
    }

    // ====================================
    //  SEÇÃO: SISTEMA DE PONTUAÇÃO
    // ====================================
    
    /**
     * Incrementa o contador de movimentos
     */
    incrementMoves() {
        this.moves++;
        console.log(`📊 Movimentos: ${this.moves}`);
    }

    /**
     * Ajusta a pontuação baseada no desempenho
     */
    calculateScore() {
        // Pontuação baseada em eficiência (menos movimentos = mais pontos)
        const baseScore = 1000;
        const timePenalty = Math.floor(this.time / 10); // -1 ponto a cada 10 segundos
        const movePenalty = this.moves * 5; // -5 pontos por movimento
        
        this.score = Math.max(0, baseScore - timePenalty - movePenalty);
        console.log(`🎯 Pontuação calculada: ${this.score}`);
    }

    // ====================================
    //  SEÇÃO: CRONÔMETRO
    // ====================================
    
    /**
     * Inicia o cronômetro do jogo
     */
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (this.isGameActive) {
                this.time++;
                this.updateUI();
            }
        }, 1000);
        
        console.log("⏰ Cronômetro iniciado");
    }

    /**
     * Para o cronômetro do jogo
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            console.log("⏰ Cronômetro parado");
        }
    }

    // ====================================
    //  SEÇÃO: VERIFICAÇÃO DE VITÓRIA
    // ====================================
    
    /**
     * Verifica se o puzzle foi resolvido
     */
    checkVictory() {
        const isComplete = this.currentState.every((piece, index) => {
            return piece === this.solutionState[index];
        });
        
        console.log(`🏆 Verificação de vitória: ${isComplete ? 'GANHOU!' : 'Continua jogando...'}`);
        return isComplete;
    }

    /**
     * Manipula a vitória do jogador
     */
    handleVictory() {
        console.log("🎉 PARABÉNS! Puzzle resolvido!");
        
        this.isGameActive = false;
        this.stopTimer();
        this.calculateScore();
        this.showVictoryMessage();
    }

    /**
     * Exibe a mensagem de vitória
     */
    showVictoryMessage() {
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('final-time').textContent = this.formatTime(this.time);
        document.getElementById('final-score').textContent = this.score;
        
        this.overlayElement.style.display = 'block';
        this.victoryElement.style.display = 'block';
    }

    /**
     * Fecha a mensagem de vitória
     */
    closeVictoryMessage() {
        this.overlayElement.style.display = 'none';
        this.victoryElement.style.display = 'none';
    }

    // ====================================
    //  SEÇÃO: CONTROLES DO JOGO
    // ====================================
    
    /**
     * Embaralha as peças do puzzle
     */
    shufflePuzzle() {
        console.log("🔀 Embaralhando puzzle...");
        
        // Fazer vários movimentos aleatórios válidos para embaralhar
        const shuffleMoves = 100;
        
        for (let i = 0; i < shuffleMoves; i++) {
            const emptyPos = this.findEmptyPosition();
            const validMoves = this.getValidMoves(emptyPos);
            
            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                this.movePiece(randomMove);
            }
        }
        
        this.updateUI();
        console.log("✅ Puzzle embaralhado!");
    }

    /**
     * Obtém todos os movimentos válidos para uma posição
     */
    getValidMoves(emptyPos) {
        const validMoves = [];
        
        for (let i = 0; i < this.totalPieces; i++) {
            if (this.canMovePiece(i)) {
                validMoves.push(i);
            }
        }
        
        return validMoves;
    }

    /**
     * Reinicia o jogo completamente
     */
    resetGame() {
        console.log("🔄 Reiniciando jogo...");
        
        this.stopTimer();
        this.moves = 0;
        this.score = 0;
        this.time = 0;
        this.currentState = [...this.solutionState];
        this.isGameActive = true;
        
        this.updateUI();
        this.shufflePuzzle();
        this.startTimer();
        this.closeVictoryMessage();
        
        console.log("✅ Jogo reiniciado!");
    }

    /**
     * Mostra a solução por 3 segundos
     */
    showSolution() {
        console.log("💡 Mostrando solução...");
        
        const originalState = [...this.currentState];
        this.currentState = [...this.solutionState];
        this.updateUI();
        
        setTimeout(() => {
            this.currentState = originalState;
            this.updateUI();
            console.log("💡 Voltando ao estado original");
        }, 3000);
    }
}

// ====================================
//  SEÇÃO: INICIALIZAÇÃO
// ====================================

/**
 * Inicializar o jogo quando a página carregar
 */
let gameManager;

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Carregando Jogo de Puzzle...");
    gameManager = new PuzzleGame();
});