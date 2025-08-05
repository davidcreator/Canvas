// =====================================
// CONFIGURAÇÃO INICIAL DO CANVAS
// =====================================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurações do objeto (quadrado verde)
const gameObject = {
    x: canvas.width / 2,        // Posição horizontal inicial (centro)
    y: canvas.height / 2,       // Posição vertical inicial (centro)
    width: 40,                  // Largura do quadrado
    height: 40,                 // Altura do quadrado
    color: '#48bb78'            // Cor verde
};

// Configurações de controle
let gameSettings = {
    speed: 5,                   // Velocidade de movimento
    activeControl: 'Nenhum'     // Controle ativo no momento
};

// =====================================
// FUNÇÕES DE DESENHO
// =====================================

function drawGameObject() {
    // Limpa todo o canvas (como apagar um quadro)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha uma sombra sutil
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(gameObject.x + 3, gameObject.y + 3, gameObject.width, gameObject.height);
    
    // Desenha o quadrado principal
    ctx.fillStyle = gameObject.color;
    ctx.fillRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height);
    
    // Desenha uma borda para destacar
    ctx.strokeStyle = '#2f855a';
    ctx.lineWidth = 2;
    ctx.strokeRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height);
    
    // Atualiza a interface com as informações atuais
    updateStatusDisplay();
}

function updateStatusDisplay() {
    // Atualiza os elementos da interface com os valores atuais
    document.getElementById('posX').textContent = Math.round(gameObject.x);
    document.getElementById('posY').textContent = Math.round(gameObject.y);
    document.getElementById('currentSpeed').textContent = gameSettings.speed;
    document.getElementById('activeControl').textContent = gameSettings.activeControl;
}

// =====================================
// CONTROLE POR TECLADO
// =====================================

window.addEventListener('keydown', function(evento) {
    gameSettings.activeControl = 'Teclado';
    
    // Verifica qual tecla foi pressionada
    switch (evento.key) {
        case 'ArrowUp':
            gameObject.y -= gameSettings.speed;  // Move para cima
            break;
        case 'ArrowDown':
            gameObject.y += gameSettings.speed;  // Move para baixo
            break;
        case 'ArrowLeft':
            gameObject.x -= gameSettings.speed;  // Move para esquerda
            break;
        case 'ArrowRight':
            gameObject.x += gameSettings.speed;  // Move para direita
            break;
        default:
            return; // Se não foi uma seta, não faz nada
    }
    
    // Impede que o objeto saia dos limites do canvas
    keepObjectInBounds();
    // Redesenha o objeto na nova posição
    drawGameObject();
});

// =====================================
// CONTROLE POR MOUSE
// =====================================

canvas.addEventListener('mousemove', function(evento) {
    gameSettings.activeControl = 'Mouse';
    
    // Obtém a posição do canvas na tela
    const canvasRect = canvas.getBoundingClientRect();
    
    // Calcula a posição do mouse relativa ao canvas
    // Subtrai metade do tamanho do objeto para centralizá-lo no cursor
    gameObject.x = evento.clientX - canvasRect.left - (gameObject.width / 2);
    gameObject.y = evento.clientY - canvasRect.top - (gameObject.height / 2);
    
    // Mantém o objeto dentro dos limites
    keepObjectInBounds();
    // Redesenha o objeto
    drawGameObject();
});

// Remove o controle ativo quando o mouse sai do canvas
canvas.addEventListener('mouseleave', function() {
    gameSettings.activeControl = 'Nenhum';
    updateStatusDisplay();
});

// =====================================
// CONTROLE POR GAMEPAD
// =====================================

let gamepadConnected = false;

// Detecta quando um gamepad é conectado
window.addEventListener("gamepadconnected", function(evento) {
    console.log("🎮 Gamepad conectado:", evento.gamepad.id);
    gamepadConnected = true;
    document.getElementById('gamepadStatus').textContent = `Conectado: ${evento.gamepad.id}`;
    
    // Inicia o loop de atualização do gamepad
    updateGamepadInput();
});

// Detecta quando um gamepad é desconectado
window.addEventListener("gamepaddisconnected", function(evento) {
    console.log("🎮 Gamepad desconectado");
    gamepadConnected = false;
    document.getElementById('gamepadStatus').textContent = "Nenhum gamepad detectado";
});

function updateGamepadInput() {
    // Só continua se há um gamepad conectado
    if (!gamepadConnected) return;
    
    // Obtém a lista de gamepads conectados
    const gamepads = navigator.getGamepads();
    
    // Verifica cada gamepad
    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        
        if (gamepad) {
            // Lê os valores dos analógicos (eixos)
            const horizontalAxis = gamepad.axes[0];  // Eixo X (esquerda/direita)
            const verticalAxis = gamepad.axes[1];    // Eixo Y (cima/baixo)
            
            // Define uma zona morta para evitar movimento involuntário
            const deadZone = 0.1;
            
            // Só move se o analógico estiver fora da zona morta
            if (Math.abs(horizontalAxis) > deadZone || Math.abs(verticalAxis) > deadZone) {
                gameSettings.activeControl = 'Gamepad';
                
                // Atualiza a posição baseada na entrada do gamepad
                gameObject.x += horizontalAxis * gameSettings.speed;
                gameObject.y += verticalAxis * gameSettings.speed;
                
                // Mantém dentro dos limites
                keepObjectInBounds();
                // Redesenha
                drawGameObject();
            }
        }
    }
    
    // Solicita a próxima atualização
    requestAnimationFrame(updateGamepadInput);
}

// =====================================
// FUNÇÕES AUXILIARES
// =====================================

function keepObjectInBounds() {
    // Impede que o objeto saia pela esquerda ou direita
    if (gameObject.x < 0) {
        gameObject.x = 0;
    } else if (gameObject.x + gameObject.width > canvas.width) {
        gameObject.x = canvas.width - gameObject.width;
    }
    
    // Impede que o objeto saia por cima ou por baixo
    if (gameObject.y < 0) {
        gameObject.y = 0;
    } else if (gameObject.y + gameObject.height > canvas.height) {
        gameObject.y = canvas.height - gameObject.height;
    }
}

// =====================================
// CONTROLES DA INTERFACE
// =====================================

// Controle de velocidade
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

speedSlider.addEventListener('input', function() {
    gameSettings.speed = parseInt(this.value);
    speedValue.textContent = this.value;
    updateStatusDisplay();
});

// =====================================
// INICIALIZAÇÃO
// =====================================

// Desenha o objeto inicial quando a página carrega
drawGameObject();

// Mensagem de boas-vindas no console
console.log("🎮 Canvas Didático carregado com sucesso!");
console.log("💡 Dica: Abra as ferramentas de desenvolvedor para ver mensagens de debug");