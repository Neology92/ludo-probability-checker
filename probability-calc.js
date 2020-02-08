// s - start, h - house getter, 0 - nothing, (red, blue, yellow, green)
let board = [
  "sr",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "hb",
  "sb",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "hy",
  "sy",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "hg",
  "sg",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "hr"
];

let at_home = { red: 0, blue: 0, yellow: 0, green: 0 };
let at_start = { red: 4, blue: 4, yellow: 4, green: 4 };

class Pawn {
  constructor(color, position = -1) {
    this.color = color;
    this.position = position;
    switch (color) {
      case "red":
        this.spawn_pos = 0;
        break;
      case "blue":
        this.spawn_pos = 10;
        break;
      case "yellow":
        this.spawn_pos = 20;
        break;
      case "green":
        this.spawn_pos = 30;
        break;
    }
  }

  get_to_board() {
    if (this.position == -1) {
      this.position = this.spawn_pos;
    }
  }
}
