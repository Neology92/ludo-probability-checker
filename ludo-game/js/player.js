var Player = function(name, color, board) {
  this.color = color;
  this.board = board;
  this.start = new Base("start", this.color, this.board);
  this.end = new Base("end", this.color, this.board);
  this.setPath();
  this.setPawns();
};

// Path with end base
Player.prototype.setPath = function() {
  var start = (this.color - 2) * 10,
    p = this.board.path,
    size = p.length;

  this.path =
    start > 0 ? p.slice(start, size).concat(p.slice(0, start)) : [].concat(p);
  this.path = this.path.concat(this.end.getPath());
};

Player.prototype.setPawns = function() {
  var i = 0,
    field,
    pawn;

  this.pawns = [];

  for (i = 0; i < 4; i++) {
    pawn = new Pawn(this);
    field = this.start.getFreeField();
    if (field) {
      field.setPawn(pawn);
    }
    this.pawns[i] = pawn;
  }
};

Player.prototype.isMovable = function() {
  var i = 0;

  while (this.pawns[i]) {
    if (this.pawns[i].isMovable()) {
      return true;
    }
    i++;
  }

  return false;
};

Player.prototype.findPositionInPath = function(field) {
  return this.path.findIndex(elem => {
    if (elem[0] == field.x && elem[1] == field.y) {
      return true;
    } else {
      return false;
    }
  });
};

Player.prototype.calcPawnsCaptureChance = function(enemy) {
  for (let j = 0; j < 4; j++) {
    pawn = this.pawns[j];
    pawn.calcCaptureProbability(enemy);
  }
};

Player.prototype.resetPawnsProbability = function() {
  for (let j = 0; j < 4; j++) {
    pawn = this.pawns[j];
    pawn.resetProbability();
  }
};

Player.prototype.replacePawn = function(pawn, new_pawn) {
  let index = this.pawns.indexOf(pawn);

  if (index !== -1) {
    this.pawns[index] = new_pawn;
  } else {
    console.error("Err: Couldn'r replace pawns");
  }
};

Player.prototype.hasFree6MovablePawns = function(excluded) {
  otherPawns = this.pawns.filter(elem => !excluded.includes(elem));
  canOtherMove6 = false;

  for (let i = 0; i < otherPawns.length; i++) {
    if (otherPawns[i].isMovable(6)) {
      return true;
    }
  }
  return false;
};
