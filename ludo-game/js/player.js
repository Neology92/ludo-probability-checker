var Player = function(name, color, board) {
  this.color = color;
  this.board = board;
  this.start = new Base("start", this.color, this.board);
  this.end = new Base("end", this.color, this.board);
  this.setPath();
  this.setPawns();
  this.isFinished = false;
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
