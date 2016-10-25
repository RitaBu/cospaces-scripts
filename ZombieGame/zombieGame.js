/********** Game **********/
function Game(config) {
  this.enemyModelId = config.enemyModelId;
  this.enemyModel2Id = config.enemyModel2Id;
  this.enemySpawnRadius = config.enemySpawnRadius;
  this.enemySpawnInterval = config.enemySpawnInterval;
  this.gameOverScreen = config.gameOverScreen;
  this.playerCanDie = config.playerCanDie;
  this.soundClip = Space.loadSound('lv1Za8SS4reylWHZphWQv9cQTtgUlZ6iG4ukPufcn3Y');
  this.soundZombieHorde = Space.loadSound('CQWfIZ490ULFXefpPefk8z7lVI8XGeF500J7fanjhFl');
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
  Space.loadSound('WJMZhghPfw9hLIG5DC8o0pL9MpXEBxT3UAZl6uo5v2x').play(function() {
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
  this.dyingSound = Space.loadSound('U0dFtDMZdgBrvkfo5TclGdnctnLvuMQDkWeNmBBPPjX');
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
  this.dyingSound = Space.loadSound('PBPyatro1u5omYzzqRI6zukxU5AqP32KqAxsMNDw8E8');
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
  this.painSound = Space.loadSound('Zgx9tDmYMQT4BixMwB1fJAIIcU6dXUESgQHYaKq5vP3');
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
  enemyModelId: '%%8D0CeO2XCxTFbrLZU7gaXyJAovoTp4DOOBZYShmRD2d', // Zombie
  enemyModel2Id: '%%v20E1yKYJwuW0eJnkOKtnQeoo0YPvyRknRPM6frG7IE', // Skull
  enemySpawnRadius: 15,
  enemySpawnInterval: 4,
  gameOverScreen: 'MKjRwIp96ROpe10ifUzHiB8LkTlZndQ660jfDL2EOPA',
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
