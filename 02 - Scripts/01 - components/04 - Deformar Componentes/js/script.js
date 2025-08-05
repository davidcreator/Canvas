// ===== VARIÁVEIS GLOBAIS =====
        var minhasFormas = []; // Array que guarda todas as formas do jogo
        var areaDoJogo; // Objeto que controla o canvas e o jogo

        // ===== FUNÇÃO PRINCIPAL - INICIA O JOGO =====
        function iniciarJogo() {
            console.log("🚀 Iniciando o jogo...");
            
            // 1. Primeiro, criamos a área do jogo (canvas)
            areaDoJogo = new AreaJogo();
            areaDoJogo.inicializar();
            
            // 2. Depois, criamos as formas coloridas
            criarFormasColoridas();
            
            console.log("✅ Jogo iniciado com sucesso!");
        }

        // ===== CLASSE PARA CONTROLAR A ÁREA DO JOGO =====
        function AreaJogo() {
            // Propriedades da área do jogo
            this.canvas = null;
            this.contexto = null;
            this.largura = 600;
            this.altura = 400;
            
            // Método para inicializar o canvas
            this.inicializar = function() {
                console.log("🎨 Criando o canvas...");
                
                // Cria o elemento canvas
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.largura;
                this.canvas.height = this.altura;
                
                // Obtém o contexto 2D (ferramenta para desenhar)
                this.contexto = this.canvas.getContext("2d");
                
                // Adiciona o canvas na página
                document.body.appendChild(this.canvas);
                
                // Inicia o loop de atualização (60 FPS aproximadamente)
                this.intervalo = setInterval(atualizarJogo, 16);
            };
            
            // Método para limpar o canvas (apagar tudo)
            this.limpar = function() {
                this.contexto.clearRect(0, 0, this.largura, this.altura);
            };
        }

        // ===== CLASSE PARA CRIAR FORMAS/COMPONENTES =====
        function Forma(largura, altura, cor, posicaoX, posicaoY) {
            // Propriedades da forma
            this.largura = largura;
            this.altura = altura;
            this.cor = cor;
            this.x = posicaoX;
            this.y = posicaoY;
            
            // Método para desenhar a forma na tela
            this.desenhar = function() {
                var ctx = areaDoJogo.contexto;
                
                // Define a cor de preenchimento
                ctx.fillStyle = this.cor;
                
                // Desenha um retângulo preenchido
                ctx.fillRect(this.x, this.y, this.largura, this.altura);
                
                // Adiciona uma borda preta
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 1;
                ctx.strokeRect(this.x, this.y, this.largura, this.altura);
            };
        }

        // ===== FUNÇÃO PARA CRIAR TODAS AS FORMAS =====
        function criarFormasColoridas() {
            console.log("🌈 Criando formas coloridas...");
            
            // Array com diferentes cores
            var cores = ["red", "blue", "green", "yellow", "purple", 
                        "orange", "pink", "brown", "cyan", "magenta"];
            
            // Cria 10 formas com propriedades variadas
            for (var i = 0; i < 10; i++) {
                var largura = 20 + Math.random() * 60; // Largura aleatória entre 20 e 80
                var altura = 20 + Math.random() * 60;  // Altura aleatória entre 20 e 80
                var cor = cores[i];
                var x = Math.random() * (areaDoJogo.largura - largura);  // Posição X aleatória
                var y = Math.random() * (areaDoJogo.altura - altura);   // Posição Y aleatória
                
                // Cria uma nova forma e adiciona ao array
                var novaForma = new Forma(largura, altura, cor, x, y);
                minhasFormas.push(novaForma);
                
                console.log(`Forma ${i + 1}: ${cor} (${largura}x${altura}) na posição (${x.toFixed(1)}, ${y.toFixed(1)})`);
            }
        }

        // ===== LOOP PRINCIPAL DO JOGO =====
        function atualizarJogo() {
            // 1. Limpa a tela
            areaDoJogo.limpar();
            
            // 2. Desenha todas as formas
            minhasFormas.forEach(function(forma, indice) {
                forma.desenhar();
            });
            
            // Aqui poderíamos adicionar:
            // - Movimentação das formas
            // - Detecção de colisões
            // - Controles do jogador
            // - Pontuação
            // etc.
        }

        // ===== INICIA O JOGO QUANDO A PÁGINA CARREGAR =====
        window.onload = function() {
            iniciarJogo();
        };

        // ===== FUNÇÃO PARA ADICIONAR MAIS FORMAS (BÔNUS) =====
        function adicionarFormaAleatoria() {
            var cores = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "cyan", "magenta"];
            var corAleatoria = cores[Math.floor(Math.random() * cores.length)];
            var largura = 20 + Math.random() * 60;
            var altura = 20 + Math.random() * 60;
            var x = Math.random() * (areaDoJogo.largura - largura);
            var y = Math.random() * (areaDoJogo.altura - altura);
            
            var novaForma = new Forma(largura, altura, corAleatoria, x, y);
            minhasFormas.push(novaForma);
            
            console.log("➕ Nova forma adicionada!");
        }

        // Para testar: chame adicionarFormaAleatoria() no console do navegador!