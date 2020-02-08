var Board = function(id) {
  this.$elem = $("#" + id);

  if (!this.$elem.length) {
    this.$elem = $("<div/>");
    this.$elem[0].id = id;
    $("#content").append(this.$elem);
  }

  this.fields = [];
  this.path = [
    [4, 10],
    [4, 9],
    [4, 8],
    [4, 7],
    [4, 6],
    [3, 6],
    [2, 6],
    [1, 6],
    [0, 6],
    [0, 5],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [4, 3],
    [4, 2],
    [4, 1],
    [4, 0],
    [5, 0],
    [6, 0],
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
    [7, 4],
    [8, 4],
    [9, 4],
    [10, 4],
    [10, 5],
    [10, 6],
    [9, 6],
    [8, 6],
    [7, 6],
    [6, 6],
    [6, 7],
    [6, 8],
    [6, 9],
    [6, 10],
    [5, 10]
  ];
  this.reset();
};

// 1 -> normal field, 2-5 -> player's field
Board.prototype.reset = function() {
  var map = [
      [3, 3, 0, 0, 1, 1, 1, 0, 0, 4, 4],
      [3, 3, 0, 0, 1, 4, 1, 0, 0, 4, 4],
      [0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1],
      [1, 3, 3, 3, 3, 0, 5, 5, 5, 5, 1],
      [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
      [2, 2, 0, 0, 1, 2, 1, 0, 0, 5, 5],
      [2, 2, 0, 0, 1, 1, 1, 0, 0, 5, 5]
    ],
    x = 0,
    y = 0,
    row;

  delete this.fields;
  this.fields = [];

  while (map[y]) {
    row = map[y];
    this.fields[y] = [];
    while (row[x] !== undefined) {
      if (row[x] > 0) this.fields[y].push(new Field(x, y, row[x]));
      else this.fields[y].push(null);

      x++;
    }
    x = 0;
    y++;
  }
};

Board.prototype.getField = function(coords) {
  var x = coords[0],
    y = coords[1];

  return this.fields[y] ? this.fields[y][x] : null;
};
