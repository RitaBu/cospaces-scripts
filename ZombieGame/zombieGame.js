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
 * Player constructor function
 *
 */
function Player() {
  this.item = Space.createItem('LP_Wom', 0, 0, 0);
  this.init();
}

Player.prototype.init = function() {
  this.item.focusOn(true);
};

/**
 * Zombie constructor function
 *
 */
function Zombie() {
  this.item = {};
  this.modelId = '%%370077d9c1b39305ae1b1989393e132e67259707eb06b3c17c5d07802d1e47ea';
  this.groanSound = Space.loadSound('fa2832d97694e4650c1ecd6e6ade545a3fc41ff82f50d5e8a3a826015034f494');
}

Zombie.prototype.bindEvents = function() {
  var self = this;
  this.item.onActivate(function() {
    self.remove();
  });
  return this;
};

Zombie.prototype.getSpawnPos = function() {
  var a = Helper.randNumBetween(0, Math.PI * 2);
  var radius = 15;

  return {
    x: Math.cos(a) * radius,
    y: Math.sin(a) * radius,
    z: 0
  };
};

Zombie.prototype.spawn = function() {
  var spawnPos = this.getSpawnPos();
  this.item = Space.createItem(this.modelId, spawnPos.x, spawnPos.y, spawnPos.z);
  this.item.faceTo(player.item);
  this.item.playIdleAnimation('Walk');
  return this;
};

Zombie.prototype.followPlayer = function() {
  var playerPos = player.item.getPosition();
  var distanceToPlayer = this.item.distanceToItem(player.item);
  this.item.moveLinear(playerPos.x, playerPos.y, playerPos.z, distanceToPlayer + 0.5);
  return this;
};

Zombie.prototype.checkLimits = function() {
  var distanceToPlayer = this.item.distanceToItem(player.item);
  if (distanceToPlayer < 1) {
    this.remove();
  }
  return this;
};

Zombie.prototype.remove = function() {
  this.groanSound.play();
  var index = enemies.indexOf(this);
  enemies.splice(index, 1);
  this.item.deleteFromSpace();
};

/**
 * Skull constructor function
 *
 */
function Skull() {
  this.item = {};
  this.modelId = '%%abaf39a9e30c47b817a9bca6735591c3a840312b9ada82e4a0bb8bcaf36eb5ab';
  this.groanSound = Space.loadSound('24777a1e286dbcae98d5593fd9c4bc6bbde60dba8a697fea85d94b961feac0a5');
}

Helper.inheritsFrom(Skull, Zombie);

Skull.prototype.spawn = function() {
  var spawnPos = this.getSpawnPos();
  this.item = Space.createItem(this.modelId, spawnPos.x, spawnPos.y, 3);
  this.item.faceTo(player.item);
  this.item.playIdleAnimation('Clicking');
  return this;
};

/**
 * Init
 *
 */
Space.loadSound('fd41215166bfb85049288d7c3d1cc4db68e8af0f805b0a5a9a36059a26adb3d3').play(true);
Space.loadSound('5b5dce36e80b678a17cc5c8cff2a7426f2df55ab2fbc81c64978eb5ed554bfce').play(true);

var player = new Player();
var enemies = [];
var mood = 1;

Space.scheduleRepeating(function() {
  enemies.forEach(function(enemy) {
    enemy.followPlayer().checkLimits();
  });

  if (mood > 0) {
    mood -= 0.001;
    Space.setMood(mood);
  }
}, 1 / 15);

Space.scheduleRepeating(function() {
  var zombie = new Zombie();
  var skull = new Skull();

  zombie.spawn().bindEvents();
  skull.spawn().bindEvents();

  enemies.push(zombie, skull);
}, 5);
