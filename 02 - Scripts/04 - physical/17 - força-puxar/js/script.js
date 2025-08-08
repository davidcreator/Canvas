/* ==============================================
    SIMULAÇÃO FÍSICA - CÓDIGO JAVASCRIPT
    ============================================== */

// 1. CONFIGURAÇÃO INICIAL DO CANVAS
// ================================
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define o tamanho do canvas responsivo
canvas.width = Math.min(window.innerWidth * 0.8, 800);
canvas.height = Math.min(window.innerHeight * 0.7, 500);

// Elementos do painel de informações
const stateElement = document.getElementById('state');
const velocityElement = document.getElementById('velocity');
const positionElement = document.getElementById('position');
const deformationElement = document.getElementById('deformation');

// 2. OBJETO BOLA - PROPRIEDADES FÍSICAS
// ====================================
const bola = {
    // Posição inicial (centro superior do canvas)
    x: canvas.width / 2,
    y: 60,
    
    // Propriedades visuais (proporcionais ao canvas)
    raio: Math.min(canvas.width, canvas.height) * 0.04, // raio proporcional
    cor: '#0095DD',
    
    // Propriedades físicas de movimento
    velocidadeX: 0,           // velocidade horizontal
    velocidadeY: 2,           // velocidade vertical inicial (para baixo)
    aceleracaoX: 0,           // aceleração horizontal
    aceleracaoY: 0,           // aceleração vertical
    
    // Propriedades físicas especiais
    gravidade: 0.25,          // força da gravidade
    coeficienteRestituicao: 0.75, // quanto da velocidade é mantida após colisão
    atrito: 0.995,            // resistência do ar
    
    // Controle de colisões
    noChao: false,            // indica se está tocando o chão
    tempoUltimaColisao: 0,    // evita colisões múltiplas
    tempoParado: 0,           // conta frames parado
    energiaMinima: 0.05,      // energia mínima para movimento
    
    // Estado e deformação
    estado: 'caindo',         // estado atual do movimento
    deformacao: 1.0           // fator de deformação visual (1.0 = normal)
};

// 3. FUNÇÃO DE DESENHO - RENDERIZAÇÃO
// ==================================
function desenharBola() {
    // Limpa o canvas inteiro
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configura o estilo de desenho
    ctx.fillStyle = bola.cor;
    ctx.beginPath();
    
    // Desenha uma elipse para simular deformação
    // (raio horizontal varia com a deformação, raio vertical mantém)
    ctx.ellipse(
        bola.x,                           // posição X
        bola.y,                           // posição Y
        bola.raio * bola.deformacao,      // raio horizontal (deformado)
        bola.raio,                        // raio vertical (normal)
        0,                                // rotação
        0,                                // ângulo inicial
        Math.PI * 2                       // ângulo final (círculo completo)
    );
    
    ctx.fill();
    ctx.closePath();
    
    // Adiciona brilho na bola
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.ellipse(
        bola.x - 8, bola.y - 8, 
        8 * bola.deformacao, 8, 
        0, 0, Math.PI * 2
    );
    ctx.fill();
}

