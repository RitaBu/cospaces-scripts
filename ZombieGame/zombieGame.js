/********** Game **********/
function Game(config) {
  this.enemyModelId = config.enemyModelId;
  this.enemyModel2Id = config.enemyModel2Id;
  this.enemySpawnRadius = config.enemySpawnRadius;
  this.enemySpawnInterval = config.enemySpawnInterval;
  this.mood = config.mood;
  this.soundClip = Space.loadSound('fd41215166bfb85049288d7c3d1cc4db68e8af0f805b0a5a9a36059a26adb3d3');
  this.soundZombieHorde = Space.loadSound('5b5dce36e80b678a17cc5c8cff2a7426f2df55ab2fbc81c64978eb5ed554bfce');
  this.soundZombieDies = Space.loadSound('fa2832d97694e4650c1ecd6e6ade545a3fc41ff82f50d5e8a3a826015034f494');
  this.soundSkullDies = Space.loadSound('24777a1e286dbcae98d5593fd9c4bc6bbde60dba8a697fea85d94b961feac0a5');
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
  this.player = new Player(Space.createItem('LP_Wom', xPos, yPos, 0));
};

Game.prototype.spawnEnemy = function(enemyType) {
  var posZ = 0;
  var enemyModelId = game.enemyModelId;

  if (enemyType === 'flying') {
    posZ = Math.random() * (4 - 1) + 1;
    enemyModelId = game.enemyModel2Id;
  }

  var pos = this.generateEnemySpawnPos(this.enemySpawnRadius);
  var newEnemy = new Enemy(Space.createItem(enemyModelId, pos.x, pos.y, posZ), this.enemyIdCounter);

  newEnemy.initAttack(enemyType);
  newEnemy.gameItem.onActivate(function() {
    game.player.killEnemy(newEnemy, enemyType);
  });

  this.enemies.push(newEnemy);
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

/********** Enemy **********/
function Enemy(gameItem, id) {
  this.gameItem = gameItem;
  this.id = id;
}

Enemy.prototype.initAttack = function(enemyType) {
  if (enemyType === 'flying') {
    this.gameItem.playIdleAnimation('Clicking');
  } else {
    this.gameItem.playIdleAnimation('Walk');
  }

  this.gameItem.flyLikeButterflyTo(game.player.gameItem.getPosition().x, game.player.gameItem.getPosition().y, 0);
};

Enemy.prototype.followPlayer = function() {
  this.gameItem.moveToItem(game.player.gameItem, this.gameItem.distanceToItem(game.player.gameItem));
}

/********** Player **********/
function Player(gameItem) {
  this.gameItem = gameItem;
  this.points = 0;
}

Player.prototype.killEnemy = function(enemy, enemyType) {
  this.points++;

  if (enemyType === 'flying') {
    game.soundSkullDies.play();
  } else {
    game.soundZombieDies.play();
  }
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
  enemySpawnRadius: 15,
  enemySpawnInterval: 2.5,
  mood: 1
};
var game = new Game(gameConfig);
game.playMusic();
Space.setMood(game.mood);

game.spawnPlayerAt(0, 0);
game.player.gameItem.focusOn(true);

var enemyType = 'running';
Space.scheduleRepeating(function() {
  if (enemyType === 'flying') {
    enemyType = 'running';
  } else {
    enemyType = 'flying';
  }

  game.spawnEnemy(enemyType);
  game.enemies.forEach(function(enemy) {
    enemy.followPlayer();
  });
}, game.enemySpawnInterval);

Space.scheduleRepeating(function() {
  game.mood -= 0.001;
  Space.setMood(game.mood);
}, 1 / 15);
