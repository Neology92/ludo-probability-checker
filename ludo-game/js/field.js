/**
 * Class representing a single field of a game board
 * @param {Number} x    X-position
 * @param {Number} y    Y-position
 * @param {Number} type Field type
 */
var Field = function(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
  this.pawn = null;

  this.init();
};

Field.prototype.size = 50;

Field.prototype.init = function() {
  let that = this;

  this.$elem = $(`#field-${this.x}-${this.y}`);

  if (!this.$elem.length) {
    this.$elem = $("<div/>");
    this.$elem[0].id = `field-${this.x}-${this.y}`;
    this.$elem.addClass("field");
    $("#board").append(this.$elem);
  }

  this.$elem.css({
    left: this.x * this.size + 26 + "px",
    top: this.y * this.size + 26 + "px"
  });
};

Field.prototype.focus = function() {
  this.$elem.addClass("field-focused");
  this.isFocused = true;
};

Field.prototype.blur = function() {
  this.$elem.removeClass("field-focused");
  this.isFocused = false;
};

/**
 * Retrieve pawn standing on this field
 * @return {Object} Present pawn or null
 */
Field.prototype.getPawn = function() {
  return this.pawn;
};

/**
 * Set/unset pawn standing on this field
 * @param {Object} [pawn] Pawn
 */
Field.prototype.setPawn = function(pawn) {
  if (pawn) {
    if (pawn.player.color == this.type || this.type == 1) {
      this.pawn = pawn;
      this.$elem.children().remove();
      this.$elem.append(pawn.$elem);
      return true;
    } else {
      return false;
    }
  } else {
    this.pawn = null;
    this.$elem.children().remove();
    return true;
  }
};
