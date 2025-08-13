/*
===============================================
TÍTULO: Script JavaScript para Interface de Jogo 2D
DESCRIÇÃO: Controla toda a lógica da interface,
incluindo atualização de barras de status,
interações do usuário e animações
===============================================
*/

/**
 * CLASSE: GameUI
 * DESCRIÇÃO: Classe principal que gerencia toda a interface
 * do usuário, incluindo barras de status e interações
 */
class GameUI {
    constructor() {
        // Inicialização das variáveis de jogo
        this.stats = {
            health: 100,    // Vida do jogador (0-100)
            energy: 100,    // Energia do jogador (0-100)
            stamina: 100,   // Estamina do jogador (0-100)
            experience: 0   // Experiência do jogador (0-100)
        };
        
        // Referências aos elementos DOM
        this.elements = {
            healthCount: document.getElementById("health-count"),
            energyCount: document.getElementById("energy-count"),
            staminaCount: document.getElementById("stamina-count"),
            experienceCount: document.getElementById("experience-count"),
            healthBar: document.getElementById("health-bar"),
            energyBar: document.getElementById("energy-bar"),
            staminaBar: document.getElementById("stamina-bar"),
            experienceBar: document.getElementById("experience-bar")
        };
        
        this.init();
    }

    /**
     * MÉTODO: init
     * DESCRIÇÃO: Inicializa a interface e configura
     * os eventos de clique nos ícones de função
     */
    init() {
        this.updateUI();
        this.setupEventListeners();
        console.log("Interface de jogo inicializada com sucesso!");
    }

    /**
     * MÉTODO: setupEventListeners
     * DESCRIÇÃO: Configura todos os eventos de clique
     * e interações da interface
     */
    setupEventListeners() {
        // Eventos para os ícones de funcionalidade
        const functionIcons = {
            'weapon-icon': () => this.showMessage('Abrindo arsenal de armas...'),
            'bag-icon': () => this.showMessage('Abrindo inventário...'),
            'map-icon': () => this.showMessage('Carregando mapa completo...'),
            'settings-icon': () => this.showMessage('Abrindo configurações...')
        };

        // Adiciona eventos de clique para cada ícone
        Object.entries(functionIcons).forEach(([id, callback]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', callback);
            }
        });

