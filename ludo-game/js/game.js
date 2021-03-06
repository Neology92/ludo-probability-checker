const captureProb_6 = (enemy_pawns_6, enemy) => {
  let probability = 0;

  for (let i = 0; i < enemy_pawns_6.length; i++) {
    probability += (1 / 6) * enemy_pawns_6[i].getAliveChance();
  }

  if (enemy.hasFree6MovablePawns(enemy_pawns_6)) {
    for (let i = 0; i < enemy_pawns_6.length; i++) {
      probability += (1 / 36) * enemy_pawns_6[i].getAliveChance();
    }
  } else if (enemy_pawns_6.length > 1) {
    let alive_chance = 1;
    let jump_above;
    for (let i = 0; i < enemy_pawns_6.length; i++) {
      alive_chance *= enemy_pawns_6[i].getAliveChance();
      if (enemy_pawns_6[i].isMovable(6)) {
        jump_above = true;
      }
    }
    if (jump_above) {
      probability += (1 / 36) * alive_chance;
    }
  }

  return probability;
};

const captureProb_12 = enemy_pawns_12 => {
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
  let players = game.players;

  for (let i = 0; i < 4; i++) {
    players[i].resetPawnsProbability();
  }

  players[0].calcPawnsCaptureChance(players[1]);
  players[2].calcPawnsCaptureChance(players[1]);
  players[3].calcPawnsCaptureChance(players[1]);

  players[0].calcPawnsCaptureChance(players[2]);
  players[1].calcPawnsCaptureChance(players[2]);
  players[3].calcPawnsCaptureChance(players[2]);

  players[0].calcPawnsCaptureChance(players[3]);
  players[1].calcPawnsCaptureChance(players[3]);
  players[2].calcPawnsCaptureChance(players[3]);

  players[1].calcPawnsCaptureChance(players[0]);
  players[2].calcPawnsCaptureChance(players[0]);
  players[3].calcPawnsCaptureChance(players[0]);

  // print in console ----------------------------------
  console.clear();
  for (let j = 0; j < 4; j++) {
    pawn = players[0].pawns[j];
    console.log(`]----Pawn: ${j}`);

    console.log(pawn.getCaptureChance());
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

          if (!game.popup.isOpen) {
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
        }
      },
      false
    );
  }

  function init() {
    global.game = game;

    game.board = new Board("board");
    game.board.dice = new Dice("content");
    game.popup = new Popup();

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
