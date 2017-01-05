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
 * Player constructor function
 *
 */
function Player() {
  this.startHeight = 1200;
  this.fallSpeed = 0.5;
  this.pos = {
    x: 0,
    y: 0,
    z: this.startHeight
  };
  this.item = Space.createItem('LP_Wom', this.pos.x, this.pos.y, this.pos.z);
  this.hittedGround = false;
  this.soundWindId = 'Qw5olrniAGKQFgJUyIpRWtNNx2awStGtxor7EnBesLz';
  this.soundSplatId = 'KnX0aodGouC3bbuXXLUtUH2MTXHFffYLqaWFC3wi8iW';
  this.soundWind = Space.loadSound(this.soundWindId);
  this.soundSplat = Space.loadSound(this.soundSplatId);
}

Player.prototype.init = function() {
  this.item.focusOn(true);
  this.soundWind.play(true);
};

Player.prototype.update = function() {
  if (!this.hitGround()) {
    var camDirVec = camera.getDirection();
    this.pos.x -= camDirVec.x * 1.5;
    this.pos.y -= camDirVec.y * 1.5;
    this.pos.z -= this.fallSpeed;
    this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
  } else {
    this.soundWind.stop();
    this.soundSplat.play();
    this.hittedGround = true;
  }
};

Player.prototype.hitGround = function() {
  return this.pos.z < 0;
};

/**
 * Gem constructor function
 *
 */
function Gem() {
  this.pos = {
    x: Helper.randNumBetween(-10, 10),
    y: Helper.randNumBetween(-10, 10),
    z: Helper.randNumBetween(100, 900)
  };
  this.item = Space.createItem('LP_Sphere', this.pos.x, this.pos.y, this.pos.z);
  this.item.setColor(255, 255, 0);
  this.item.setScale(6);
  this.soundPickupId = '52OmStfuWCSzWX7Lpr8vY124kv2V1xvg84qsDoSTOga';
  this.soundPickup = Space.loadSound(this.soundPickupId);
}

Gem.prototype.isCollected = function() {
  return this.item.distanceToItem(player.item) < 2;
};

Gem.prototype.remove = function() {
  var index = gems.indexOf(this);
  gems.splice(index, 1);
  this.item.deleteFromSpace();
  this.soundPickup.play();
};

/**
 * Mover constructor function
 *
 */
function Mover(modelId, scale, startPos, dir, speed, soundId) {
  this.item = {};
  this.modelId = modelId;
  this.scale = scale;
  this.pos = startPos;
  this.dir = dir;
  this.speed = speed;
  this.sound = Space.loadSound(soundId);
  this.soundWasPlayed = false;
  this.create();
}

Mover.prototype.create = function() {
  this.item = Space.createItem(this.modelId, this.pos.x, this.pos.y, this.pos.z);
  this.item.setScale(this.scale);
};

Mover.prototype.update = function() {
  this.pos.x += this.dir.x * this.speed;
  this.pos.y += this.dir.y * this.speed;
  this.pos.z += this.dir.z * this.speed;

  this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);

  if (Math.round(this.pos.z) < Math.round(player.pos.z) && Math.round(this.pos.z) > Math.round(player.pos.z) - 150) {
    if (!this.soundWasPlayed) {
      Project.log('test');
      this.sound.play();
      this.soundWasPlayed = true;
    }
  }
};

/**
 * Cloud constructor function
 *
 */
function Cloud() {
  this.modelIds = ['LP_Cloud1', 'LP_Cloud2', 'LP_Cloud3'];
  this.pos = {
    x: Helper.randNumBetween(-150, 150),
    y: Helper.randNumBetween(-150, 150),
    z: Helper.randNumBetween(100, 800)
  };
  this.item = {};
  this.create();
}

Cloud.prototype.create = function() {
  var index = Math.round(Math.random() * 2);
  var scale = Helper.randNumBetween(1, 7);
  var rotation = Helper.randNumBetween(0, Math.PI / 4);
  this.item = Space.createItem(this.modelIds[index], this.pos.x, this.pos.y, this.pos.z);
  this.item.addLocalRotation(0, 0, 0, 0, 0, 1, rotation);
  this.item.setScale(scale);
};

/**
 * Init
 *
 */
var gems = [];
var movers = [];
var camera = Space.getCamera();
var player = new Player();
player.init();

for (var i = 0; i < 5; i++) {
  gems.push(new Gem());
}

for (var j = 0; j < 150; j++) {
  new Cloud();
}

movers.push(
  new Mover('LP_Rocket', 10, {x: 5, y: 5, z: 0}, {x: 0, y: 0, z: 1}, 1, 'uEUPMVTKEyrij4X4ULcqXWqRBnUPSIo5DqKOXXRqbJ6'),
  new Mover('LP_Plane', 20, {x: 0, y: -350, z: 600}, {
    x: 0,
    y: 1,
    z: 0
  }, 0.3, 'FlOjs7Lne0atXQBOz0mpBl5pMdYtByDxw9ipDvjAPfg')
);

Space.scheduleRepeating(function() {
  gems.forEach(function(gem) {
    if (gem.isCollected()) {
      gem.remove();
    }
  });
  movers.forEach(function(mover) {
    mover.update();
  });

  if (!player.hittedGround) {
    player.update();
  }
}, 0);