        // Evento de clique no canvas (exemplo de interação)
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            console.log(`Clique no jogo em: (${Math.round(x)}, ${Math.round(y)})`);
        });
    }

    /**
     * MÉTODO: updateUI
     * DESCRIÇÃO: Atualiza todos os elementos visuais da interface
     * com base nos valores atuais das estatísticas
     */
    updateUI() {
        // Atualiza os textos das barras
        this.elements.healthCount.textContent = `${this.stats.health}%`;
        this.elements.energyCount.textContent = `${this.stats.energy}%`;
        this.elements.staminaCount.textContent = `${this.stats.stamina}%`;
        this.elements.experienceCount.textContent = `${this.stats.experience}%`;

        // Atualiza a largura visual das barras
        this.updateBarWidth('health-bar', this.stats.health);
        this.updateBarWidth('energy-bar', this.stats.energy);
        this.updateBarWidth('stamina-bar', this.stats.stamina);
        this.updateBarWidth('experience-bar', this.stats.experience);
    }

    /**
     * MÉTODO: updateBarWidth
     * DESCRIÇÃO: Atualiza a largura visual de uma barra específica
     * @param {string} barId - ID da barra a ser atualizada
     * @param {number} percentage - Percentual de preenchimento (0-100)
     */
    updateBarWidth(barId, percentage) {
        const bar = document.getElementById(barId);
        if (bar) {
            bar.style.setProperty('--width', `${percentage}%`);
            // Atualiza o CSS customizado para a largura da barra
            const beforeElement = window.getComputedStyle(bar, '::before');
            bar.style.setProperty('--bar-width', `${percentage}%`);
        }
    }

    /**
     * MÉTODO: adjustHealth
     * DESCRIÇÃO: Ajusta a vida do jogador dentro dos limites válidos
     * @param {number} amount - Quantidade a ser ajustada (positiva ou negativa)
     */
    adjustHealth(amount) {
        const oldHealth = this.stats.health;
        this.stats.health = this.clamp(this.stats.health + amount, 0, 100);
        
        console.log(`Vida alterada: ${oldHealth}% → ${this.stats.health}%`);
        
        // Efeito visual quando a vida está baixa
        if (this.stats.health <= 20) {
            this.addLowHealthEffect();
        } else {
            this.removeLowHealthEffect();
        }
        
        this.updateUI();
    }

    /**
     * MÉTODO: adjustEnergy
     * DESCRIÇÃO: Ajusta a energia do jogador
     * @param {number} amount - Quantidade a ser ajustada
     */
    adjustEnergy(amount) {
        const oldEnergy = this.stats.energy;
        this.stats.energy = this.clamp(this.stats.energy + amount, 0, 100);
        console.log(`Energia alterada: ${oldEnergy}% → ${this.stats.energy}%`);
        this.updateUI();
    }

    /**
     * MÉTODO: adjustStamina
     * DESCRIÇÃO: Ajusta a estamina do jogador
     * @param {number} amount - Quantidade a ser ajustada
     */
    adjustStamina(amount) {
        const oldStamina = this.stats.stamina;
        this.stats.stamina = this.clamp(this.stats.stamina + amount, 0, 100);
        console.log(`Estamina alterada: ${oldStamina}% → ${this.stats.stamina}%`);
        this.updateUI();
    }

    /**
     * MÉTODO: gainExperience
     * DESCRIÇÃO: Adiciona experiência ao jogador
     * @param {number} amount - Quantidade de experiência a ganhar
     */
    gainExperience(amount) {
        const oldXP = this.stats.experience;
        this.stats.experience = this.clamp(this.stats.experience + amount, 0, 100);
        console.log(`Experiência ganha: ${oldXP}% → ${this.stats.experience}%`);
        
        // Efeito especial quando atinge 100% de experiência
        if (this.stats.experience === 100) {
            this.showMessage('🎉 NÍVEL COMPLETADO! 🎉');
        }
        
        this.updateUI();
    }

    /**
     * MÉTODO: clamp
     * DESCRIÇÃO: Garante que um valor esteja dentro de um intervalo
     * @param {number} value - Valor a ser limitado
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} Valor limitado ao intervalo
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * MÉTODO: addLowHealthEffect
     * DESCRIÇÃO: Adiciona efeito visual quando a vida está baixa
     */
    addLowHealthEffect() {
        document.body.style.filter = 'hue-rotate(0deg) brightness(0.8)';
        this.elements.healthBar.style.animation = 'pulse 1s infinite';
    }

    /**
     * MÉTODO: removeLowHealthEffect
     * DESCRIÇÃO: Remove o efeito visual de vida baixa
     */
    removeLowHealthEffect() {
        document.body.style.filter = 'none';
        this.elements.healthBar.style.animation = 'none';
    }

    /**
     * MÉTODO: showMessage
     * DESCRIÇÃO: Exibe uma mensagem temporária na tela
     * @param {string} message - Mensagem a ser exibida
     */
    showMessage(message) {
        // Remove mensagem anterior se existir
        const existingMessage = document.getElementById('game-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.id = 'game-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 212, 255, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
        `;

        document.body.appendChild(messageDiv);

        // Remove a mensagem após 2 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 2000);
    }

    /**
     * MÉTODO: resetAll
     * DESCRIÇÃO: Reseta todas as estatísticas para valores iniciais
     */
    resetAll() {
        this.stats = {
            health: 100,
            energy: 100,
            stamina: 100,
            experience: 0
        };
        this.removeLowHealthEffect();
        this.updateUI();
        this.showMessage('Estatísticas resetadas!');
        console.log('Todas as estatísticas foram resetadas');
    }
}

/*
SEÇÃO: Inicialização da Aplicação
DESCRIÇÃO: Aguarda o carregamento completo da página
e inicializa a interface do jogo
*/
let gameUI; // Variável global para acesso aos controles

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página carregada. Inicializando interface do jogo...");
    
    // Cria a instância principal da interface
    gameUI = new GameUI();
    
    // Adiciona animação de pulsação para vida baixa
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        
        /* Atualização das larguras das barras */
        #health-bar::before { width: var(--bar-width, 100%); }
        #energy-bar::before { width: var(--bar-width, 100%); }
        #stamina-bar::before { width: var(--bar-width, 100%); }
        #experience-bar::before { width: var(--bar-width, 0%); }
    `;
    document.head.appendChild(style);
    
    console.log("Interface do jogo totalmente carregada e funcional! 🎮");
});