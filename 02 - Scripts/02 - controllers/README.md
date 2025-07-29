# 🎮 Como Usar Controladores com Canvas em JavaScript
## 📚 O que você vai aprender?
Neste tutorial, você vai descobrir como criar jogos simples usando:

- **Canvas:** para desenhar na tela
- **Gamepad API:** para usar controles de videogame
- **JavaScript:** para fazer tudo funcionar
Ao final, você terá um quadrado verde que se move com seu controle!

## 🎯 O que é Canvas?
O Canvas é como uma tela digital onde você pode desenhar usando código JavaScript. É muito usado para fazer jogos e animações na web.
Imagine que você tem uma folha de papel em branco e pode desenhar nela usando comandos do computador!

## 🎮 O que é a Gamepad API?
A Gamepad API é uma ferramenta que permite usar controles de videogame (como PlayStation, Xbox ou controles genéricos) no seu navegador.

### 🚀 Passo 1: Criando a Base HTML
Primeiro, vamos criar um arquivo HTML básico. Salve como index.html:

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎮 Meu Primeiro Jogo com Controle</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
            text-align: center;
        }
        canvas {
            border: 3px solid #333;
            background-color: white;
            border-radius: 10px;
        }
        .info {
            margin-top: 20px;
            padding: 15px;
            background-color: #e8f4f8;
            border-radius: 8px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <h1>🎮 Controle o Quadrado Verde!</h1>
    <canvas id="meuCanvas" width="800" height="600"></canvas>
    
    <div class="info">
        <p><strong>Como usar:</strong></p>
        <p>1. Conecte seu controle no computador</p>
        <p>2. Use o analógico esquerdo para mover o quadrado</p>
        <p>3. Pressione qualquer botão para mudar a cor!</p>
    </div>
    
    <script src="jogo.js"></script>
</body>
</html>
```

### 🎨 Passo 2: Configurando o Canvas
Agora vamos criar o arquivo jogo.js com o código JavaScript:

```javascript
// 🎯 Pegando o canvas e configurando
const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

// 📦 Criando nosso quadrado (jogador)
const jogador = {
    x: 400,        // posição horizontal (meio da tela)
    y: 300,        // posição vertical (meio da tela)
    largura: 60,   // tamanho do quadrado
    altura: 60,
    cor: 'green',  // cor inicial
    velocidade: 5  // velocidade de movimento
};

// 🎨 Função para desenhar o quadrado na tela
function desenharQuadrado() {
    // Limpar a tela inteira
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar o quadrado
    ctx.fillStyle = jogador.cor;
    ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
    
    // Adicionar uma bordinha legal
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
}

// Desenhar o quadrado pela primeira vez
desenharQuadrado();
```

## 🎮 Passo 3: Detectando o Controle
Vamos adicionar código para detectar quando um controle é conectado:

```javascript
// 🔌 Quando um controle é conectado
window.addEventListener("gamepadconnected", (evento) => {
    console.log("🎮 Controle conectado:", evento.gamepad.id);
    alert("🎉 Controle conectado! Use o analógico esquerdo para mover.");
    
    // Começar a verificar os comandos do controle
    verificarControle();
});

// 🔌 Quando um controle é desconectado
window.addEventListener("gamepaddisconnected", (evento) => {
    console.log("❌ Controle desconectado:", evento.gamepad.id);
    alert("😢 Controle desconectado!");
});
```

## 🕹️ Passo 4: Lendo os Comandos do Controle
Agora a parte mais legal - fazer o quadrado se mover com o controle:

```javascript
// 🎯 Função que verifica o que está sendo pressionado no controle
function verificarControle() {
    // Pegar todos os controles conectados
    const controles = navigator.getGamepads();
    
    // Verificar cada controle
    for (let i = 0; i < controles.length; i++) {
        const controle = controles[i];
        
        if (controle) {
            // 🕹️ ANALÓGICOS (para movimento)
            // axes[0] = analógico esquerdo horizontal (-1 a 1)
            // axes[1] = analógico esquerdo vertical (-1 a 1)
            const movimentoX = controle.axes[0] * jogador.velocidade;
            const movimentoY = controle.axes[1] * jogador.velocidade;
            
            // Mover o jogador (só se estiver dentro da tela)
            if (jogador.x + movimentoX >= 0 && 
                jogador.x + movimentoX <= canvas.width - jogador.largura) {
                jogador.x += movimentoX;
            }
            
            if (jogador.y + movimentoY >= 0 && 
                jogador.y + movimentoY <= canvas.height - jogador.altura) {
                jogador.y += movimentoY;
            }
            
            // 🎨 BOTÕES (para mudar cor)
            // Verificar se algum botão foi pressionado
            for (let j = 0; j < controle.buttons.length; j++) {
                if (controle.buttons[j].pressed) {
                    mudarCor();
                    break; // Sair do loop quando encontrar um botão pressionado
                }
            }
            
            // Redesenhar o quadrado na nova posição
            desenharQuadrado();
        }
    }
    
    // 🔄 Repetir esta função no próximo frame (60x por segundo)
    requestAnimationFrame(verificarControle);
}

// 🌈 Função para mudar a cor do quadrado
function mudarCor() {
    const cores = ['green', 'red', 'blue', 'yellow', 'purple', 'orange', 'pink'];
    const corAtual = cores.indexOf(jogador.cor);
    const proximaCor = (corAtual + 1) % cores.length;
    jogador.cor = cores[proximaCor];
}
```

## 🔧 Código Completo Final
Aqui está o arquivo jogo.js completo:

```javascript
// 🎯 Configuração inicial
const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

// 📦 Nosso jogador (quadrado)
const jogador = {
    x: 400,
    y: 300,
    largura: 60,
    altura: 60,
    cor: 'green',
    velocidade: 5
};

// 🎨 Função para desenhar
function desenharQuadrado() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = jogador.cor;
    ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
}

