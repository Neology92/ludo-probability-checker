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
  this.position = this.player.path.findIndex(elem => {
    if (elem[0] == this.field.x && elem[1] == this.field.y) {
      return true;
    } else {
      return false;
    }
  });
};

Pawn.prototype.focus = function() {
  this.$elem.addClass("focused");
  this.isFocused = true;
};

Pawn.prototype.blur = function() {
  this.$elem.removeClass("focused");
  this.isFocused = false;
};

Pawn.prototype.isMovable = function(range = 0) {
  var p = this.position,
    end = this.player.end;

  if (range == 0) {
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
    if (range == 6 && p == -1) {
      return true;
    }
    if (p <= 39 - range) {
      let next_xy, next_field;

      next_xy = this.player.path[p + range];
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
      if (p == 43 - range - i && !end.checkField(3 - i)) {
        return true;
      }
    }
    return false;
  }
};
