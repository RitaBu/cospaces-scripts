interface Pos {
  x: number;
  y: number;
  z: number;
}

class Helper {
  static randNumBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

class Player {
  private item: ShapeItem;

  constructor() {
    this.item = Space.createItem('LP_Wom', 0, 0, 0);
    this.item.focusOn(true)
  }

  public getItem(): ShapeItem {
    return this.item;
  }

  public getPosition(): Pos {
    return {
      x: this.item.getPosition().x,
      y: this.item.getPosition().y,
      z: this.item.getPosition().z
    }
  }
}

class Enemy {
  protected item: ShapeItem;
  private player: Player;
  private modelId: string;
  private groanSound: Sound;
  private spawnPosZ: number;
  public isKilled: boolean = false;

  constructor(player: Player, modelId: string, groanSound: string, spawnPosZ: number) {
    this.player = player;
    this.modelId = modelId;
    this.groanSound = Space.loadSound(groanSound);
    this.spawnPosZ = spawnPosZ;
    this.spawn();
  }

  public update(): void {
    this.checkLimits();
    this.followPlayer();
  }

  protected spawn(): void {
    let spawnPos = this.getSpawnPos();
    this.item = Space.createItem(this.modelId, spawnPos.x, spawnPos.y, spawnPos.z);
    this.item.faceTo(this.player.getItem());
    this.bindEvents();
  }

  private bindEvents(): void {
    this.item.onActivate(() => {
      this.isKilled = true;
    });
  }

  private getSpawnPos(): Pos {
    let angle: number = Helper.randNumBetween(0, Math.PI * 2);
    let radius: number = 15;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: this.spawnPosZ
    };
  }

  private followPlayer(): void {
    let playerPos: Pos = this.player.getPosition();
    let distanceToPlayer: number = this.item.distanceToItem(this.player.getItem());
    this.item.moveLinear(playerPos.x, playerPos.y, playerPos.z, distanceToPlayer + 1);
  }

  private checkLimits(): void {
    let distanceToPlayer: number = this.item.distanceToItem(this.player.getItem());
    if (distanceToPlayer < 1) {
      this.isKilled = true;
    }
  }

  public remove(): void {
    this.item.deleteFromSpace();
    this.groanSound.play();
  }
}

class Zombie extends Enemy {
  constructor(player: Player) {
    super(
      player,
      '%%370077d9c1b39305ae1b1989393e132e67259707eb06b3c17c5d07802d1e47ea',
      'fa2832d97694e4650c1ecd6e6ade545a3fc41ff82f50d5e8a3a826015034f494',
      0
    );
    this.item.playIdleAnimationWithVelocity('Walk', 3);
  }
}

class Skull extends Enemy {
  constructor(player: Player) {
    super(
      player,
      '%%abaf39a9e30c47b817a9bca6735591c3a840312b9ada82e4a0bb8bcaf36eb5ab',
      '24777a1e286dbcae98d5593fd9c4bc6bbde60dba8a697fea85d94b961feac0a5',
      3
    );
    this.item.playIdleAnimation('Clicking');
  }
}

class Game {
  private player: Player;
  private enemies: Enemy[];
  private earth: GroupItem;
  private music: Sound;
  private backgroundSound: Sound;

  constructor() {
    this.player = new Player();
    this.enemies = [];
    this.earth = Space.getItem('rYDXxZtgpm');
    this.music = Space.loadSound('34yFnUWFVP4i7qWKXoroyieQjZ2eG99e1RAd3wbrxth');
    this.backgroundSound = Space.loadSound('5b5dce36e80b678a17cc5c8cff2a7426f2df55ab2fbc81c64978eb5ed554bfce');
    this.backgroundSound.setVolume(0.3);
  }

  public start(): void {
    this.initEarth();
    this.music.play(true);
    this.backgroundSound.play(true);
    this.spawnEnemies();
    this.update();
  }

  private initEarth(): void {
    this.earth.setPosition(200, 500, 100);
    this.earth.setScale(100);
  }

  private spawnEnemies(): void {
    Space.scheduleRepeating(() => {
      let zombie: Zombie = new Zombie(this.player);
      let skull: Skull = new Skull(this.player);

      this.enemies.push(zombie, skull);
    }, 5);
  }

  private update(): void {
    Space.scheduleRepeating(() => {
      this.enemies.forEach((enemy, index) => {
        enemy.update();
        if (enemy.isKilled) {
          this.enemies.splice(index, 1);
          enemy.remove();
        }
      });
      this.earth.addLocalRotation(0, 0, 0, 0, 0, 1, 0.005);
    }, 0.15);
  }
}

let game: Game = new Game();
game.start();
