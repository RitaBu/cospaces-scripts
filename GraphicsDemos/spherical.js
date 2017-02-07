/**
 * Helper methods
 *
 */
var Helper = {
  randNumBetween: function (min, max) {
    return Math.random() * (max - min) + min;
  }
};

/**
 * Vector constructor function
 *
 */
function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

// instance methods
Vector.prototype.set = function (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Vector.prototype.add = function (v) {
  this.x = this.x + v.x;
  this.y = this.y + v.y;
  this.z = this.z + v.z;
};

/**
 * Mover constructor function
 *
 */
function Mover(xPos, yPos, zPos, theta, phi) {
  this.item = Space.createItem('LP_Sphere', xPos, yPos, zPos);
  this.item.setScale(0.2);
  this.item.setRandomColor();
  this.angle = theta * phi;
  this.pos = new Vector(xPos, yPos, zPos);
  this.acc = new Vector();
  this.vel = new Vector();
}

Mover.prototype.update = function () {
  this.angle += 0.02;

  var q = Math.sin(this.angle * 0.25) * 0.002;
  var xAcc = q * this.pos.x;
  var yAcc = q * this.pos.y;
  var zAcc = q;

  this.acc.set(xAcc, yAcc, zAcc);
  this.pos.add(this.acc);
};

Mover.prototype.display = function () {
  this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
};

// init
var movers = [];

function init() {
  var r = 10;
  for (var phi = 0; phi < Math.PI * 2; phi += 0.2) {
    for (var theta = 0; theta < Math.PI * 2; theta += 0.2) {
      var xPos = Math.cos(phi) * Math.cos(theta) * r;
      var yPos = Math.cos(phi) * Math.sin(theta) * r;
      var zPos = Math.sin(phi) * r + 10;
      movers.push(new Mover(xPos, yPos, zPos, theta, phi));
    }
  }
}

function draw() {
  movers.forEach(function (mover) {
    mover.update();
    mover.display();
  });
}

init();
Space.scheduleRepeating(function () {
  draw();
}, 0);
