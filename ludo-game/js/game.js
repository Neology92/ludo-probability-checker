const checkProbability = game => {
  let players = game.players;
  let fields = game.board.fields;
  for (let i = 1; i < 2; i++) {
    // player ============================
    if (players[i].isMovable) {
      console.log(`Position for ${i}`);
      for (let j = 0; j < 4; j++) {
        // pawn ----------------------------------
        console.log(`Pawn: ${j}`);

        let enemies_6 = players[0].pawns[j].getEnemiesInRange(6, players[i]);
        console.log("Range 6: ", enemies_6);

        let enemies_12 = players[0].pawns[j].getEnemiesInRange(12, players[i]);
        console.log("Range 12: ", enemies_12);

        let enemies_18 = players[0].pawns[j].getEnemiesInRange(18, players[i]);
        console.log("Range 18: ", enemies_18);

        // start base (1/6) if has at least one inside

        // pawn ----------------------------------
      }
      // player ============================
    }
    console.log(`--------------`);
  }
};

(function(global) {
  var game = {
      board: null,
      players: []
    },
    RED = 2,
    GREEN = 3,
    YELLOW = 4,
    BLUE = 5;

  function addPlayer(name, color) {
    game.players.push(new Player(name, color, game.board));
  }

  function initDragging() {
    let dragged;

    /* events fired on the draggable target */
    document.addEventListener("drag", function(event) {}, false);

    document.addEventListener(
      "dragstart",
      function(event) {
        // store a ref. on the dragged elem
        dragged = event.target;
        // make it half transparent
        event.target.style.opacity = 0.5;
      },
      false
    );

    document.addEventListener(
      "dragend",
      function(event) {
        // reset the transparency
        event.target.style.opacity = "";
      },
      false
    );

    /* events fired on the drop targets */
    document.addEventListener(
      "dragover",
      function(event) {
        // prevent default to allow drop
        event.preventDefault();
      },
      false
    );

    document.addEventListener(
      "dragenter",
      function(event) {
        // highlight potential drop target when the draggable element enters it
        if (event.target.classList[0] == "field") {
          event.target.classList.add("field-focused");
        }
      },
      false
    );

    document.addEventListener(
      "dragleave",
      function(event) {
        // reset background of potential drop target when the draggable element leaves it
        if (event.target.classList[0] == "field") {
          event.target.classList.remove("field-focused");
        }
      },
      false
    );

    document.addEventListener(
      "drop",
      function(event) {
        // prevent default action (open as link for some elements)
        event.preventDefault();
        // move dragged elem to the selected drop target
        if (event.target.classList[0] == "field") {
          event.target.classList.remove("field-focused");
          let xy, coords, field_1, field_2;
          xy = dragged.parentNode.id.split("-");
          coords = [parseInt(xy[1], 10), parseInt(xy[2], 10)];
          field_1 = game.board.getField(coords);
          pawn = field_1.getPawn();

          xy = event.target.id.split("-");
          coords = [parseInt(xy[1], 10), parseInt(xy[2], 10)];
          field_2 = game.board.getField(coords);

          let moved = field_2.setPawn(pawn);
          if (moved) field_1.setPawn(null);
          checkProbability(game);
        }
      },
      false
    );
  }

  function init() {
    global.game = game;

    game.board = new Board("board");
    addPlayer("Player 1", RED);
    addPlayer("Player 2", GREEN);
    addPlayer("Player 3", YELLOW);
    addPlayer("Player 4", BLUE);

    initDragging();
  }

  global.addEventListener("load", function() {
    init();
  });
})(this);
