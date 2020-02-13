const captureProb_6 = (enemy_pawns_6, enemy) => {
  let probability = 0,
    otherEnemyPawns,
    canOtherMove6;

  probability += (1 / 6) * enemy_pawns_6.length;

  otherEnemyPawns = enemy.pawns.filter(elem => !enemy_pawns_6.includes(elem));

  canOtherMove6 = false;
  for (let i = 0; i < otherEnemyPawns.length; i++) {
    if (otherEnemyPawns[i].isMovable(6)) {
      canOtherMove6 = true;
    }
  }
  if (canOtherMove6) {
    probability += (1 / 36) * enemy_pawns_6.length;
  }

  return probability;
};

const captureProb_12 = (enemy_pawns_12, enemy) => {
  let movable_at_6 = 0,
    probability = 0;
  for (let i = 0; i < enemy_pawns_12.length; i++) {
    if (enemy_pawns_12[i].isMovable(6)) {
      movable_at_6++;
    }
  }

  probability += (1 / 36) * movable_at_6;
  return probability;
};

const checkProbability = game => {
  console.clear();
  let all = 0;

  let players = game.players;

  for (let i = 1; i < 4; i++) {
    // player ============================
    if (players[i].isMovable) {
      console.log(`Capture probability from ${i} player`);
      for (let j = 0; j < 4; j++) {
        // pawn ----------------------------------
        let capture_probability = 0,
          enemies_6,
          enemies_12;

        console.log(`]----Pawn: ${j}`);

        enemies_6 = players[0].pawns[j].getEnemiesInRange(6, players[i]);
        capture_probability += captureProb_6(enemies_6, players[i]);

        // -----------------

        enemies_12 = players[0].pawns[j].getEnemiesInRange(12, players[i]);
        capture_probability += captureProb_12(enemies_12, players[i]);

        console.log(capture_probability);
        all += capture_probability;

        // start base (1/6) if has at least one inside

        // pawn ----------------------------------
      }
      // player ============================
    }
    console.log(`--------------`);
    console.log(all);
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
