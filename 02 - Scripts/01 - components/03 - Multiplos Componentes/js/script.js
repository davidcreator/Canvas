 // ====================================
        // 🎮 SISTEMA DE JOGO CANVAS
        // ====================================
        
        // === VARIÁVEIS GLOBAIS ===
        // Estas variáveis armazenam nossas peças do jogo
        let pecaVermelha;    // Peça 1: vermelha
        let pecaAzul;        // Peça 2: azul  
        let pecaVerde;       // Peça 3: verde
        let pecaAmarela;     // Peça 4: amarela
        
        // === CONFIGURAÇÕES DO JOGO ===
        const LARGURA_CANVAS = 480;  // Largura da área de jogo
        const ALTURA_CANVAS = 270;   // Altura da área de jogo
        const FPS = 50; // Frames por segundo (1000ms / 20ms = 50 FPS)
        
        // ====================================
        // 🏗️ SISTEMA DE ÁREA DE JOGO
        // ====================================
        const areaDoJogo = {
            // Propriedades da área de jogo
            canvas: null,
            contexto: null,
            intervalo: null,
            
            /**
             * Inicializa a área de jogo
             * Cria o canvas, define suas dimensões e inicia o loop de jogo
             */
            iniciar: function() {
                console.log("🚀 Iniciando área de jogo...");
                
                // Cria um novo elemento canvas
                this.canvas = document.createElement("canvas");
                this.canvas.width = LARGURA_CANVAS;
                this.canvas.height = ALTURA_CANVAS;
                
                // Obtém o contexto 2D para desenhar
                this.contexto = this.canvas.getContext("2d");
                
                // Adiciona o canvas ao documento
                document.querySelector('.container').appendChild(this.canvas);
                
                // Inicia o loop de jogo (atualiza a cada 20ms = 50 FPS)
                this.intervalo = setInterval(atualizarJogo, 1000 / FPS);
                
                console.log("✅ Área de jogo inicializada!");
            },
            
            /**
             * Limpa toda a área do canvas
             * Remove todos os desenhos anteriores
             */
            limpar: function() {
                this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        };
        
        // ====================================
        // 🧩 CLASSE COMPONENTE (PEÇA DO JOGO)
        // ====================================
        
        /**
         * Construtor para criar uma peça do jogo
         * @param {number} largura - Largura da peça em pixels
         * @param {number} altura - Altura da peça em pixels  
         * @param {string} cor - Cor da peça (nome ou código hex)
         * @param {number} posicaoX - Posição inicial no eixo X
         * @param {number} posicaoY - Posição inicial no eixo Y
         */
        function Componente(largura, altura, cor, posicaoX, posicaoY) {
            // === PROPRIEDADES DA PEÇA ===
            this.largura = largura;
            this.altura = altura;
            this.cor = cor;
            this.x = posicaoX;
            this.y = posicaoY;
            
            /**
             * Desenha esta peça no canvas
             * Usa o contexto 2D para desenhar um retângulo colorido
             */
            this.desenhar = function() {
                const ctx = areaDoJogo.contexto;
                
                // Define a cor de preenchimento
                ctx.fillStyle = this.cor;
                
                // Desenha o retângulo na posição especificada
                ctx.fillRect(this.x, this.y, this.largura, this.altura);
            };
            
            /**
             * Atualiza esta peça (por enquanto só desenha)
             * Em jogos mais complexos, aqui calcularia movimento, colisões, etc.
             */
            this.atualizar = function() {
                this.desenhar();
            };
        }
        
        // ====================================
        // 🎯 FUNÇÕES PRINCIPAIS DO JOGO
        // ====================================
        
        /**
         * Inicializa o jogo
         * Cria a área de jogo e todas as peças
         */
        function iniciarJogo() {
            console.log("🎮 Iniciando jogo...");
            
            // Inicializa a área de jogo
            areaDoJogo.iniciar();
            
            // === CRIAÇÃO DAS PEÇAS ===
            // Cada peça tem: largura, altura, cor, posição X, posição Y
            
            pecaVermelha = new Componente(30, 30, "red", 10, 120);
            console.log("🔴 Peça vermelha criada: 30x30 na posição (10, 120)");
            
            pecaAzul = new Componente(50, 50, "blue", 300, 150);  
            console.log("🔵 Peça azul criada: 50x50 na posição (300, 150)");
            
            pecaVerde = new Componente(20, 20, "green", 50, 50);
            console.log("🟢 Peça verde criada: 20x20 na posição (50, 50)");
            
            pecaAmarela = new Componente(40, 40, "yellow", 200, 100);
            console.log("🟡 Peça amarela criada: 40x40 na posição (200, 100)");
            
            console.log("✅ Jogo iniciado com sucesso! 4 peças criadas.");
        }
        
        /**
         * Atualiza o jogo a cada frame
         * Esta função é chamada 50 vezes por segundo
         */
        function atualizarJogo() {
            // 1. Limpa a tela (remove desenhos anteriores)
            areaDoJogo.limpar();
            
            // 2. Atualiza e desenha todas as peças
            pecaVermelha.atualizar();
            pecaAzul.atualizar();
            pecaVerde.atualizar();
            pecaAmarela.atualizar();
        }
        
        // ====================================
        // 🚀 INICIALIZAÇÃO AUTOMÁTICA
        // ====================================
        
        // Quando a página terminar de carregar, inicia o jogo
        window.addEventListener('load', iniciarJogo);
        
        console.log("📝 Script carregado! Aguardando página carregar...");