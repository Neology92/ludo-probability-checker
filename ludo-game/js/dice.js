var Dice = function(parent) {
  this.value = 1;
  this.parent = parent;
  this.$dice = null;
  this.$elem = null;
  this.init();
};

Dice.prototype.size = 50;

Dice.prototype.roll = function() {
  if (this.$elem) {
    this.$dice.removeClass("dice-" + this.value);
    this.value = (this.value % 6) + 1;
    this.$dice.addClass("dice-" + this.value);
  }
};

Dice.prototype.getValue = function() {
  return this.value;
};

Dice.prototype.init = function() {
  var that = this;

  this.$dice = $("<div />")
    .addClass("dice")
    .bind({
      click: function() {
        that.roll();
      }
    });

  this.$elem =
    this.$elem ||
    $("<div>")
      .addClass("dice-wrap")
      .append(this.$dice)
      .appendTo("#" + this.parent);
};
