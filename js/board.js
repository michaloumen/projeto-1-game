document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score");
  const startBtn = document.querySelector("#startGame");
  const timeLeftDisplay = document.querySelector("#time-left");
  let timeLeft = 10;
  const width = 8; //será de 8x8
  const squares = [];
  let score = 0;
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  const candyColors = [
    "url(images/red-candy.png)",
    "url(images/yellow-candy.png)",
    "url(images/orange-candy.png)",
    "url(images/purple-candy.png)",
    "url(images/green-candy.png)",
    "url(images/blue-candy.png)",
  ];

  function countDown() {
    setInterval(function () {
      if (timeLeft <= 0) {
        clearInterval((timeLeft = 0));
        grid.style.display = "none";
      }

      timeLeftDisplay.innerHTML = `seconds left: ${timeLeft}`;
      timeLeft -= 1;
      if (timeLeft <= 0 && score > 10) {
        timeLeftDisplay.innerHTML = "Congrats, you won";
      }
      if (timeLeft <= 0) {
        timeLeftDisplay.innerHTML = "You ran out of time";
      }
    }, 1000);
  }

  startBtn.addEventListener("click", countDown);

  window.onload = function () {
    var startGame = document.getElementById("startGame");
    grid.style.display = "none";
    timeLeftDisplay.innerHTML = `You Have ${timeLeft} minuts`;

    startGame.onclick = function () {
      document.getElementById("startGame");
      grid.style.display = "flex";

      function createBoard() {
        for (let i = 0; i < width * width; i++) {
          const square = document.createElement("div");
          //para fazer o mouse arrastar os doces
          square.setAttribute("draggable", true);
          //isso vai servir para depois conseguir arrastar as cores porque teremos 64 quadrinhos no board
          square.setAttribute("id", i);
          //distribui randomicamente as cores
          let randomColor = Math.floor(Math.random() * candyColors.length);
          //estou passando as cores randômicas para o array de 'const squares'
          square.style.backgroundImage = candyColors[randomColor];
          grid.appendChild(square);
          squares.push(square);
        }
      }
      createBoard();

      //fazer 'dragable' com os candies. Criamos os eventos com os quais podemos interagir no elemento arrastável: dragstart, gradend, dragover...

      squares.forEach((square) =>
        square.addEventListener("dragstart", dragStart)
      );
      squares.forEach((square) => square.addEventListener("dragend", dragEnd));
      squares.forEach((square) =>
        square.addEventListener("dragover", dragOver)
      );
      squares.forEach((square) =>
        square.addEventListener("dragenter", dragEnter)
      );
      squares.forEach((square) =>
        square.addEventListener("dragleave", dragLeave)
      );
      squares.forEach((square) => square.addEventListener("drop", dragDrop));

      function dragStart() {
        //definir a cor
        colorBeingDragged = this.style.backgroundImage;
        //definir o que será arrastado. Colocar parseInt porque tem que ser um número
        squareIdBeingDragged = parseInt(this.id);
        console.log(colorBeingDragged);
        console.log(this.id, "dragstart");
      }

      //'e' para 'event'
      //preventDefault --- cancela o evento se for cancelável sem parar a sua propagação --- importante para não dar erro na hora de deslizar o quadradinho de lugar
      function dragOver(e) {
        e.preventDefault();
        console.log(this.id, "dragover");
      }

      function dragEnter(e) {
        e.preventDefault();
        console.log(this.id, "dragenter");
      }

      function dragLeave() {
        console.log(this.id, "dragleave");
      }

      function dragDrop() {
        console.log(this.id, "dragdrog");
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        //fazer os dois quadrados trocarem de cor quando arrastamos uma cor para o lado
        this.style.backgroundImage = colorBeingDragged;
        //a cor que vai ficar
        squares[
          squareIdBeingDragged
        ].style.backgroundImage = colorBeingReplaced;
      }

      function dragEnd() {
        console.log(this.id, "dragend");
        //qual é um movimento válido?
        let validMoves = [
          //-1 porque temos trocar. Dizemos que o número do quadrado é 67, e vamos trocar para a posição 66 e depois mexe no widt. Depois faz isso com um array imediatamente acima desse e diminui o width -- não entendi direito porque
          //o que eu entendi é que em um código estamos fazendo movimento de trocar para direito e no outro o movimento de trocar para a esquerda
          squareIdBeingDragged - 1,
          squareIdBeingDragged - width,
          squareIdBeingDragged + 1,
          squareIdBeingDragged + width,
        ];
        //se o número passado for válido, ele será incluído no array
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
          //se for verdadeiro, faz a troca e está pronto para limpar (null) e começar uma troca de cores nova
          squareIdBeingReplaced = null;
          //se é um quadrado que pode ser trocar de lugar mas não estamos tentando fazer um movimento válido, o quadrado deve permanecer em sua posição original. E isso tem que ser feito para o quadrado que queremos trocar e para o que será trocado -- por isso 2x o [squareIdBeingReplaced]
        } else if (squareIdBeingReplaced && !validMove) {
          squares[
            squareIdBeingReplaced
          ].style.backgroundImage = colorBeingReplaced;
          squares[
            squareIdBeingDragged
          ].style.backgroundImage = colorBeingDragged;
          //e se nada disso acontecer, não é um quadrado que pode trocar de lugar e nem é um movimento válido, eles só vão ficar parados mesmo
        } else
          squares[
            squareIdBeingDragged
          ].style.backgroundImage = colorBeingDragged;
      }

      //essa função faz os espaços brancos sumirem e fazer os doces que estão acima deles cairem
      function moveDown() {
        for (i = 0; i < 55; i++) {
          if (squares[i + width].style.backgroundImage === "") {
            squares[i + width].style.backgroundImage =
              squares[i].style.backgroundImage;
            squares[i].style.backgroundImage = "";
            //aqui é para completar esse espaço que ficou vazio com outras bolinhas coloridas randomicamente **tá dando uns bugs que as vezes não completa os espaços
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            const isFistRow = firstRow.includes(i);
            if (isFistRow && squares[i].style.backgroundImage === "") {
              let randomColor = Math.floor(Math.random() * candyColors.length);
              squares[i].style.backgroundImage = candyColors[randomColor];
            }
          }
        }
      }

      //para combinações de 5
      function checkRowForFive() {
        for (i = 0; i < 59; i++) {
          let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
          let decidedColor = squares[i].style.backgroundImage;
          const isBlank = squares[i].style.backgroundImage === "";

          const notValid = [
            4,
            5,
            6,
            7,
            12,
            13,
            14,
            15,
            20,
            21,
            22,
            23,
            28,
            29,
            30,
            31,
            36,
            37,
            38,
            39,
            44,
            45,
            46,
            47,
            52,
            53,
            54,
            55,
          ];
          if (notValid.includes(i)) continue;

          if (
            rowOfFive.every(
              (index) =>
                squares[index].style.backgroundImage === decidedColor &&
                !isBlank
            )
          ) {
            score += 5;
            scoreDisplay.innerHTML = score;
            rowOfFive.forEach((index) => {
              squares[index].style.backgroundImage = "";
            });
          }
        }
      }
      checkRowForFive();

      function checkColumnForFive() {
        for (i = 0; i < 47; i++) {
          let columnOfFive = [
            i,
            i + width,
            i + width * 2,
            i + width * 3,
            i + width * 4,
          ];
          let decidedColor = squares[i].style.backgroundImage;
          const isBlank = squares[i].style.backgroundImage === "";

          if (
            columnOfFive.every(
              (index) =>
                squares[index].backgroundImage === decidedColor && !isBlank
            )
          ) {
            score += 5;
            scoreDisplay.innerHTML = score;
            columnOfFive.forEach((index) => {
              squares[index].style.backgroundImage = "";
            });
          }
        }
      }
      checkColumnForFive();

      //para combinações de 4
      function checkRowForFour() {
        for (i = 0; i < 60; i++) {
          let rowOfFour = [i, i + 1, i + 2, i + 3];
          let decidedColor = squares[i].style.backgroundImage;
          const isBlank = squares[i].style.backgroundImage === "";

          const notValid = [
            5,
            6,
            7,
            13,
            14,
            15,
            21,
            22,
            23,
            29,
            30,
            31,
            37,
            38,
            39,
            45,
            46,
            47,
            53,
            54,
            55,
          ];
          if (notValid.includes(i)) continue;

          if (
            rowOfFour.every(
              (index) =>
                squares[index].style.backgroundImage === decidedColor &&
                !isBlank
            )
          ) {
            score += 4;
            scoreDisplay.innerHTML = score;
            rowOfFour.forEach((index) => {
              squares[index].style.backgroundImage = "";
            });
          }
        }
      }
      checkRowForFour();

      function checkColumnForFour() {
        for (i = 0; i < 47; i++) {
          let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
          let decidedColor = squares[i].style.backgroundImage;
          const isBlank = squares[i].style.backgroundImage === "";

          if (
            columnOfFour.every(
              (index) =>
                squares[index].backgroundImage === decidedColor && !isBlank
            )
          ) {
            score += 4;
            scoreDisplay.innerHTML = score;
            columnOfFour.forEach((index) => {
              squares[index].style.backgroundImage = "";
            });
          }
        }
      }
      checkColumnForFour();

      //procurando matches de 3 peças
      //começa com um loop de 61 peças porque o jogo tem 64 -- de 0 a 63 e se não desconta 3, vai dar erro porque vai faltar combinações
      function checkRowForThree() {
        for (i = 0; i < 61; i++) {
          let rowOfThree = [i, i + 1, i + 2];
          //para quando arrastamos a cor, tem que fazer a combinação de 3 de acordo com aquela cor que acabamos de arrastar
          let decidedColor = squares[i].style.backgroundImage;
          //blank para quando estiver vazio for true (=== '')
          const isBlank = squares[i].style.backgroundImage === "";

          //só que ele está contando 3 cores juntas mesmo quando começa de um lado do board e termina do outro. Isso não é uma combinação válida. Precisamos excluir. Vamos escrever todas as combinações de índice que não quero que minha linha comece porque vai quebrar e terminar do outro lado
          const notValid = [
            6,
            7,
            14,
            15,
            22,
            23,
            30,
            31,
            38,
            39,
            46,
            47,
            54,
            55,
          ];
          if (notValid.includes(i)) continue; //se o número for qualquer um desses, vamos pular ele

          if (
            rowOfThree.every(
              (index) =>
                squares[index].style.backgroundImage === decidedColor &&
                !isBlank
            )
          ) {
            score += 3;
            scoreDisplay.innerHTML = score;
            rowOfThree.forEach((index) => {
              //se encontrar uma correspondência, quero pegar as linhas de três arrays e dar a ela uma cor de fundo vazia
              squares[index].style.backgroundImage = "";
            });
          }
        }
      }
      checkRowForThree();

      function checkColumnForThree() {
        //47 porque é o número da nossa última coluna
        for (i = 0; i < 47; i++) {
          let columnOfThree = [i, i + width, i + width * 2];
          let decidedColor = squares[i].style.backgroundImage;
          const isBlank = squares[i].style.backgroundImage === "";

          if (
            columnOfThree.every(
              (index) =>
                squares[index].style.backgroundImage === decidedColor &&
                !isBlank
            )
          ) {
            score += 3;
            scoreDisplay.innerHTML = score;
            columnOfThree.forEach((index) => {
              squares[index].style.backgroundImage = "";
            });
          }
        }
      }
      checkColumnForThree();

      //mas isso de apagar as 3 linhas só acontece quando inicia o navegador. Durante o jogo isso não acontecerá mais e não é para ser assim. Por isso, vamos usar o setInterval
      window.setInterval(function () {
        moveDown();
        checkRowForFive();
        checkColumnForFive();
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        document.getElementById("startGame").style.display = "none";
      }, 100);
    };
  };

  /*   const audio = document.querySelector("#player");
  audio.play(); */
});
