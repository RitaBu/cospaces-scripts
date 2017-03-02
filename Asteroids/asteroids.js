/** Helpers */
var helper = {
  randNumBetween: function(min, max) {
    return Math.random() * (max - min) + min;
  },
  randModelId: function() {
    return this.randNumBetween(-1, 1) < 0 ? 'LP_Stone' : 'LP_Stone2';
  },
  createVector: function() {
    return {
      x: this.randNumBetween(-1, 1),
      y: this.randNumBetween(-1, 1),
      z: this.randNumBetween(-1, 1)
    };
  }
};

/**
 * Player class.
 * @class
 *
 * @constructor
 *
 */
function Player(item, xPos, yPos, zPos) {
  this.item = item;
  this.xPos = xPos;
  this.yPos = yPos;
  this.zPos = zPos;
  this.dirVec = [0.12, 0, 0.12];
}

Player.prototype.update = function(cameraDirVec, cameraAxisX) {
  if (cameraDirVec.y < 0) {
    this.xPos = this.xPos + (this.dirVec[0] * cameraDirVec.x) + (this.dirVec[0] * cameraAxisX.z);
  } else {
    this.xPos = this.xPos + (this.dirVec[0] * cameraDirVec.x) + (this.dirVec[0] * -cameraAxisX.z);
  }
  this.zPos = this.zPos + this.dirVec[2] * cameraDirVec.z;
  this.item.setPosition(this.xPos, this.yPos, this.zPos);
};

/**
 * Gem class.
 * @class
 *
 * @constructor
 *
 */
function Gem() {
  this.item = {};
  this.xPos = 0;
  this.yPos = 60;
  this.zPos = 5 + game.zPosOffset;
  this.velocity = 0.18;
  this.scale = 1.6;
  this.color = {
    r: 0,
    g: 255,
    b: 0
  };
}

Gem.prototype.init = function() {
  this.item = Scene.createItem('LP_Star', this.xPos, this.yPos, this.zPos);
  this.item.setScale(this.scale);
  this.item.setColor(this.color.r, this.color.g, this.color.b);
};

Gem.prototype.update = function() {
  if (this.yPos < -20 || this.isCollected()) {
    this.xPos = helper.randNumBetween(-20, 20);
    this.yPos = 70;
    this.zPos = helper.randNumBetween(2, 9) + game.zPosOffset;
  }

  this.yPos -= this.velocity;
  this.item.setPosition(this.xPos, this.yPos, this.zPos);
  this.item.addLocalRotation(0, 0, 0, 0, 0, 1, 0.01);

  if (this.isCollected()) {
    game.sounds.gemCollect.play();
  }
};

Gem.prototype.isCollected = function() {
  return this.item.distanceToItem(game.player.item) < 1;
};

/**
 * Asteroid class.
 * @class
 *
 * @constructor
 *
 */
function Asteroid(item, xPos, yPos, zPos, velocity, rotationVec, xzDirection) {
  this.item = item;
  this.xPos = xPos;
  this.yPos = yPos;
  this.zPos = zPos;
  this.velocity = velocity;
  this.xzDirection = xzDirection;
  this.rotationVec = rotationVec;
}

Asteroid.prototype.hitPlayer = function() {
  return this.item.distanceToItem(game.player.item) < 1;
};

/**
 * AsteroidField class.
 * @class
 *
 * @constructor
 *
 */
function AsteroidField() {
  this.asteroids = [];
}

AsteroidField.prototype.spawnAsteroid = function() {
  var xPos = helper.randNumBetween(-30, 30);
  var yPos = helper.randNumBetween(120, 240);
  var zPos = helper.randNumBetween(1, 10) + game.zPosOffset;
  var velocity = helper.randNumBetween(0.2, 0.4);
  var xzDirection = {
    x: helper.randNumBetween(-0.03, 0.03),
    z: helper.randNumBetween(-0.01, 0.03)
  };
  var scale = helper.randNumBetween(0.5, 3.5);
  var rotationVec = helper.createVector();
  var modelId = helper.randModelId();

  var asteroid = new Asteroid(Scene.createItem(modelId, xPos, yPos, zPos), xPos, yPos, zPos, velocity, rotationVec, xzDirection);
  asteroid.item.setScale(scale);

  return asteroid;
};

AsteroidField.prototype.init = function() {
  for (var i = 0; i < 100; i++) {
    this.asteroids.push(this.spawnAsteroid());
  }
};

AsteroidField.prototype.update = function() {
  this.asteroids.forEach(function(asteroid) {
    if (asteroid.yPos < -60 || asteroid.hitPlayer()) {
      asteroid.xPos = helper.randNumBetween(-30, 30);
      asteroid.yPos = 120;
      asteroid.zPos = helper.randNumBetween(1, 10) + game.zPosOffset;
    }
    asteroid.item.addLocalRotation(0, 0, 0, asteroid.rotationVec.x, asteroid.rotationVec.y, asteroid.rotationVec.z, 0.01);
    asteroid.xPos += asteroid.xzDirection.x;
    asteroid.yPos -= asteroid.velocity;
    asteroid.zPos += asteroid.xzDirection.z;
    asteroid.item.setPosition(asteroid.xPos, asteroid.yPos, asteroid.zPos);

    if (asteroid.hitPlayer()) {
      game.sounds.asteroidHit.play();
    }
  });
};

/**
 * Game class.
 * @class
 *
 * @constructor
 *
 */
function Game() {
  this.zPosOffset = -300;
  this.player = new Player(Scene.createItem('LP_BlackBird', 0, 0, 20 + this.zPosOffset), 0, 0, 20 + this.zPosOffset);
  this.gem = {};
  this.asteroidField = new AsteroidField();
  this.camera = Scene.getCamera();
  this.cameraDirVec = {};
  this.cameraAxisX = {};
  this.bkgdPlanet = {};
  this.sounds = {
    gameMusic: Scene.loadSound('SPctPQ2kdViMgP9KS4PHOtKqBL1kDAAAF2qfCUsEXXt'),
    asteroidHit: Scene.loadSound('Mglh30MT8XeGHlKj1N1p0J6lOiBcrw8gx1LrmfOCibu'),
    gemCollect: Scene.loadSound('JLDQeK5DdnQ1VFULou31xvOPc6GPUimDb66drxrh1or')
  }
}

Game.prototype.initLoop = function() {
  var self = this;
  Scene.scheduleRepeating(function() {
    self.cameraDirVec = self.camera.getDirection();
    self.cameraAxisX = self.camera.getAxisX();
    self.player.update(self.cameraDirVec, self.cameraAxisX);
    self.gem.update();
    self.asteroidField.update();
  }, 0);
};

Game.prototype.init = function() {
  Scene.setMood(0);
  this.player.item.focusOn(true);
  this.asteroidField.init();
  this.gem = new Gem();
  this.gem.init();
  this.sounds.gameMusic.play(true);
  this.initLoop();
  this.bkgdPlanet = Scene.getItem('twjRf56cvq');
  this.bkgdPlanet.setPosition(200, 1000, 120 + this.zPosOffset);
  this.bkgdPlanet.setScale(300);
  this.bkgdPlanet.addLocalRotation(0, 0, 0, -1, 1, 1, Math.PI / 6);
};

var game = new Game();
game.init();
