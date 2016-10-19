/** Helpers */
function Circle(r, startAngle, distAngle) {
  this.next = function() {
    var x = r * Math.cos(startAngle);
    var y = r * Math.sin(startAngle);
    startAngle += distAngle;

    return {
      x: x,
      y: y
    };
  };
}

/**
 * Sun class.
 * @class
 *
 * @constructor
 *
 */
function Sun(scale) {
  this.scale = scale;
  this.name = 'Sun';
  this.itemSphere = {};
  this.itemCloud = {};
}

Sun.prototype.init = function() {
  this.itemSphere = Space.createItem('Sphere', 0, 0, 0);
  this.itemSphere.setScale(this.scale);
  this.itemSphere.setColor(252, 212, 64);

  this.itemCloud = Space.createItem('Cloud', 0, 0, 0);
  this.itemCloud.setScale(this.scale + 1);
  this.itemCloud.setColor(252, 212, 64);
  this.itemCloud.setName(this.name);
  this.itemCloud.showName(true);
};

/**
 * Planet class.
 * @class
 *
 * @constructor
 *
 */
function Planet(name, modelId, scale, radius, speed, zPos) {
  this.name = name;
  this.modelId = modelId;
  this.scale = scale;
  this.radius = radius;
  this.speed = speed;
  this.item = {};
  this.orbit = {};
  this.xyPos = {};
  this.zPos = zPos;
}

Planet.prototype.init = function() {
  this.orbit = new Circle(this.radius, 0, this.speed);
  this.xyPos = this.orbit.next();
  this.item = Space.getItem(this.modelId);
  this.item.setScale(this.scale);
};

Planet.prototype.orbitAround = function() {
  this.xyPos = this.orbit.next();
  this.item.setPosition(this.xyPos.x, this.xyPos.y, this.zPos);
};

/**
 * Solar system class.
 * @class
 *
 * @constructor
 *
 */
function SolarSystem() {
  this.sun = {};
  this.planets = [
    new Planet('Mercury', 'pOWbD3wcbu', 0.19, 4, 0.02, 2.1),
    new Planet('Venus', 'QXvx2739Yz', 0.48, 6, 0.008, 2),
    new Planet('Earth', 'KXaKzJY13P', 0.5, 8, 0.005, 2),
    new Planet('Mars', 'lTDFkkGFr8', 0.27, 10, 0.003, 2),
    new Planet('Jupiter', 'J9jNRuAnG3', 5.61 / 3, 13, 0.0004, 1),
    new Planet('Saturn', 'pSjbkxDCsK', 4.73 / 3, 18, 0.00017, 1),
    new Planet('Uranus', 'xQ6KxmBNsT', 2 / 3, 23, 0.00006, 1.5),
    new Planet('Neptune', 'ribsaLPsO1', 1.94 / 3, 28, 0.00003, 1.5)
  ];
  this.soundClipId = 'd3e6632587d5fbacf7be7b3e685b71cd07f12b037be79639a2c8a464fd406429';
  this.soundClip = {};
}

SolarSystem.prototype.init = function() {
  var self = this;

  this.soundClip = Space.loadSound(this.soundClipId);
  this.soundClip.play();

  this.sun = new Sun(10);
  this.sun.init();

  this.planets.forEach(function(planet) {
    planet.init();
  });

  Space.scheduleRepeating(function() {
    self.planets.forEach(function(planet) {
      planet.orbitAround();
    });
  }, 0);
};

/** Kick off */
var solarSystem = new SolarSystem();
solarSystem.init();
