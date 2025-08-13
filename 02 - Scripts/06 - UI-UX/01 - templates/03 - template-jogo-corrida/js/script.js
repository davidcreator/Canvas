/* ========================================
    CÓDIGO JAVASCRIPT - LÓGICA DO JOGO
    ======================================== */

// Aguarda o carregamento completo da página antes de executar
document.addEventListener("DOMContentLoaded", () => {
    
    /* ========================================
        SEÇÃO 1: CAPTURA DOS ELEMENTOS HTML
        ======================================== */
    
    // Captura os elementos HTML onde serão exibidas as informações
    const lapsCount = document.getElementById("laps-count");       // Elemento das voltas
    const speedCount = document.getElementById("speed-count");     // Elemento da velocidade
    const timeCount = document.getElementById("time-count");       // Elemento do tempo
    const positionCount = document.getElementById("position-count"); // Elemento da posição
    const fuelCount = document.getElementById("fuel-count");       // Elemento do combustível

    /* ========================================
        SEÇÃO 2: VARIÁVEIS DO ESTADO DO JOGO
        ======================================== */
    
    // Variáveis que armazenam o estado atual do jogo
    let laps = 0;        // Número de voltas completadas (0-3)
    let speed = 0;       // Velocidade atual em km/h (0-200)
    let time = 0;        // Tempo decorrido em segundos
    let position = 1;    // Posição na corrida (1-8)
    let fuel = 100;      // Combustível restante em porcentagem (0-100)

    /* ========================================
        SEÇÃO 3: FUNÇÕES DE ATUALIZAÇÃO DA INTERFACE
        ======================================== */
    
    /**
     * Função principal para atualizar todos os elementos da interface
     * Esta função é chamada sempre que alguma variável do jogo muda
     */
    function updateUI() {
        lapsCount.textContent = `${laps}/3`;           // Mostra voltas completadas
        speedCount.textContent = speed;               // Mostra velocidade atual
        timeCount.textContent = formatTime(time);     // Mostra tempo formatado
        positionCount.textContent = position;         // Mostra posição atual
        fuelCount.textContent = `${fuel}%`;          // Mostra combustível restante
    }

    /**
     * Função para formatar o tempo em minutos e segundos (MM:SS)
     * @param {number} seconds - Tempo em segundos para formatar
     * @returns {string} - Tempo formatado como "MM:SS"
     */
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0'); // Minutos
        const sec = (seconds % 60).toString().padStart(2, '0');           // Segundos
        return `${min}:${sec}`;
    }

    /* ========================================
        SEÇÃO 4: FUNÇÕES DE CONTROLE DO JOGO
        ======================================== */

    /**
     * Função para incrementar o número de voltas completadas
     * Não permite ultrapassar 3 voltas (limite da corrida)
     */
    function incrementLaps() {
        if (laps < 3) {
            laps += 1;
            console.log(`Volta completada! Total: ${laps}/3`);
        }
        updateUI(); // Atualiza a interface após a mudança
    }

    /**
     * Função para ajustar a velocidade do veículo
     * @param {number} newSpeed - Nova velocidade em km/h
     */
    function adjustSpeed(newSpeed) {
        // Limita a velocidade entre 0 e 200 km/h
        speed = Math.max(0, Math.min(200, newSpeed));
        console.log(`Velocidade ajustada para: ${speed} km/h`);
        updateUI(); // Atualiza a interface após a mudança
    }

    /**
     * Função para incrementar o tempo da corrida
     * Chamada automaticamente a cada segundo
     */
    function incrementTime() {
        time += 1;
        updateUI(); // Atualiza a interface após a mudança
    }

    /**
     * Função para alterar a posição na corrida
     * @param {number} newPosition - Nova posição (1-8)
     */
    function changePosition(newPosition) {
        // Limita a posição entre 1 (primeiro) e 8 (último)
        position = Math.max(1, Math.min(8, newPosition));
        console.log(`Posição alterada para: ${position}º lugar`);
        updateUI(); // Atualiza a interface após a mudança
    }

    /**
     * Função para ajustar o combustível
     * @param {number} amount - Quantidade a ser adicionada/subtraída
     */
    function adjustFuel(amount) {
        // Limita o combustível entre 0% e 100%
        fuel = Math.max(0, Math.min(100, fuel + amount));
        console.log(`Combustível ajustado para: ${fuel}%`);
        updateUI(); // Atualiza a interface após a mudança
    }

    /* ========================================
        SEÇÃO 5: FUNÇÕES DE DEMONSTRAÇÃO
        ======================================== */

    /**
     * Funções globais para demonstrar as funcionalidades
     * Estas funções são chamadas pelos botões da interface
     */
    
    window.demonstrarVolta = function() {
        incrementLaps();
    };

    window.demonstrarVelocidade = function() {
        // Gera uma velocidade aleatória entre 50 e 180 km/h
        const novaVelocidade = Math.floor(Math.random() * 131) + 50;
        adjustSpeed(novaVelocidade);
    };

    window.demonstrarPosicao = function() {
        // Gera uma posição aleatória entre 1 e 8
        const novaPosicao = Math.floor(Math.random() * 8) + 1;
        changePosition(novaPosicao);
    };

    window.demonstrarCombustivel = function() {
        // Reduz o combustível em 10%
        adjustFuel(-10);
    };

    window.reiniciarJogo = function() {
        // Reseta todas as variáveis para os valores iniciais
        laps = 0;
        speed = 0;
        time = 0;
        position = 1;
        fuel = 100;
        updateUI();
        console.log("Jogo reiniciado!");
    };

    /* ========================================
        SEÇÃO 6: INICIALIZAÇÃO DO JOGO
        ======================================== */

    // Atualização inicial da interface (mostra valores iniciais)
    updateUI();

    // Inicia o cronômetro - incrementa o tempo a cada 1000ms (1 segundo)
    const gameTimer = setInterval(incrementTime, 1000);

    /* ========================================
        SEÇÃO 7: SIMULAÇÃO DE EVENTOS DO JOGO
        ======================================== */

    // Simulação de eventos aleatórios durante o jogo (opcional)
    setInterval(() => {
        // A cada 5 segundos, simula pequenas mudanças na velocidade
        if (speed > 0) {
            const variacao = Math.floor(Math.random() * 21) - 10; // -10 a +10
            adjustSpeed(speed + variacao);
        }
        
        // Consome combustível gradualmente se o veículo estiver em movimento
        if (speed > 0 && fuel > 0) {
            adjustFuel(-1); // Reduz 1% de combustível
        }
    }, 5000); // A cada 5 segundos

    // Log de inicialização para depuração
    console.log("Jogo de Corrida 2D inicializado com sucesso!");
    console.log("Use os botões para demonstrar as funcionalidades.");
});