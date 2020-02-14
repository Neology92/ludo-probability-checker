var Pawn = function(player) {
  this.player = player;
  this.field = null;
  this.position = -1;
  this.init();
  this.capture_chance = 0;
  this.alive_chance = 1;
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
        console.log(that.getCaptureChance());
        dice_value = that.player.board.dice.getValue();
        let ghost_pawn = that;
        ghost_pawn.move(dice_value);
      }
    });
};

Pawn.prototype.setField = function(field) {
  this.field = field;
  this.position = this.player.findPositionInPath(field);
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
Pawn.prototype.getEnemiesInRange = function(range, enemy) {
  let board = this.player.board;

  let pos_on_enemy_path = enemy.findPositionInPath(this.field);
  if (pos_on_enemy_path == -1) return [];

  if (pos_on_enemy_path < range - 6) {
    return [];
  }

  pos_on_enemy_path -= range - 6;
  range = 6;

  let enemies = [];
  while (range-- && pos_on_enemy_path) {
    pos_on_enemy_path--;
    let field = board.getField(enemy.path[pos_on_enemy_path]);
    let next_enemy_pawn;
    if (
      (next_enemy_pawn = field.getPawn()) &&
      next_enemy_pawn.player.color == enemy.color
    )
      enemies.push(next_enemy_pawn);
  }
  return enemies;
};

Pawn.prototype.addCaptureChance = function(chance) {
  this.capture_chance += chance;
};

Pawn.prototype.calcNewAliveChance = function() {
  this.alive_chance = 1 - this.capture_chance;
};

Pawn.prototype.getAliveChance = function() {
  return this.alive_chance;
};

Pawn.prototype.getCaptureChance = function() {
  return this.capture_chance;
};

Pawn.prototype.resetProbability = function() {
  this.alive_chance = 1;
  this.capture_chance = 0;
};

Pawn.prototype.calcCaptureProbability = function(enemy) {
  let enemies_6, enemies_12;

  enemies_12 = [];
  enemies_6 = [];
  if (enemy.isMovable) {
    enemies_6 = this.getEnemiesInRange(6, enemy);
    kill_prob = this.getAliveChance() * captureProb_6(enemies_6, enemy);
    this.addCaptureChance(kill_prob);

    enemies_12 = this.getEnemiesInRange(12, enemy);
    kill_prob = this.getAliveChance() * captureProb_12(enemies_12, enemy);
    this.addCaptureChance(kill_prob);

    // start base (1/6) if has at least one inside
    field_type = this.position / 10 + 2;
    if (field_type == enemy.color) {
      if (enemy.start.hasPawn()) {
        this.addCaptureChance(1 / 6);
      }
    }

    this.calcNewAliveChance();
  }
};

Pawn.prototype.move = function(distance) {
  let field, new_field;

  if (this.position == -1) {
    if (distance == 6) {
      field = this.field;

      start = this.player.path[0];
      new_field = game.board.getField(start);

      let moved = new_field.setPawn(this);
      if (moved) field.setPawn(null);
    } else {
      return false;
    }
  } else if (this.isMovable(distance)) {
    field = this.field;
    new_pos = this.position + distance;
    xy = this.player.path[new_pos];
    new_field = game.board.getField(xy);

    let moved = new_field.setPawn(this);
    if (moved) field.setPawn(null);
  } else {
    return false;
  }
};
