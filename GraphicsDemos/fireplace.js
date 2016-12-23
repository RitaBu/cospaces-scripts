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
function Spark() {
  this.item = Space.createItem('Cube', 0, 0, 0);
  this.item.setScale(0.02);
  this.item.setColor(255, 0, 0);
  this.mass = 1;
  this.pos = new Vector(0, 0, Helper.randNumBetween(0, 2));
  this.vel = new Vector();
  this.acc = new Vector();
}

Spark.prototype.applyForce = function(force) {
  force.div(this.mass);
  this.acc.add(force);
};

Spark.prototype.update = function() {
  this.acc.set(Helper.randNumBetween(-0.0015, 0.0015), Helper.randNumBetween(-0.0015, 0.0015), Helper.randNumBetween(0.0001, 0.0002));
  this.applyForce(wind);
  this.vel.add(this.acc);
  this.pos.add(this.vel);
};

Spark.prototype.display = function() {
  this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
  this.item.setColor(255, this.pos.z * 250, 0);
};

Spark.prototype.checkLimits = function() {
  if (this.pos.z > Helper.randNumBetween(0.5, 3)) {
    this.acc.set(0, 0, 0);
    this.vel.set(0, 0, 0);

    this.pos.x = 0;
    this.pos.y = 0;
    this.pos.z = 0;
  }
};

// init
var sparks = [];
var wind = {};

function init() {
  wind = new Vector(0, 0.0002, 0);
  for (var i = 0; i < 250; i++) {
    sparks.push(new Spark());
  }
}

function draw() {
  sparks.forEach(function(spark) {
    spark.checkLimits();
    spark.update();
    spark.display();
  });
}

init();
Space.scheduleRepeating(function() {
  draw();
}, 0);
