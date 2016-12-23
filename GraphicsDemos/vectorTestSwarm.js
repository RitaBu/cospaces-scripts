var Helper = {
  randNumBetween: function(min, max) {
    return Math.random() * (max - min) + min;
  }
};

// simple vector constructor function
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

// script
var camera = Space.getCamera();
var sphere, pointer;
var movers = [];

function Mover() {
  this.item = Space.createItem('Cube', 0, 20, 1.6);
  this.item.setScale(0.2);
  this.item.setColor(0, 255, 0);
  this.pos = new Vector(Helper.randNumBetween(-4, 4), Helper.randNumBetween(17, 23), Helper.randNumBetween(0, 6));
  this.vel = new Vector();
  this.acc = new Vector();
}

Mover.prototype.update = function() {
  pointer.set(camera.getDirection().x, camera.getDirection().y, camera.getDirection().z);
  pointer.mult(20);
  var dir = Vector.sub(pointer, this.pos);

  dir.normalize();
  dir.mult(0.001);

  this.acc = dir;
  this.vel.add(this.acc);
  this.vel.limit(0.6);
  this.pos.add(this.vel);
};

Mover.prototype.display = function() {
  this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
};

Mover.prototype.checkLimits = function() {
  if (this.pos.z < 0) {
    this.pos.z = 0;
  }
};

function init() {
  camera.setPlayerCamera();

  pointer = new Vector(camera.getDirection().x, camera.getDirection().y, camera.getDirection().z);
  pointer.mult(20);

  sphere = Space.createItem('Sphere', pointer.x, pointer.y, pointer.z);
  sphere.setScale(0.2);
  sphere.setColor(255, 0, 0);

  for (var i = 0; i < 1000; i++) {
    movers[i] = new Mover();
  }

}

function draw() {
  sphere.setPosition(pointer.x, pointer.y, pointer.z + 1.6);

  movers.forEach(function(mover) {
    mover.checkLimits();
    mover.update();
    mover.display();
  });
}

init();
Space.scheduleRepeating(function() {
  draw();
}, 0);
