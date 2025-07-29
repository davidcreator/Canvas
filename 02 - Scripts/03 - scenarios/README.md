# 🎮 Sistema de Criação de Cenários em Jogos com JavaScript Canvas
## Bem-vindos, jovens programadores! 👋

Este projeto vai te ensinar como criar cenários incríveis para jogos usando apenas código JavaScript e o elemento canvas do HTML5. O mais legal é que não precisamos de imagens prontas - vamos desenhar tudo do zero usando formas básicas como retângulos, círculos e linhas!

## 🎯 O que você vai aprender?
- Como usar o elemento Canvas do HTML5
- Como desenhar formas básicas com JavaScript
- Como criar um cenário simples para jogos
- Como organizar seu código de forma limpa

### 🛠️ Tecnologias que vamos usar
- HTML5: Para estruturar nossa página
- CSS3: Para deixar tudo bonito
- JavaScript: Para fazer a mágica acontecer!

### 📁 Como organizar seus arquivos
Antes de começar, vamos organizar nosso projeto. Crie as pastas assim:

    MeuJogo/
    │
    ├── index.html          (arquivo principal)
    ├── css/
    │   └── style.css      (estilos da página)
    └── js/
        └── script.js      (código JavaScript)

💡 Dica: Sempre organize seus arquivos em pastas. Isso facilita muito quando o projeto cresce!

# 📄 Arquivo index.html
Este é o arquivo principal do nosso projeto. Ele cria a estrutura básica da página:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Primeiro Cenário de Jogo</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h1>🎮 Meu Cenário de Jogo</h1>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <script src="js/script.js"></script>
</body>
</html>
```

## 🔍 Entendendo o código HTML:
<canvas>: É como uma "tela em branco" onde vamos desenhar
width="800" e height="600": Define o tamanho da nossa tela (800px de largura por 600px de altura)
id="gameCanvas": Um nome único para identificar nosso canvas no JavaScript

# 🎨 Arquivo style.css
Este arquivo deixa nossa página bonita e organizada:

```css
body {
    margin: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Arial', sans-serif;
}

h1 {
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    margin-bottom: 20px;
    font-size: 2em;
}

canvas {
    border: 3px solid #333;
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
    background-color: white;
}

/* Efeito hover no canvas */
canvas:hover {
    transform: scale(1.02);
    transition: transform 0.3s ease;
}
```

## 🔍 Entendendo o CSS:
background: linear-gradient(): Cria um fundo degradê colorido
border-radius: 10px: Deixa as bordas do canvas arredondadas
box-shadow: Adiciona uma sombra bonita
:hover: Efeito quando o mouse passa por cima

# 💻 Arquivo script.js
Aqui está a mágica! Este arquivo contém todo o código para desenhar nosso cenário:

```javascript
// Pegamos o elemento canvas da página
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Função para desenhar o fundo (céu e chão)
function drawBackground() {
    console.log('🎨 Desenhando o fundo...');
    
    // Céu azul claro
    context.fillStyle = '#87CEEB'; // Cor azul céu
    context.fillRect(0, 0, canvas.width, canvas.height / 2);

    // Chão verde
    context.fillStyle = '#228B22'; // Cor verde floresta
    context.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);
    
    // Adicionando algumas nuvens simples
    drawClouds();
}

// Função para desenhar nuvens
function drawClouds() {
    context.fillStyle = '#FFFFFF'; // Branco para as nuvens
    
    // Nuvem 1
    context.beginPath();
    context.arc(150, 100, 30, 0, Math.PI * 2);
    context.arc(180, 100, 40, 0, Math.PI * 2);
    context.arc(210, 100, 30, 0, Math.PI * 2);
    context.fill();
    
    // Nuvem 2  
    context.beginPath();
    context.arc(600, 80, 25, 0, Math.PI * 2);
    context.arc(625, 80, 35, 0, Math.PI * 2);
    context.arc(650, 80, 25, 0, Math.PI * 2);
    context.fill();
}

// Função para desenhar árvores
function drawTrees() {
    console.log('🌳 Desenhando as árvores...');
    
    // Árvore 1 (maior)
    // Tronco
    context.fillStyle = '#8B4513'; // Marrom para o tronco
    context.fillRect(100, 300, 20, 100);
    
    // Copa da árvore
    context.fillStyle = '#006400'; // Verde escuro
    context.beginPath();
    context.arc(110, 280, 40, 0, Math.PI * 2);
    context.fill();

    // Árvore 2 (menor)
    // Tronco
    context.fillStyle = '#8B4513';
    context.fillRect(400, 320, 20, 80);
    
    // Copa da árvore
    context.fillStyle = '#228B22'; // Verde mais claro
    context.beginPath();
    context.arc(410, 300, 35, 0, Math.PI * 2);
    context.fill();
    
    // Árvore 3 (no fundo)
    context.fillStyle = '#654321';
    context.fillRect(650, 310, 15, 90);
    context.fillStyle = '#006400';
    context.beginPath();
    context.arc(657, 295, 30, 0, Math.PI * 2);
    context.fill();
}

