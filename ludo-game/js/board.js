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
      [3, 3, 0, 0, 1, 1, 1, 0, 0, 2, 2],
      [3, 3, 0, 0, 1, 3, 1, 0, 0, 2, 2],
      [0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1],
      [1, 4, 4, 4, 4, 0, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 5, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 5, 1, 0, 0, 0, 0],
      [4, 4, 0, 0, 1, 5, 1, 0, 0, 5, 5],
      [4, 4, 0, 0, 1, 1, 1, 0, 0, 5, 5]
    ],
    x = 0,
    y = 0,
    col;

  delete this.fields;
  this.fields = [];

  while (map[x]) {
    col = map[x];
    this.fields[x] = [];
    while (col[y] !== undefined) {
      if (col[y] > 0) this.fields[x].push(new Field(x, y, col[y]));
      else this.fields[x].push(null);

      y++;
    }
    y = 0;
    x++;
  }
};

Board.prototype.getField = function(coords) {
  var x = coords[0],
    y = coords[1];

  return this.fields[x] ? this.fields[x][y] : null;
};
