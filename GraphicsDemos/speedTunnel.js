/**
 * Helper methods
 *
 */
function randNumBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Mover constructor function
 * @class
 *
 * @constructor
 *
 */
function Mover(pos) {
  this.item = Scene.createItem('Cube', 0, 0, 0);
  this.item.setRandomColor();
  this.pos = {
    x: pos.x,
    y: pos.y,
    z: pos.z
  };
  this.speed = 0;
}

Mover.prototype.update = function() {
  if (this.pos.y < -10) {
    this.pos.y = 250;
  }
  this.speed += 0.0005;
  this.pos.y -= this.speed;
  return this;
};

Mover.prototype.display = function() {
  this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
  return this;
};

/**
 * Init
 *
 */
var moversLeft = [];
var moversRight = [];
var moversTop = [];
var moversBottom = [];

for (var i = -10; i < 250; i++) {
  moversLeft.push(new Mover({x: -3, y: i, z: randNumBetween(1, 6)}));
  moversRight.push(new Mover({x: 3, y: i, z: randNumBetween(1, 6)}));
  moversTop.push(new Mover({x: randNumBetween(-3, 3), y: i, z: 7}));
  moversBottom.push(new Mover({x: randNumBetween(-3, 3), y: i, z: 0}));
}

Scene.scheduleRepeating(function() {
  for (var i = 0; i < moversLeft.length; i++) {
    moversLeft[i].update().display();
    moversRight[i].update().display();
    moversTop[i].update().display();
    moversBottom[i].update().display();
  }
}, 0);
