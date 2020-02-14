var Popup = function() {
  this.isOpen = false;
};

Popup.prototype.open = function(
  capture_chance,
  distance,
  next_capture_chance,
  pawn
) {
  console.log("Open popup");
  this.cap_chance = capture_chance;
  this.dist = distance;
  this.next_cap_chance = next_capture_chance;
  this.pawn = pawn;

  this.isOpen = true;
  // Create html element and display next to pawn
};

Popup.prototype.close = function() {
  console.log("close popup");
  this.isOpen = false;

  let ghost_pawns = game.board.ghostPawns;
  for (let i = 0; i < ghost_pawns.length; i++) {
    ghost_pawns[i].remove();
    game.board.ghostPawns = [];
  }
};
