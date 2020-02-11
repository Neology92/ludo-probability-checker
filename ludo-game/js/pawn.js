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

Pawn.prototype.focus = function() {
  this.$elem.addClass("focused");
  this.isFocused = true;
};

Pawn.prototype.blur = function() {
  this.$elem.removeClass("focused");
  this.isFocused = false;
};

Pawn.prototype.isMovable = function() {
  var p = this.position,
    end = this.player.end;

  if (
    p === 43 ||
    (p === 42 && end.checkField(3)) ||
    (p === 41 && end.checkField(3) && end.checkField(2))
  ) {
    return false;
  }

  return true;
};
