/********** Game **********/
function Game(config) {
  this.enemyModelId = config.enemyModelId;
  this.enemyModel2Id = config.enemyModel2Id;
  this.enemySpawnRadius = config.enemySpawnRadius;
  this.enemySpawnInterval = config.enemySpawnInterval;
  this.gameOverScreen = config.gameOverScreen;
  this.playerCanDie = config.playerCanDie;
  this.soundClip = Space.loadSound('fd41215166bfb85049288d7c3d1cc4db68e8af0f805b0a5a9a36059a26adb3d3');
  this.soundZombieHorde = Space.loadSound('5b5dce36e80b678a17cc5c8cff2a7426f2df55ab2fbc81c64978eb5ed554bfce');
  this.player = {};
  this.enemies = [];
  this.enemyIdCounter = 0;
}

Game.prototype.playMusic = function() {
  this.soundClip.play(true);
  this.soundZombieHorde.setVolume(0.2);
  this.soundZombieHorde.play(true);
};

Game.prototype.spawnPlayerAt = function(xPos, yPos) {
  this.player = new Player(Space.createItem('LP_Man', xPos, yPos, 0), 10);
};

Game.prototype.playGameOverSequence = function() {
  this.player.gameItem.setPosition(this.player.gameItem.getPosition().x, this.player.gameItem.getPosition().y, -1.4, true);
  this.player.painSound.setVolume(0);
  this.soundClip.stop();
  this.soundZombieHorde.stop();
  Space.loadSound('8b5576a0df805516753735e697a2797a8df7526c9f842d124b1a503e84fdcdc8').play(function() {
    Project.finishPlayMode(game.gameOverScreen);
  });
};

Game.prototype.spawnZombie = function() {
  var posXY = this.generateEnemySpawnPos(this.enemySpawnRadius);
  var posZ = 0;

  var newZombie = new Zombie(Space.createItem(this.enemyModelId, posXY.x, posXY.y, posZ), this.enemyIdCounter, 'zombie');
  newZombie.initAttack();

  newZombie.gameItem.onActivate(function() {
    game.player.killEnemy(newZombie);
  });

  this.enemies.push(newZombie);
  this.enemyIdCounter++;
};

Game.prototype.spawnSkull = function() {
  var posXY = this.generateEnemySpawnPos(this.enemySpawnRadius);
  var posZ = Math.random() * (4 - 1) + 1;

  var newSkull = new Skull(Space.createItem(this.enemyModel2Id, posXY.x, posXY.y, posZ), this.enemyIdCounter, 'skull');
  newSkull.initAttack();

  newSkull.gameItem.onActivate(function() {
    game.player.killEnemy(newSkull);
  });

  this.enemies.push(newSkull);
  this.enemyIdCounter++;
};

Game.prototype.generateEnemySpawnPos = function(radius) {
  var a = Math.random() * (2 * Math.PI);
  var cx = 0;
  var cy = 0;

  var xPos = cx + radius * Math.cos(a);
  var yPos = cy + radius * Math.sin(a);

  return {
    x: xPos,
    y: yPos
  };
};

/********** Zombie **********/
function Zombie(gameItem, id, type) {
  this.gameItem = gameItem;
  this.id = id;
  this.type = type;
  this.dyingSound = Space.loadSound('fa2832d97694e4650c1ecd6e6ade545a3fc41ff82f50d5e8a3a826015034f494');
}

Zombie.prototype.initAttack = function() {
  this.gameItem.playIdleAnimation('Walk');
  this.gameItem.moveToItem(game.player.gameItem, this.gameItem.distanceToItem(game.player.gameItem));
};

Zombie.prototype.followPlayer = function() {
  this.gameItem.moveToItem(game.player.gameItem, this.gameItem.distanceToItem(game.player.gameItem) - 1.5);
};

Zombie.prototype.hurtPlayer = function() {
  if (this.gameItem.distanceToItem(game.player.gameItem) < 2) {
    game.player.painSound.play();
    game.player.hp--;
  }
};

/********** Skull **********/
function Skull(gameItem, id, type) {
  this.gameItem = gameItem;
  this.id = id;
  this.type = type;
  this.velocity = Math.random() * (2.5 - 0.5) + 0.5;
  this.dyingSound = Space.loadSound('24777a1e286dbcae98d5593fd9c4bc6bbde60dba8a697fea85d94b961feac0a5');
}

Skull.prototype.initAttack = function() {
  this.gameItem.playIdleAnimation('Clicking');
  this.gameItem.moveBezierTo(game.player.gameItem.getPosition().x, game.player.gameItem.getPosition().y, 1, this.velocity);
};

Skull.prototype.followPlayer = function() {
  this.gameItem.moveBezierTo(game.player.gameItem.getPosition().x, game.player.gameItem.getPosition().y, 1, this.velocity);
};

Skull.prototype.hurtPlayer = function() {
  if (this.gameItem.distanceToItem(game.player.gameItem) < 2) {
    game.player.painSound.play();
    game.player.hp--;
  }
};

/********** Player **********/
function Player(gameItem, healthPoints) {
  this.gameItem = gameItem;
  this.hp = healthPoints;
  this.points = 0;
  this.painSound = Space.loadSound('10277c4d0da546c233ee3f8474cda452b786dc358455ae7aaec445b480062ac9');
}

Player.prototype.killEnemy = function(enemy) {
  this.points++;
  enemy.dyingSound.play();
  enemy.gameItem.deleteFromSpace();

  var index = game.enemies.indexOf(enemy);
  if (index !== -1) {
    game.enemies.splice(index, 1);
  }
};

/********** Init **********/
Space.clear();

var gameConfig = {
  enemyModelId: '%%370077d9c1b39305ae1b1989393e132e67259707eb06b3c17c5d07802d1e47ea', // Zombie
  enemyModel2Id: '%%abaf39a9e30c47b817a9bca6735591c3a840312b9ada82e4a0bb8bcaf36eb5ab', // Skull
  enemySpawnRadius: 13,
  enemySpawnInterval: 4,
  gameOverScreen: '9b56e2de6c325c7bc4698dd9b34c24013a7f62edd114541ce1991d7399ad3038',
  playerCanDie: false
};
var game = new Game(gameConfig);
game.playMusic();

game.spawnPlayerAt(0, 0);
game.player.gameItem.focusOn(true);

Space.scheduleRepeating(function() {
  game.spawnZombie();
  game.spawnSkull();
  game.enemies.forEach(function(enemy) {
    enemy.followPlayer();
  });
}, game.enemySpawnInterval);

Space.scheduleRepeating(function() {
  game.enemies.forEach(function(enemy) {
    if (game.playerCanDie) {
      enemy.hurtPlayer();
    }
    if (game.player.hp === 0) {
      game.playGameOverSequence();
    }
  });
}, 1.5);

var mood = 1;
Space.setMood(mood);
Space.scheduleRepeating(function() {
  mood -= 0.001;
  Space.setMood(mood);
}, 1 / 15);
