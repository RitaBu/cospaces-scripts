function Walker(xStart, yStart, zStart, piecesAmount) {
  this.x = xStart;
  this.y = yStart;
  this.z = zStart;
  this.piecesAmount = piecesAmount;
  this.pieces = [];
}

Walker.prototype.setRandomColor = function(cube) {
  var red = Math.abs(Math.floor(this.x) * 32);
  var green = Math.abs(Math.floor(this.y) * 32);
  var blue = Math.abs(Math.floor(this.z) * 32);
  cube.setColor(red, green, blue);
};

Walker.prototype.display = function() {
  if (this.pieces.length < this.piecesAmount) {
    var cube = Space.createItem('Cube', this.x, this.y, this.z);
    cube.setScale(0.5);
    this.setRandomColor(cube);
    this.pieces.push(cube);
  } else {
    var firstCube = this.pieces.shift();
    firstCube.setPosition(this.x, this.y, this.z);
    this.setRandomColor(firstCube);
    this.pieces.push(firstCube);
  }
};

Walker.prototype.walk = function() {
  var stepX = Math.floor(Math.random() * 3 - 1);
  var stepY = Math.floor(Math.random() * 3 - 1);

  this.x += stepX / 4;
  this.y += stepY / 4;

  do {
    var stepZ = Math.floor(Math.random() * 3 - 1);
    this.z += stepZ / 4;
  } while (this.z < 0);
};

var walkers = [
  new Walker(0, 0, 2, 200),
  new Walker(-5, 5, 0, 200),
  new Walker(5, -5, 0, 200),
  new Walker(5, 5, 4, 200),
  new Walker(-5, -5, 4, 200),
  new Walker(-10, 10, 0, 200),
  new Walker(10, -10, 0, 200),
  new Walker(10, 10, 4, 200),
  new Walker(-10, -10, 4, 200),
  new Walker(-15, 15, 0, 200),
  new Walker(15, -15, 0, 200),
  new Walker(15, 15, 4, 200),
  new Walker(-15, -15, 4, 200)
];

function draw() {
  walkers.forEach(function(walker) {
    walker.walk();
    walker.display();
  });
}

Space.clear();
Space.scheduleRepeating(function() {
  draw();
}, 1 / 20);
