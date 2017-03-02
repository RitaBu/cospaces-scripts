/**
 * Helper methods
 *
 */
var Helper = {
  randNumBetween: function(min, max) {
    return Math.random() * (max - min) + min;
  }
};

/**
 * Vector constructor function
 * @class
 *
 * @constructor
 *
 */
function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

// instance methods
Vector.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Vector.prototype.add = function(v) {
  this.x = this.x + v.x;
  this.y = this.y + v.y;
  this.z = this.z + v.z;
};

Vector.prototype.sub = function(v) {
  this.x = this.x - v.x;
  this.y = this.y - v.y;
  this.z = this.z - v.z;
};

Vector.prototype.mult = function(s) {
  this.x = this.x * s;
  this.y = this.y * s;
  this.z = this.z * s;
};

Vector.prototype.div = function(d) {
  this.x = this.x / d;
  this.y = this.y / d;
  this.z = this.z / d;
};

Vector.prototype.mag = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector.prototype.normalize = function() {
  var mag = this.mag();
  this.x = this.x / mag;
  this.y = this.y / mag;
  this.z = this.z / mag;
};

Vector.prototype.limit = function(l) {
  if (this.mag() > l) {
    this.normalize();
    this.mult(l);
  }
};

// static methods
Vector.sub = function(v1, v2) {
  return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
};

Vector.div = function(v, d) {
  return new Vector(v.x / d, v.y / d, v.z / d);
};

/**
 * Mover constructor function
 * @class
 *
 * @constructor
 *
 */
function Mover(mass) {
  this.mass = mass;
  this.item = Scene.createItem('Sphere', 0, 0, 0);
  this.item.setScale(mass * 0.05);
  this.item.setColor((255 / mass) * 12, (255 / mass) * 3, (255 / mass) * 7);
  this.pos = new Vector(Helper.randNumBetween(-8, -4), Helper.randNumBetween(-10, 10), Helper.randNumBetween(1, 4));
  this.vel = new Vector();
  this.acc = new Vector();
}

Mover.prototype.applyForce = function(force) {
  var f = Vector.div(force, this.mass);
  this.acc.add(f);
};

Mover.prototype.update = function() {
  this.vel.add(this.acc);
  this.pos.add(this.vel);
  this.acc.mult(0);
};

Mover.prototype.display = function() {
  this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
};

Mover.prototype.checkEdges = function() {
  if (this.pos.x > 3.8) {
    this.vel.x *= -1;
    this.pos.x = 3.8;
  }
  if (this.pos.z < 0) {
    this.vel.z *= -1;
    this.pos.z = 0;
  }
};

/**
 * Init
 *
 */
var wall = Scene.getItem('FfM9uBBYwB');
wall.setPosition(4, 0, 0);

var movers = [];
for (var i = 1; i <= 30; i++) {
  movers.push(new Mover(i));
}

Scene.scheduleRepeating(function() {
  var wind = new Vector(0.003, 0, 0);
  var gravity = new Vector(0, 0, -0.005);

  movers.forEach(function(mover) {
    mover.applyForce(wind);
    mover.applyForce(gravity);

    mover.update();
    mover.display();
    mover.checkEdges();
  });
}, 0);
