// ===== VARIÁVEIS GLOBAIS =====
        var minhasFormas = []; // Array que guarda todas as formas do jogo
        var areaDoJogo; // Objeto que controla o canvas e o jogo

        // ===== TIPOS DE FORMAS DISPONÍVEIS =====
        var TIPOS_FORMA = {
            RETANGULO: 'retangulo',
            QUADRADO: 'quadrado',
            CIRCULO: 'circulo',
            ELIPSE: 'elipse',
            TRIANGULO: 'triangulo',
            ESTRELA: 'estrela',
            LINHA: 'linha',
            LOSANGO: 'losango'
        };

        // ===== FUNÇÃO PRINCIPAL - INICIA O JOGO =====
        function iniciarJogo() {
            console.log("🚀 Iniciando o sistema de formas primitivas...");
            
            // 1. Primeiro, criamos a área do jogo (canvas)
            areaDoJogo = new AreaJogo();
            areaDoJogo.inicializar();
            
            // 2. Depois, criamos uma coleção inicial de formas
            criarFormasIniciais();
            
            console.log("✅ Sistema iniciado com sucesso!");
        }

        // ===== CLASSE PARA CONTROLAR A ÁREA DO JOGO =====
        function AreaJogo() {
            // Propriedades da área do jogo
            this.canvas = null;
            this.contexto = null;
            this.largura = 800;
            this.altura = 500;
            
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
                this.intervalo = setInterval(atualizarJogo, 32);
            };
            
            // Método para limpar o canvas (apagar tudo)
            this.limpar = function() {
                this.contexto.clearRect(0, 0, this.largura, this.altura);
            };
        }

        // ===== CLASSE PRINCIPAL PARA CRIAR FORMAS =====
        function Forma(tipo, tamanho, cor, posicaoX, posicaoY, propriedades) {
            // Propriedades básicas da forma
            this.tipo = tipo;
            this.tamanho = tamanho;
            this.cor = cor;
            this.x = posicaoX;
            this.y = posicaoY;
            this.propriedades = propriedades || {};
            this.rotacao = 0;
            
            // Método principal para desenhar a forma
            this.desenhar = function() {
                var ctx = areaDoJogo.contexto;
                
                // Salva o estado atual do contexto
                ctx.save();
                
                // Move para a posição da forma
                ctx.translate(this.x, this.y);
                
                // Aplica rotação se necessário
                if (this.rotacao !== 0) {
                    ctx.rotate(this.rotacao);
                }
                
                // Define a cor
                ctx.fillStyle = this.cor;
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 2;
                
                // Chama o método de desenho específico para cada tipo
                switch(this.tipo) {
                    case TIPOS_FORMA.RETANGULO:
                        this.desenharRetangulo(ctx);
                        break;
                    case TIPOS_FORMA.QUADRADO:
                        this.desenharQuadrado(ctx);
                        break;
                    case TIPOS_FORMA.CIRCULO:
                        this.desenharCirculo(ctx);
                        break;
                    case TIPOS_FORMA.ELIPSE:
                        this.desenharElipse(ctx);
                        break;
                    case TIPOS_FORMA.TRIANGULO:
                        this.desenharTriangulo(ctx);
                        break;
                    case TIPOS_FORMA.ESTRELA:
                        this.desenharEstrela(ctx);
                        break;
                    case TIPOS_FORMA.LINHA:
                        this.desenharLinha(ctx);
                        break;
                    case TIPOS_FORMA.LOSANGO:
                        this.desenharLosango(ctx);
                        break;
                }
                
                // Restaura o estado do contexto
                ctx.restore();
            };
            
            // ===== MÉTODOS PARA DESENHAR CADA TIPO DE FORMA =====
            
            this.desenharRetangulo = function(ctx) {
                var largura = this.propriedades.largura || this.tamanho;
                var altura = this.propriedades.altura || this.tamanho * 0.6;
                
                ctx.fillRect(-largura/2, -altura/2, largura, altura);
                ctx.strokeRect(-largura/2, -altura/2, largura, altura);
            };
            
            this.desenharQuadrado = function(ctx) {
                ctx.fillRect(-this.tamanho/2, -this.tamanho/2, this.tamanho, this.tamanho);
                ctx.strokeRect(-this.tamanho/2, -this.tamanho/2, this.tamanho, this.tamanho);
            };
            
            this.desenharCirculo = function(ctx) {
                ctx.beginPath();
                ctx.arc(0, 0, this.tamanho/2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            };
            
            this.desenharElipse = function(ctx) {
                var raioX = this.tamanho/2;
                var raioY = (this.tamanho/2) * 0.6;
                
                ctx.beginPath();
                ctx.ellipse(0, 0, raioX, raioY, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            };
            
            this.desenharTriangulo = function(ctx) {
                var altura = this.tamanho * 0.866; // altura de um triângulo equilátero
                
                ctx.beginPath();
                ctx.moveTo(0, -altura/2); // topo
                ctx.lineTo(-this.tamanho/2, altura/2); // base esquerda
                ctx.lineTo(this.tamanho/2, altura/2); // base direita
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            };
            
            this.desenharEstrela = function(ctx) {
                var pontas = 5;
                var raioExterno = this.tamanho/2;
                var raioInterno = raioExterno * 0.4;
                
                ctx.beginPath();
                for (var i = 0; i < pontas * 2; i++) {
                    var raio = (i % 2 === 0) ? raioExterno : raioInterno;
                    var angulo = (i * Math.PI) / pontas;
                    var x = Math.cos(angulo) * raio;
                    var y = Math.sin(angulo) * raio;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            };
            
            this.desenharLinha = function(ctx) {
                var comprimento = this.tamanho;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(-comprimento/2, 0);
                ctx.lineTo(comprimento/2, 0);
                ctx.stroke();
            };
            
            this.desenharLosango = function(ctx) {
                ctx.beginPath();
                ctx.moveTo(0, -this.tamanho/2); // topo
                ctx.lineTo(this.tamanho/2, 0); // direita
                ctx.lineTo(0, this.tamanho/2); // baixo
                ctx.lineTo(-this.tamanho/2, 0); // esquerda
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            };
            
            // Método para atualizar a forma (pode incluir animação)
            this.atualizar = function() {
                // Pequena rotação contínua para algumas formas
                if (this.tipo === TIPOS_FORMA.ESTRELA || this.tipo === TIPOS_FORMA.LOSANGO) {
                    this.rotacao += 0.01;
                }
            };
        }

        // ===== FUNÇÃO PARA CRIAR FORMAS INICIAIS =====
        function criarFormasIniciais() {
            console.log("🌈 Criando formas iniciais...");
            
            var cores = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", 
                        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"];
            
            var tipos = Object.values(TIPOS_FORMA);
            
            // Cria uma forma de cada tipo
            for (var i = 0; i < tipos.length; i++) {
                var tipo = tipos[i];
                var tamanho = 40 + Math.random() * 40;
                var cor = cores[i % cores.length];
                var x = 100 + (i % 4) * 150;
                var y = 100 + Math.floor(i / 4) * 120;
                
                var propriedades = {};
                if (tipo === TIPOS_FORMA.RETANGULO) {
                    propriedades.largura = tamanho * 1.5;
                    propriedades.altura = tamanho * 0.8;
                }
                
                var novaForma = new Forma(tipo, tamanho, cor, x, y, propriedades);
                minhasFormas.push(novaForma);
                
                console.log(`Forma ${i + 1}: ${tipo} (${tamanho.toFixed(1)}) na posição (${x}, ${y})`);
            }
        }

        // ===== LOOP PRINCIPAL DO JOGO =====
        function atualizarJogo() {
            // 1. Limpa a tela
            areaDoJogo.limpar();
            
            // 2. Atualiza e desenha todas as formas
            minhasFormas.forEach(function(forma, indice) {
                forma.atualizar();
                forma.desenhar();
            });
        }

        // ===== FUNÇÕES PARA ADICIONAR FORMAS ESPECÍFICAS =====
        function adicionarFormaAleatoria() {
            var cores = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", 
                        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"];
            var tipos = Object.values(TIPOS_FORMA);
            
            var tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
            var corAleatoria = cores[Math.floor(Math.random() * cores.length)];
            var tamanho = 30 + Math.random() * 50;
            var x = tamanho + Math.random() * (areaDoJogo.largura - tamanho * 2);
            var y = tamanho + Math.random() * (areaDoJogo.altura - tamanho * 2);
            
            var novaForma = new Forma(tipoAleatorio, tamanho, corAleatoria, x, y);
            minhasFormas.push(novaForma);
            
            console.log("➕ Nova forma adicionada: " + tipoAleatorio);
        }

        function adicionarCirculo() {
            var cores = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];
            var cor = cores[Math.floor(Math.random() * cores.length)];
            var tamanho = 40 + Math.random() * 40;
            var x = tamanho + Math.random() * (areaDoJogo.largura - tamanho * 2);
            var y = tamanho + Math.random() * (areaDoJogo.altura - tamanho * 2);
            
            var novoCirculo = new Forma(TIPOS_FORMA.CIRCULO, tamanho, cor, x, y);
            minhasFormas.push(novoCirculo);
            
            console.log("⭕ Novo círculo adicionado!");
        }

        function adicionarTriangulo() {
            var cores = ["#E74C3C", "#8E44AD", "#3498DB", "#27AE60"];
            var cor = cores[Math.floor(Math.random() * cores.length)];
            var tamanho = 50 + Math.random() * 30;
            var x = tamanho + Math.random() * (areaDoJogo.largura - tamanho * 2);
            var y = tamanho + Math.random() * (areaDoJogo.altura - tamanho * 2);
            
            var novoTriangulo = new Forma(TIPOS_FORMA.TRIANGULO, tamanho, cor, x, y);
            minhasFormas.push(novoTriangulo);
            
            console.log("🔺 Novo triângulo adicionado!");
        }

        function adicionarEstrela() {
            var cores = ["#F39C12", "#E67E22", "#D35400", "#F1C40F"];
            var cor = cores[Math.floor(Math.random() * cores.length)];
            var tamanho = 60 + Math.random() * 40;
            var x = tamanho + Math.random() * (areaDoJogo.largura - tamanho * 2);
            var y = tamanho + Math.random() * (areaDoJogo.altura - tamanho * 2);
            
            var novaEstrela = new Forma(TIPOS_FORMA.ESTRELA, tamanho, cor, x, y);
            minhasFormas.push(novaEstrela);
            
            console.log("⭐ Nova estrela adicionada!");
        }

        function limparTudo() {
            minhasFormas = [];
            console.log("🗑️ Todas as formas foram removidas!");
        }

        // ===== INICIA O SISTEMA QUANDO A PÁGINA CARREGAR =====
        window.onload = function() {
            iniciarJogo();
        };

        // Para testar no console:
        // adicionarFormaAleatoria() - adiciona uma forma aleatória
        // adicionarCirculo() - adiciona um círculo
        // limparTudo() - remove todas as formas