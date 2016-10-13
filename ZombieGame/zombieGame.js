/*
 * Game
 */
function Game(config) {
  this.enemyModelId = config.enemyModelId;
  this.enemySpawnRadius = config.enemySpawnRadius;
  this.enemySpawnInterval = config.enemySpawnInterval;
  this.soundClip = Space.loadSound('fd41215166bfb85049288d7c3d1cc4db68e8af0f805b0a5a9a36059a26adb3d3');
  this.soundZombieHorde = Space.loadSound('5b5dce36e80b678a17cc5c8cff2a7426f2df55ab2fbc81c64978eb5ed554bfce');
  this.soundZombieDies = Space.loadSound('fa2832d97694e4650c1ecd6e6ade545a3fc41ff82f50d5e8a3a826015034f494');
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

Game.prototype.spawnEnemy = function() {
  var pos = this.generateEnemySpawnPos(this.enemySpawnRadius);
  var newEnemy = new Enemy(Space.createItem(game.enemyModelId, pos.x, pos.y, 0), this.enemyIdCounter);
  newEnemy.initAttack();
  newEnemy.gameItem.onActivate(function() {
    game.player.killEnemy(newEnemy);
  });
  this.enemies.push(newEnemy);
  Project.log(this.enemies);
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

/*
 * Enemy
 */
function Enemy(gameItem, id) {
  this.gameItem = gameItem;
  this.id = id;
}

Enemy.prototype.initAttack = function() {
  this.gameItem.moveToItem(game.player.gameItem, this.gameItem.distanceToItem(game.player.gameItem));
  this.gameItem.playIdleAnimation('Walk');
};

Enemy.prototype.followPlayer = function() {
  this.gameItem.moveToItem(game.player.gameItem, this.gameItem.distanceToItem(game.player.gameItem));
};

/*
 * Player
 */
function Player(gameItem) {
  this.gameItem = gameItem;
  this.points = 0;
}

Player.prototype.killEnemy = function(enemy) {
  this.points++;
  game.soundZombieDies.play();
  enemy.gameItem.deleteFromSpace();

  var index = game.enemies.indexOf(enemy);
  if (index !== -1) {
    game.enemies.splice(index, 1);
  }
};

/*
 * Init
 */
var gameConfig = {
  enemyModelId: '%%370077d9c1b39305ae1b1989393e132e67259707eb06b3c17c5d07802d1e47ea',
  enemySpawnRadius: 15,
  enemySpawnInterval: 3
};
var game = new Game(gameConfig);
game.playMusic();

game.spawnPlayerAt(0, 0);
game.player.gameItem.focusOn(true);

Space.scheduleRepeating(function() {
  game.spawnEnemy();
  game.enemies.forEach(function(enemy) {
    enemy.followPlayer();
  });
}, game.enemySpawnInterval);