// Função para desenhar o sol
function drawSun() {
    console.log('☀️ Desenhando o sol...');
    
    context.fillStyle = '#FFD700'; // Amarelo dourado
    context.beginPath();
    context.arc(700, 100, 50, 0, Math.PI * 2);
    context.fill();
    
    // Raios do sol
    context.strokeStyle = '#FFD700';
    context.lineWidth = 3;
    
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const x1 = 700 + Math.cos(angle) * 60;
        const y1 = 100 + Math.sin(angle) * 60;
        const x2 = 700 + Math.cos(angle) * 80;
        const y2 = 100 + Math.sin(angle) * 80;
        
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }
}

// Função principal que desenha tudo
function draw() {
    console.log('🚀 Começando a desenhar o cenário...');
    
    // Limpa o canvas antes de desenhar
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha cada elemento na ordem correta
    drawBackground();  // Primeiro o fundo
    drawSun();        // Depois o sol
    drawTrees();      // Por último as árvores
    
    console.log('✅ Cenário completo!');
}

// Chama a função para desenhar tudo
draw();

// Bonus: Redesenha o cenário a cada 5 segundos com pequenas variações
setInterval(() => {
    draw();
    console.log('🔄 Cenário atualizado!');
}, 5000);
```

## 🔍 Entendendo o JavaScript:
**Conceitos importantes:**
- Canvas Context: É como um "pincel" que usamos para desenhar
- fillStyle: Define a cor que vamos usar
- fillRect(): Desenha um retângulo preenchido
- arc(): Desenha um círculo
- beginPath(): Começa um novo "desenho"

**Funções criadas:**
- drawBackground(): Desenha o céu, chão e nuvens
- drawTrees(): Desenha as árvores
- drawSun(): Desenha o sol com raios
- draw(): Função principal que chama todas as outras

# 🚀 Como executar o projeto
1. Crie uma pasta no seu computador com o nome "MeuJogo"
1. Crie os arquivos index.html, css/style.css e js/script.js
1. Copie o código de cada seção para o arquivo correspondente
1. Abra o arquivo index.html no seu navegador
1. Veja a mágica acontecer! 🎉

# 🎯 Desafios para você tentar
Agora que você entendeu o básico, que tal tentar estas melhorias?

## 🌟 Nível Iniciante:
- Mude as cores do céu e do chão
- Adicione mais árvores
- Desenhe uma casa simples usando retângulos

## 🌟 Nível Intermediário:
- Adicione montanhas no fundo
- Desenhe um rio usando linhas curvas
- Crie flores no chão usando círculos pequenos

## 🌟 Nível Avançado:
- Faça o sol se mover pelo céu
- Adicione animação nas nuvens
- Crie um ciclo dia/noite

## 🤝 Dicas importantes
- Sempre teste seu código: Abra o arquivo no navegador após cada mudança
- Use o console: Pressione F12 no navegador para ver as mensagens de debug
- Experimente: Mude números e cores para ver o que acontece
- Organize seu código: Use comentários para explicar o que cada parte faz

# 🐛 Problemas comuns e soluções
**"Meu canvas não aparece"**
Verifique se o arquivo CSS está carregando corretamente
Confirme se o ID do canvas está correto

**"Nada está sendo desenhado"**
Verifique se o arquivo JavaScript está carregando
Abra o console (F12) para ver se há erros

**"As cores não estão aparecendo"**
Confirme se você está usando códigos de cor válidos
Lembre-se de chamar context.fill() após desenhar formas

# 📚 Quer aprender mais?
- MDN Canvas Tutorial
- W3Schools Canvas Reference
- Experimente criar outros cenários: espaço, fundo do mar, cidade!

# 🎉 Conclusão
Parabéns! Você acabou de criar seu primeiro cenário de jogo usando apenas código. Isso é apenas o começo - com canvas e JavaScript, você pode criar jogos incríveis, animações e arte interativa.

*Continue praticando, experimentando e, principalmente, se divertindo! 🚀*

Lembre-se: Todo programador começou com projetos simples como este. O importante é continuar aprendendo e criando coisas novas!

# 📄 Licença
Este projeto é licenciado sob a MIT License - sinta-se livre para usar, modificar e compartilhar!