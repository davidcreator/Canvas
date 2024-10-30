var myGamePiece; // Variável para armazenar a peça do jogo

function startGame() {
    myGameArea.start(); // Inicializa a área do jogo
    myGamePiece = new component(30, 30, "red", 10, 120); // Cria a peça do jogo com tamanho e posição especificados
}

var myGameArea = {
    canvas : document.createElement("canvas"), // Cria um novo elemento canvas
    start : function() {
        this.canvas.width = 480; // Define a largura do canvas
        this.canvas.height = 270; // Define a altura do canvas
        this.context = this.canvas.getContext("2d"); // Obtém o contexto 2D do canvas
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // Insere o canvas no corpo do documento
    }
};

function component(width, height, color, x, y) {
    this.width = width; // Define a largura do componente
    this.height = height; // Define a altura do componente
    this.x = x; // Define a posição x do componente
    this.y = y; // Define a posição y do componente
    ctx = myGameArea.context; // Obtém o contexto do canvas
    ctx.fillStyle = color; // Define a cor de preenchimento
    ctx.fillRect(this.x, this.y, this.width, this.height); // Desenha o componente no canvas
}