// 4. FUNÇÃO DE ATUALIZAÇÃO - FÍSICA
// ================================
function atualizarFisica() {
    // Incrementa contador de tempo para controle de colisões
    bola.tempoUltimaColisao++;
    
    // Calcula energia cinética total (horizontal + vertical)
    const energiaCinetica = Math.abs(bola.velocidadeX) + Math.abs(bola.velocidadeY);
    
    // FASE 1: Determinar o estado atual baseado no movimento
    // Verifica se deve parar definitivamente
    if (bola.noChao && energiaCinetica < bola.energiaMinima) {
        bola.tempoParado++;
        if (bola.tempoParado > 30) { // 30 frames = 0.5 segundos a 60fps
            bola.estado = 'parado';
            bola.velocidadeX = 0;
            bola.velocidadeY = 0;
            bola.aceleracaoX = 0;
            bola.aceleracaoY = 0;
        }
    } else {
        bola.tempoParado = 0; // reset contador se voltou a se mover
        
        if (bola.velocidadeY > 0.1) {
            bola.estado = 'caindo';
            bola.noChao = false;
        } else if (bola.velocidadeY < -0.1) {
            bola.estado = 'subindo';
            bola.noChao = false;
        } else if (bola.noChao) {
            bola.estado = 'deslizando';
        }
    }
    
    // FASE 2: Aplicar efeitos visuais baseados no estado
    switch (bola.estado) {
        case 'caindo':
            bola.deformacao = Math.min(1.3, 1 + Math.abs(bola.velocidadeY) * 0.1);
            bola.aceleracaoY = bola.gravidade;
            break;
            
        case 'subindo':
            bola.deformacao = Math.max(0.7, 1 - Math.abs(bola.velocidadeY) * 0.1);
            bola.aceleracaoY = bola.gravidade;
            break;
            
        case 'deslizando':
            bola.deformacao = 1.1; // levemente achatada
            bola.aceleracaoY = 0;
            // Aplica atrito forte no chão
            bola.velocidadeX *= 0.92;
            break;
            
        case 'colidindo':
            bola.deformacao = 1.6;
            bola.aceleracaoY = 0;
            break;
            
        case 'parado':
            bola.deformacao = 1.0; // forma normal quando parado
            bola.aceleracaoY = 0;
            bola.aceleracaoX = 0;
            bola.velocidadeY = 0;
            bola.velocidadeX = 0;
            return; // sai da função - não processa mais física
            
        default:
            bola.deformacao = 1.0;
            bola.aceleracaoY = bola.gravidade;
    }
    
    // FASE 3: Aplicar as leis da física
    // Atualiza velocidade baseada na aceleração
    bola.velocidadeY += bola.aceleracaoY;
    bola.velocidadeX += bola.aceleracaoX;
    
    // Aplica resistência do ar (apenas se não estiver parado)
    bola.velocidadeY *= bola.atrito;
    bola.velocidadeX *= bola.atrito;
    
    // Para velocidades muito pequenas para evitar vibração
    if (Math.abs(bola.velocidadeX) < 0.01) bola.velocidadeX = 0;
    if (Math.abs(bola.velocidadeY) < 0.01 && bola.noChao) bola.velocidadeY = 0;
    
    // Atualiza posição baseada na velocidade
    bola.x += bola.velocidadeX;
    bola.y += bola.velocidadeY;
    
    // FASE 4: Verificar colisões (com proteção contra loops infinitos)
    let colidiu = false;
    
    // Colisão com o chão
    if (bola.y + bola.raio >= canvas.height && bola.tempoUltimaColisao > 3) {
        bola.y = canvas.height - bola.raio;
        bola.noChao = true;
        
        // Se a velocidade for muito pequena, não quica mais
        if (Math.abs(bola.velocidadeY) < 0.3) {
            bola.velocidadeY = 0;
        } else {
            bola.velocidadeY = -Math.abs(bola.velocidadeY) * bola.coeficienteRestituicao;
            bola.estado = 'colidindo';
            bola.tempoUltimaColisao = 0;
            colidiu = true;
        }
        
        // Adiciona movimento horizontal pequeno apenas se ainda tem energia
        if (colidiu && Math.abs(bola.velocidadeX) < 0.5 && energiaCinetica > bola.energiaMinima) {
            bola.velocidadeX += (Math.random() - 0.5) * 0.2;
        }
    } else {
        bola.noChao = false;
    }
    
    // Colisão com o teto
    if (bola.y - bola.raio <= 0 && bola.tempoUltimaColisao > 3) {
        bola.y = bola.raio;
        bola.velocidadeY = Math.abs(bola.velocidadeY) * bola.coeficienteRestituicao;
        bola.tempoUltimaColisao = 0;
    }
    
    // Colisões com as paredes laterais
    if (bola.x - bola.raio <= 0 && bola.tempoUltimaColisao > 3) {
        bola.x = bola.raio;
        bola.velocidadeX = Math.abs(bola.velocidadeX) * bola.coeficienteRestituicao;
        bola.tempoUltimaColisao = 0;
    }
    if (bola.x + bola.raio >= canvas.width && bola.tempoUltimaColisao > 3) {
        bola.x = canvas.width - bola.raio;
        bola.velocidadeX = -Math.abs(bola.velocidadeX) * bola.coeficienteRestituicao;
        bola.tempoUltimaColisao = 0;
    }
}

// 5. FUNÇÃO DE ATUALIZAÇÃO DO PAINEL
// =================================
function atualizarPainel() {
    const energiaTotal = Math.abs(bola.velocidadeX) + Math.abs(bola.velocidadeY);
    
    stateElement.textContent = bola.estado;
    velocityElement.textContent = bola.velocidadeY.toFixed(2);
    positionElement.textContent = Math.round(bola.y);
    deformationElement.textContent = bola.deformacao.toFixed(2);
    
    // Muda cor do painel baseado no estado
    if (bola.estado === 'parado') {
        stateElement.style.color = '#dc3545'; // vermelho quando parado
    } else if (energiaTotal < bola.energiaMinima * 2) {
        stateElement.style.color = '#ffc107'; // amarelo quando perdendo energia
    } else {
        stateElement.style.color = '#0095DD'; // azul quando ativo
    }
}

// 6. FUNÇÃO PRINCIPAL DE ANIMAÇÃO
// ==============================
function animar() {
    // Executa as três funções principais
    desenharBola();      // 1. Desenha a bola na tela
    atualizarFisica();   // 2. Calcula a nova posição e estado
    atualizarPainel();   // 3. Atualiza as informações na tela
    
    // Agenda a próxima execução (60fps)
    requestAnimationFrame(animar);
}

// Adiciona responsividade para redimensionamento da janela
window.addEventListener('resize', function() {
    const novaLargura = Math.min(window.innerWidth * 0.8, 800);
    const novaAltura = Math.min(window.innerHeight * 0.7, 500);
    
    // Ajusta proporcionalmente a posição da bola
    const proporcaoX = bola.x / canvas.width;
    const proporcaoY = bola.y / canvas.height;
    
    canvas.width = novaLargura;
    canvas.height = novaAltura;
    
    // Recalcula o raio proporcionalmente
    bola.raio = Math.min(canvas.width, canvas.height) * 0.04;
    
    // Reposiciona a bola mantendo a proporção
    bola.x = proporcaoX * canvas.width;
    bola.y = proporcaoY * canvas.height;
});

// 7. INICIALIZAÇÃO
// ===============
// Inicia a animação quando a página carrega
animar();

// Reinicia a simulação quando clicado no canvas
canvas.addEventListener('click', function(evento) {
    // Obtém a posição do clique relativa ao canvas
    const rect = canvas.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;
    
    // Posiciona a bola onde foi clicado (com margem de segurança)
    bola.x = Math.max(bola.raio, Math.min(x, canvas.width - bola.raio));
    bola.y = Math.max(bola.raio, Math.min(y, canvas.height - bola.raio));
    bola.velocidadeY = 1;
    bola.velocidadeX = (Math.random() - 0.5) * 2;
    bola.noChao = false;
    bola.tempoUltimaColisao = 10; // reset do timer de colisão
    bola.tempoParado = 0; // reset contador parado
});