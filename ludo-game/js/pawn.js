var Pawn = function(player) {
  this.player = player;
  this.field = null;
  this.position = -1;
  this.init();
  this.capture_chance = 0;
  this.alive_chance = 1;
  this.ghost = false;
  this.active = true;
  this.parentPawn = null;
};

Pawn.prototype.size = 50;

Pawn.prototype.init = function() {
  var that = this;

  this.$elem = $('<div draggable="true" />')
    .addClass("pawn pawn-" + this.player.color)
    .bind({
      mouseover: function() {
        //
      },
      mouseout: function() {
        //
      },
      click: function() {
        console.log(that);
        if (that.player.color == 2 && that.active && !that.ghost) {
          dice_value = that.player.board.dice.getValue();
          ghost_pawn = that.createGhostPawn(dice_value);
          checkProbability(game);
          ghost_capture_chance = -1;
          if (ghost_pawn) ghost_capture_chance = ghost_pawn.capture_chance;

          game.popup.open(
            that.capture_chance.toFixed(5),
            dice_value,
            ghost_capture_chance.toFixed(5)
          );

          that.checkActive();
        }
      }
    });
};

Pawn.prototype.checkActive = function() {
  if (this.active) {
    this.$elem.removeClass("unactive");
  } else {
    this.$elem.addClass("unactive");
  }
};

Pawn.prototype.createGhostPawn = function(distance) {
  if (!this.ghost && this.active) {
    game.popup.close();

    console.log("Create ghost pawn");
    let field,
      moved = false;
    let ghost_pawn = new Pawn(this.player);
    ghost_pawn.parentPawn = this;
    ghost_pawn.ghost = true;
    ghost_pawn.$elem.addClass("ghost");

    if (this.position == -1) {
      if (distance == 6) {
        start_xy = this.player.path[0];
        field = game.board.getField(start_xy);

        moved = field.setPawn(ghost_pawn);
      } else {
        return false;
      }
    } else if (this.isMovable(distance)) {
      new_pos = this.position + distance;
      xy = this.player.path[new_pos];
      field = game.board.getField(xy);

      moved = field.setPawn(ghost_pawn);
    } else {
      return false;
    }
    if (moved) {
      this.active = false;
      game.board.ghostPawns.push(ghost_pawn);
      this.player.replacePawn(this, ghost_pawn);
      return ghost_pawn;
    }
  } else return null;
};

Pawn.prototype.remove = function() {
  console.log("Remove ghost pawn");
  this.field.setPawn(null);
  if (this.parentPawn) {
    this.parentPawn.active = true;
    this.parentPawn.checkActive();
  }
};

Pawn.prototype.setField = function(field) {
  this.field = field;
  this.position = this.player.findPositionInPath(field);
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
