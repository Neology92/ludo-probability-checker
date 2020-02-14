var Popup = function() {
  this.isOpen = false;
  this.reset();
  this.cap_chance = 0;
  this.dist = 0;
  this.next_cap_chance = 0;
};

Popup.prototype.reset = function() {
  let that = this;

  this.$bar1 = $("<div />")
    .addClass("bar")
    .append("<p>Move distance: </p>");

  this.$bar2 = $("<div />")
    .addClass("bar")
    .append("<p>Current capture chance: </p>");

  this.$bar3 = $("<div />")
    .addClass("bar")
    .append("<p>Next capture chance: </p>");

  this.$bar4 = $("<div />")
    .addClass("bar")
    .append("<p></p>");

  this.$close = $("<button>x</button>")
    .addClass("close")
    .bind({
      click: function() {
        that.close();
      }
    });

  if (this.$elem) {
    this.$elem.remove();
  }

  this.$elem =
    // this.$elem ||
    $("<div>")
      .addClass("popup")
      .addClass("popup-hide")
      .append(this.$bar1)
      .append(this.$bar2)
      .append(this.$bar3)
      .append(this.$bar4)
      .append(this.$close)
      .appendTo("#content");
};

Popup.prototype.open = function(cap_chance, dist, next_cap_chance) {
  console.log("Open popup");
  this.isOpen = true;

  // display next to pawn
  this.reset();

  let delta = (next_cap_chance - cap_chance).toFixed(5);

  this.$bar1.append($(`<p>${dist}</p>`));
  this.$bar2.append($(`<p>${cap_chance}</p>`));
  if (next_cap_chance == -1) {
    this.$bar3.append($(`<p>Immovable</p>`));
    this.$bar4.append($(`<p></p>`));
  } else {
    this.$bar3.append($(`<p>${next_cap_chance}</p>`));

    if (delta > 0) {
      this.$bar4
        .append($(`<p>&#916; +${delta}</p>`))
        .addClass("delta-positive");
    } else if (delta < 0) {
      this.$bar4
        .append($(`<p>&#8711; ${delta}</p>`))
        .addClass("delta-negative");
    } else {
      this.$bar4.append($(`<p>+${delta}</p>`));
    }
  }

  this.$elem.removeClass("popup-hide");
};

Popup.prototype.close = function() {
  console.log("close popup");
  this.isOpen = false;

  let ghost_pawns, pawn, player;
  ghost_pawns = game.board.ghostPawns;

  for (let i = 0; i < ghost_pawns.length; i++) {
    pawn = ghost_pawns[i];
    player = pawn.player;

    pawn.remove();
    player.replacePawn(pawn, pawn.parentPawn);
  }
  game.board.ghostPawns = [];

  // Close popup
  this.$elem.addClass("popup-hide");
};
