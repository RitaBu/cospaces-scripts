/**
 * Helper methods
 *
 */
var Helper = {
  degToRad: function (deg) {
    return (deg * Math.PI) / 180;
  }
};

var ZPOS_OFFSET = -300;

/**
 * Mover constructor function
 *
 */
function Mover(id, radius, velocity, scale, tilt, center, inclination) {
  this.name = 'Earth';
  this.item = Scene.getItem(id);
  this.item.setScale(scale);
  this.pos = {
    x: 0,
    y: 0,
    z: 0
  };
  this.radius = radius;
  this.velocity = velocity;
  this.tilt = tilt;
  this.center = center;
  this.inclination = inclination;
  this.angle = 0;
  this.setTilt();
}

Mover.prototype.update = function () {
  this.angle += this.velocity;
  this.pos.x = Math.cos(this.angle) * 1.5 * this.radius + this.center.pos.x;
  this.pos.y = Math.sin(this.angle) * this.radius + this.center.pos.y;
  this.pos.z = Math.cos(this.angle) * this.inclination + (this.center.item.scale() / 5 + this.center.pos.z);
  return this;
};

Mover.prototype.display = function () {
  this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
  return this;
};

Mover.prototype.setTilt = function () {
  var tiltVec = this.createTiltVec();
  this.item.addLocalRotation(0, 0, 0, tiltVec.x, tiltVec.y, tiltVec.z, Math.PI / 2);
  return this;
};

Mover.prototype.createTiltVec = function () {
  var tilt = 90 - this.tilt;
  return {
    x: Math.cos(Helper.degToRad(tilt)),
    y: 0,
    z: Math.sin(Helper.degToRad(tilt))
  };
};

/**
 * Sun constructor function
 *
 */
function Sun(scale) {
  this.pos = {
    x: 0,
    y: 0,
    z: ZPOS_OFFSET
  };
  this.item = Scene.createItem('Sphere', this.pos.x, this.pos.y, this.pos.z);
  this.item.setScale(scale);
  this.item.setColor(252, 212, 64);
  this.corona = Scene.createItem('Cloud', this.pos.x, this.pos.y, this.pos.z);
  this.corona.setScale(scale);
  this.corona.setColor(252, 212, 64);
}

/**
 * Satellite constructor function
 *
 */
function Satellite(pos, id) {
  this.item = Scene.getItem(id);
  this.item.setScale(3);
  this.item.setPosition(pos.x, pos.y, pos.z + ZPOS_OFFSET);
  this.camera = Scene.createItem('Sphere', pos.x, pos.y, pos.z + ZPOS_OFFSET);
  this.camera.setScale(0);
  this.bindEvents();
}

Satellite.prototype.bindEvents = function () {
  var self = this;
  this.item.onActivate(function () {
    showAllSatellites();
    self.item.setScale(0);
    self.camera.focusOn(true);
  });
};

/**
 * Init
 *
 */
var sun = new Sun(109);
var mercury = new Mover('QtxPMpgp6B', 40, 0.005, 0.383, 0.01, sun, 0);
var venus = new Mover('KFMtzrPzJX', 60, 0.004, 0.949, 177.36, sun, 0);
var earth = new Mover('tGEC9oMscI', 80, 0.003, 1, 23.4392811, sun, 0);
var moon = new Mover('UnxcFGDiD1', 2, 0.05, 0.2724, 6.68, earth, 0);
var mars = new Mover('sbyt9rkkYT', 100, 0.0025, 0.532, 25.19, sun, 0);
var phobos = new Mover('YJvFnC8Wxd', 1, 0.04, 0.3, 0, mars, 0);
var deimos = new Mover('AOB5nLLk1o', 2, 0.06, 0.2, 0, mars, 0);
var jupiter = new Mover('YWNdKV9RDj', 120, 0.002, 11.21, 3.13, sun, 0);
var saturn = new Mover('E7Va2MsdG7', 160, 0.0015, 9.45, 26.73, sun, 0);
var uranus = new Mover('lEMD5fQXNU', 180, 0.0012, 4.01, 97.77, sun, 0);
var neptune = new Mover('abHFqUDaIb', 200, 0.001, 3.88, 28.32, sun, 0);
var pluto = new Mover('BlDRGVhjGa', 220, 0.0007, 0.186, 122.53, sun, 100);

var movers = [];
movers.push(mercury, venus, earth, moon, mars, phobos, deimos, jupiter, saturn, uranus, neptune, pluto);

var satellites = [
  new Satellite({x: 0, y: -150, z: 50}, 'upkZ4SmFUL'),
  new Satellite({x: 150, y: 0, z: -20}, 'wLjWIF09fE'),
  new Satellite({x: -250, y: 250, z: 100}, 'oXuVAd9Yav')
];
satellites[0].item.setScale(0);
satellites[0].camera.focusOn(true);

function showAllSatellites() {
  satellites.forEach(function (satellite) {
    satellite.item.setScale(3);
  });
}

Scene.scheduleRepeating(function () {
  movers.forEach(function (mover) {
    mover.update().display();
  });
}, 0);
