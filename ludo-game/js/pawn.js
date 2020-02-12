var Pawn = function(player) {
  this.player = player;
  this.field = null;
  this.position = -1;
  this.init();
};

Pawn.prototype.size = 50;

Pawn.prototype.init = function() {
  var that = this;

  this.$elem = $('<div draggable="true" />')
    .addClass("pawn pawn-" + this.player.color)
    .bind({
      mouseover: function() {
        if (that.player.isFocused) {
          that.focus();
        }
      },
      mouseout: function() {
        that.blur();
      },
      click: function() {
        //! Show probability info
      }
    });
};

Pawn.prototype.setField = function(field) {
  this.field = field;
  this.position = this.player.findFieldInPath(field);
  console.log(this.position);
};

Pawn.prototype.focus = function() {
  this.$elem.addClass("focused");
  this.isFocused = true;
};

Pawn.prototype.blur = function() {
  this.$elem.removeClass("focused");
  this.isFocused = false;
};

Pawn.prototype.isMovable = function(dice_roll = 0) {
  var p = this.position,
    end = this.player.end;

  if (dice_roll == 0) {
    if (
      p === 43 ||
      (p === 42 && end.checkField(3)) ||
      (p === 41 && end.checkField(3) && end.checkField(2)) ||
      (p === 40 && end.checkField(3) && end.checkField(2) && end.checkField(1))
    ) {
      return false;
    }
    return true;
  } else {
    if (dice_roll == 6 && p == -1) {
      return true;
    }
    if (p <= 39 - dice_roll) {
      let next_xy, next_field;

      next_xy = this.player.path[p + dice_roll];
      next_field = this.player.board.fields[next_xy[0]][next_xy[1]];

      if (next_field.getPawn()) {
        let next_pawn;
        next_pawn = next_field.getPawn();
        console.log(next_pawn.player, this.player);
        if (next_pawn.player.color == this.player.color) {
          return false;
        }
      }
      return true;
    }
    for (let i = 0; i < 4; i++) {
      if (p == 43 - dice_roll - i && !end.checkField(3 - i)) {
        return true;
      }
    }
    return false;
  }
};

// range 6, 12, 18
Pawn.prototype.isEnemyInRange = function(range, player) {
  if (range == 6) {
    for (let i = 0; i < range; i++) {
      player.path.findFieldInPath(field);
    }
  }
};
