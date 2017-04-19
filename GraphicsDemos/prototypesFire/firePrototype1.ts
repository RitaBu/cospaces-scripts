// Project location: https://cospac.es/2OhZ

/**
 * Helper class
 *
 */
class Helper {
  static randNumBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

/**
 * Vector3 class
 *
 */
class Vector3 {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v: Vector3): void {
    this.x = this.x + v.x;
    this.y = this.y + v.y;
    this.z = this.z + v.z;
  }

  sub(v: Vector3): void {
    this.x = this.x - v.x;
    this.y = this.y - v.y;
    this.z = this.z - v.z;
  }

  static sub(v1, v2): Vector3 {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  mult(s: number): void {
    this.x = this.x * s;
    this.y = this.y * s;
    this.z = this.z * s;
  }

  div(d: number): void {
    this.x = this.x / d;
    this.y = this.y / d;
    this.z = this.z / d;
  }

  static div(v, d): Vector3 {
    return new Vector3(v.x / d, v.y / d, v.z / d);
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): void {
    let mag = this.mag();
    this.x = this.x / mag;
    this.y = this.y / mag;
    this.z = this.z / mag;
  }

  limit(l: number): void {
    if (this.mag() > l) {
      this.normalize();
      this.mult(l);
    }
  }
}

/**
 * Mover abstract class
 *
 */
abstract class Mover {
  itemId: string;
  item: ShapeItem;
  pos: Vector3;
  acc: Vector3;
  vel: Vector3;

  init(): void {
  };

  update(): void {
  };

  display(): void {
    this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
  }
}

/**
 * Flame class
 *
 */
class Flame extends Mover {
  scale: number;
  mass: number;
  decreaseFactor: number;
  rotationAngle: number;
  flameAttractionAngle: number;
  flameAttractor: Vector3;

  constructor() {
    super();
    this.init();
  }

  init(): void {
    this.itemId = Helper.randNumBetween(-1, 1) < 0 ? '%%VoEz1mRKrxjBt5WzYrSiWRNoJTGYvpH0aDbxQfekurr' : '%%mAZAt2s1pbDTSSn88ZpYm41YApvg04FCa0dDIbaFYYv';
    this.item = Scene.createItem(this.itemId, 0, 0, 0);
    this.item.setPhongParameters(4, 0, 0, 0);

    this.scale = Helper.randNumBetween(0, 5);
    this.mass = this.scale;
    this.item.setScale(this.scale);

    this.item.addLocalRotation(0, 0, 0, Math.random(), Math.random(), Math.random(), Math.random() * Math.PI * 2);
    this.pos = new Vector3(Helper.randNumBetween(-0.7, 0.7), Helper.randNumBetween(-0.7, 0.7), Helper.randNumBetween(-1, 1));
    this.vel = new Vector3(0, 0, 0);
    this.acc = new Vector3(0, 0, 0);

    this.decreaseFactor = 0.07;
    this.rotationAngle = 0;
    this.flameAttractionAngle = 0;
    this.flameAttractor = new Vector3(0, 0, 0);

    this.setInitialColor();
  }

  update(): void {
    this.mass -= this.decreaseFactor;

    this.scale -= this.decreaseFactor;
    this.item.setScale(this.scale);

    this.rotationAngle += 0.0005;
    this.item.addLocalRotation(0, 0, 0, 1, 1, 1, this.rotationAngle);

    this.acc.set(0, 0, 0.0003);

    this.flameAttractionAngle += 0.01;
    this.flameAttractor.set(Math.sin(this.flameAttractionAngle), Math.cos(this.flameAttractionAngle), 1.5);
    let flameAttractionForce = Vector3.sub(this.flameAttractor, this.pos);
    flameAttractionForce.div(8000);
    this.acc.add(flameAttractionForce);

    //this.applyForce(wind);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  setInitialColor(): void {
    let radius = Math.sqrt(this.pos.x * this.pos.x + this.pos.y * this.pos.y);
    if (radius > 0.7) {
      this.item.setColor(231, 57, 0);
    } else {
      this.item.setColor(231, 225, 0);
    }
  }

  applyForce(force: Vector3): void {
    force.div(this.mass);
    this.acc.add(force);
  }

  reset(): void {
    this.scale = Helper.randNumBetween(5, 8);
    this.mass = this.scale;
    this.pos.set(Helper.randNumBetween(-0.7, 0.7), Helper.randNumBetween(-0.7, 0.7), -1);
    this.vel.set(0, 0, 0);
    this.rotationAngle = 0;
  }

  checkLimits(): void {
    if (this.scale < 0) {
      this.reset();
    }
  }
}

class Fire {
  flames: Flame[] = [];
  flamesNum: number = 150;

  constructor() {
    this.init();
    this.update();
  }

  init(): void {
    for (let i = 0; i < this.flamesNum; i++) {
      this.flames.push(new Flame());
    }
  }

  update(): void {
    Scene.scheduleRepeating(() => {
      for (let i = 0; i < this.flames.length; i++) {
        this.flames[i].checkLimits();
        this.flames[i].update();
        this.flames[i].display();
      }
    }, 0);
  }
}

let firePlace = new Fire();