// 🌈 Função para mudar cor
function mudarCor() {
    const cores = ['green', 'red', 'blue', 'yellow', 'purple', 'orange', 'pink'];
    const corAtual = cores.indexOf(jogador.cor);
    const proximaCor = (corAtual + 1) % cores.length;
    jogador.cor = cores[proximaCor];
}

// 🎮 Eventos do controle
window.addEventListener("gamepadconnected", (evento) => {
    console.log("🎮 Controle conectado:", evento.gamepad.id);
    alert("🎉 Controle conectado! Use o analógico esquerdo para mover.");
    verificarControle();
});

window.addEventListener("gamepaddisconnected", (evento) => {
    console.log("❌ Controle desconectado:", evento.gamepad.id);
    alert("😢 Controle desconectado!");
});

// 🕹️ Função principal do jogo
function verificarControle() {
    const controles = navigator.getGamepads();
    
    for (let i = 0; i < controles.length; i++) {
        const controle = controles[i];
        
        if (controle) {
            // Movimento com analógico
            const movimentoX = controle.axes[0] * jogador.velocidade;
            const movimentoY = controle.axes[1] * jogador.velocidade;
            
            // Verificar limites da tela
            if (jogador.x + movimentoX >= 0 && 
                jogador.x + movimentoX <= canvas.width - jogador.largura) {
                jogador.x += movimentoX;
            }
            
            if (jogador.y + movimentoY >= 0 && 
                jogador.y + movimentoY <= canvas.height - jogador.altura) {
                jogador.y += movimentoY;
            }
            
            // Verificar botões
            for (let j = 0; j < controle.buttons.length; j++) {
                if (controle.buttons[j].pressed) {
                    mudarCor();
                    break;
                }
            }
            
            desenharQuadrado();
        }
    }
    
    requestAnimationFrame(verificarControle);
}

// Desenhar pela primeira vez
desenharQuadrado();
```

# 🎓 Conceitos Importantes que Você Aprendeu
1. Canvas Context
- ctx.fillRect(): desenha um retângulo preenchido
- ctx.clearRect(): limpa uma área da tela
- ctx.strokeRect(): desenha apenas a borda do retângulo
2. Gamepad API
- navigator.getGamepads(): pega todos os controles conectados
- controle.axes[]: valores dos analógicos (-1 a 1)
- controle.buttons[]: estado dos botões (pressed = true/false)
3. Eventos JavaScript
- gamepadconnected: quando um controle é conectado
- gamepaddisconnected: quando um controle é desconectado
4. Animação
- requestAnimationFrame(): cria animações suaves (60 FPS)

# 🚀 Próximos Passos - Desafios para Você!
1. Adicione obstáculos no canvas que o quadrado não pode atravessar
1. Crie um segundo jogador com outro controle
1. Adicione sons quando o quadrado se move ou muda de cor
1. Faça o quadrado deixar um rastro colorido por onde passa
1. Adicione um placar que conta quantas vezes a cor mudou

# 🔍 Recursos Úteis
- Documentação Canvas API
- Documentação Gamepad API
- Como testar sem controle físico

# ❓ Dúvidas Comuns
**Q:** E se eu não tiver um controle? R: Você pode usar extensões do navegador que simulam controles ou adicionar controle por teclado!

**Q:** Por que meu controle não funciona? R: Certifique-se de que está usando um navegador moderno (Chrome, Firefox, Edge) e que o controle está conectado antes de abrir a página.

**Q:** Como faço o quadrado se mover mais rápido? R: Aumente o valor da propriedade velocidade no objeto jogador.

*Agora é só conectar seu controle e se divertir! 🎮✨*

