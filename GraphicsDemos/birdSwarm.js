/**
 * Helper methods
 *
 */
var Helper = {
  randNumBetween: function(min, max) {
    return Math.random() * (max - min) + min;
  },
  inheritsFrom: function(child, parent) {
    child.prototype = Object.create(parent.prototype);
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
 *
 */
function Mover() {
  this.item = Scene.createItem('Cube', 0, 0, 0);
  this.pos = new Vector(0, 0, Helper.randNumBetween(0, 2));
  this.acc = new Vector();
  this.vel = new Vector();
}

Mover.prototype.update = function() {
  this.vel.add(this.acc);
  this.pos.add(this.vel);
};

Mover.prototype.display = function() {
  this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
};

Mover.prototype.checkLimits = function() {
};

/**
 * Attractor constructor function
 *
 */
function Attractor() {
  this.item = Scene.createItem('Cube', 0, 0, 20);
  this.item.setOpacity(0);
  this.pos = new Vector(Helper.randNumBetween(10, 20), Helper.randNumBetween(-20, -10), Helper.randNumBetween(20, 30));
  this.acc = new Vector(Helper.randNumBetween(-0.0005, 0.0005), Helper.randNumBetween(-0.0005, 0.0005), Helper.randNumBetween(-0.0005, 0.0005));
  this.vel = new Vector();
}

Helper.inheritsFrom(Attractor, Mover);

Attractor.prototype.update = function() {
  this.vel.limit(0.1);
  this.vel.add(this.acc);
  this.pos.add(this.vel);
};

Attractor.prototype.checkLimits = function() {
  if (this.pos.x < -15) {
    this.acc.x = 0.0005;
  }
  if (this.pos.x > 15) {
    this.acc.x = -0.0005;
  }
  if (this.pos.y < -15) {
    this.acc.y = 0.0005;
  }
  if (this.pos.y > 15) {
    this.acc.y = -0.0005;
  }
  if (this.pos.z < 20) {
    this.acc.z = 0.001;
    if (this.pos.z < 0) {
      this.pos.z = 0;
    }
  }
  if (this.pos.z > 30) {
    this.acc.z = -0.0005;
  }
};

/**
 * Bird constructor function
 *
 */
function Bird() {
  this.item = Scene.createItem('LP_BlackBird', Helper.randNumBetween(-5, 5), Helper.randNumBetween(-5, 5), Helper.randNumBetween(3, 8));
  this.pos = new Vector(Helper.randNumBetween(-15, 5), Helper.randNumBetween(-15, 5), Helper.randNumBetween(15, 20));
  this.acc = new Vector();
  this.vel = new Vector();
  this.limit = Helper.randNumBetween(0.13, 0.16);
  this.initAnimation();
}

Helper.inheritsFrom(Bird, Mover);

Bird.prototype.update = function() {
  var dir = Vector.sub(attractor.pos, this.pos);
  dir.normalize();
  dir.mult(Helper.randNumBetween(0.0005, 0.001));

  this.vel.add(dir);
  this.vel.limit(this.limit);
  this.pos.add(this.vel);

  this.item.faceTo(attractor.item);
};

Bird.prototype.checkLimits = function() {
  if (this.pos.z < 1) {
    this.pos.z = 1;
  }
};

Bird.prototype.initAnimation = function() {
  var self = this;
  var delay = Helper.randNumBetween(0, 1);
  Scene.schedule(function() {
    self.item.playIdleAnimation('Fly');
  }, delay);
};

// init
var attractor = new Attractor();
var birds = [];

function init() {
  for (var i = 0; i < 300; i++) {
    birds.push(new Bird());
  }
}

function draw() {
  attractor.checkLimits();
  attractor.update();
  attractor.display();

  birds.forEach(function(bird) {
    bird.checkLimits();
    bird.update();
    bird.display();
  });
}

init();
Scene.scheduleRepeating(function() {
  draw();
}, 0);
