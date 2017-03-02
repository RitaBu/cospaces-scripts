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
Vector.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Vector.prototype.mag = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y + this.z * v.z;
};

Vector.prototype.angleTo = function(a) {
  return Math.acos(this.dot(a) / (this.mag() * a.mag()));
};

// static methods
Vector.sub = function(v1, v2) {
  return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
};

/**
 * Camera constructor function
 *
 */
function Camera(pos) {
  this.item = Scene.getCamera();
  this.item.setPosition(pos.x, pos.y, pos.z);
  this.pos = new Vector(pos.x, pos.y, pos.z);
  this.dir = new Vector(0, 0, 0);
}

Camera.prototype.update = function() {
  var newDir = this.item.getDirection();
  this.dir.set(newDir.x, newDir.y, newDir.z);
};

/**
 * Marker constructor function
 *
 */
function Marker(pos) {
  this.item = Scene.createItem('Cube', pos.x, pos.y, pos.z);
  this.item.setColor(255, 0, 0);
  this.pos = new Vector(pos.x, pos.y, pos.z);
  this.con = new Vector();
}

Marker.prototype.setOpacity = function() {
  var opacity = 1 - this.con.angleTo(camera.dir) * 2;
  this.item.setOpacity(opacity);
};

Marker.prototype.update = function() {
  this.con = Vector.sub(this.pos, camera.pos);
  this.setOpacity();
};

// Init
var camera = new Camera({x: 3, y: -7, z: 5});
var observer = Scene.createItem('Sphere', 3, -7, 5);
observer.focusOn(true);
camera.item.setPlayerCamera();

var markers = [
  new Marker({x: 4, y: 5, z: 3}),
  new Marker({x: 1, y: 2, z: 6}),
  new Marker({x: -12, y: -3, z: 3}),
  new Marker({x: 8, y: -10, z: 0}),
  new Marker({x: -20, y: -5, z: 10}),
  new Marker({x: 1, y: 2, z: 6}),
  new Marker({x: 25, y: -23, z: 0}),
  new Marker({x: 7, y: -15, z: 15}),
  new Marker({x: 1, y: -12, z: 5}),
  new Marker({x: 5, y: 5, z: 5})
];

Scene.scheduleRepeating(function() {
  camera.update();
  markers.forEach(function(marker) {
    marker.update();
  });
}, 0);
