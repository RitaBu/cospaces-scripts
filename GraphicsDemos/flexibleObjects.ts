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
}

/**
 * FlexObject abstract class
 *
 */
abstract class FlexObject {
  item: any;
  pos: Vector3;
  angle: number;
  angleStep: number;
  orbitAngle: number;
  orbitAngleStep: number;
  orbitRadius: number;
  rotationVector: Vector3;
  rotationAngle: number;

  constructor() {
    this.pos = new Vector3(Helper.randNumBetween(-25, 25), Helper.randNumBetween(-25, 25), Helper.randNumBetween(-65, -35));

    this.angle = 0;
    this.angleStep = Helper.randNumBetween(-0.05, 0.05);

    this.orbitAngle = Helper.randNumBetween(0, Math.PI * 2);
    this.orbitAngleStep = Helper.randNumBetween(-0.005, 0.005);
    this.orbitRadius = Helper.randNumBetween(5, 30);

    this.rotationVector = new Vector3(Helper.randNumBetween(-1, 1), Helper.randNumBetween(-1, 1), Helper.randNumBetween(-1, 1));
    this.rotationAngle = Helper.randNumBetween(-0.005, 0.005);
  }

  baseInit(): void {
    this.item.setRandomColor();

    this.item.onActivate(() => {
      this.orbitAngleStep += this.orbitAngleStep;
      this.rotationAngle += 0.05;
    });
  }

  baseUpdate(): void {
    this.angle += this.angleStep;
    this.orbitAngle += this.orbitAngleStep;

    this.pos.x = Math.cos(this.orbitAngle) * this.orbitRadius;
    this.pos.y = Math.sin(this.orbitAngle) * this.orbitRadius;

    this.item.addLocalRotation(0, 0, 0, this.rotationVector.x, this.rotationVector.y, this.rotationVector.z, this.rotationAngle);
  }

  abstract update(): void;

  display(): void {
    this.item.setPosition(this.pos.x, this.pos.y, this.pos.z);
  }
}

/**
 * Frustum wrapper class
 *
 */
class WFrustum extends FlexObject {
  item: Frustum;
  bottomRadiusX: number;
  topRadiusX: number;
  ratio: number;
  height: number;

  constructor() {
    super();
    this.item = Scene.createItem('Frustum', 0, 0, 0) as Frustum;
    this.baseInit();
    this.init();
  }

  init(): void {
    this.item.setVertices(Math.round(Math.random() * 25));
    this.bottomRadiusX = Helper.randNumBetween(0.1, 1.5);
    this.topRadiusX = Helper.randNumBetween(0.1, 1.5);
    this.ratio = Helper.randNumBetween(0.1, 1.5);
    this.height = Helper.randNumBetween(0.5, 2);
  }

  update(): void {
    this.baseUpdate();
    this.item.setSize(
      Math.sin(this.angle) * this.bottomRadiusX + this.bottomRadiusX,
      Math.cos(this.angle) * this.topRadiusX + this.topRadiusX,
      Math.sin(this.angle) * this.ratio + this.ratio,
      Math.cos(this.angle) * this.height + this.height
    );
  }
}

/**
 * Torus wrapper class
 *
 */
class WTorus extends FlexObject {
  item: Torus;
  radius: number;
  tubeRadiusX: number;
  tubeRadiusY: number;
  arc: number;

  constructor() {
    super();
    this.item = Scene.createItem('Torus', 0, 0, 0) as Torus;
    this.baseInit();
    this.init();
  }

  init(): void {
    this.radius = Helper.randNumBetween(1, 2);
    this.tubeRadiusX = Helper.randNumBetween(0.2, 0.6);
    this.tubeRadiusY = Helper.randNumBetween(0.2, 0.6);
    this.arc = Math.PI * 2;
  }

  update(): void {
    this.baseUpdate();
    this.item.setSize(
      Math.sin(this.angle) * this.radius + this.radius,
      Math.cos(this.angle) * this.tubeRadiusX + this.tubeRadiusX,
      Math.cos(this.angle) * this.tubeRadiusY + this.tubeRadiusY,
      this.arc
    );
  }
}

/**
 * Cuboid wrapper class
 *
 */
class WCuboid extends FlexObject {
  item: Cuboid;
  length: number;
  width: number;
  height: number;

  constructor() {
    super();
    this.item = Scene.createItem('Cuboid', 0, 0, 0) as Cuboid;
    this.baseInit();
    this.init();
  }

  init(): void {
    this.length = Helper.randNumBetween(0.1, 2);
    this.width = Helper.randNumBetween(0.1, 2);
    this.height = Helper.randNumBetween(0.1, 2);
  }

  update(): void {
    this.baseUpdate();
    this.item.setSize(
      Math.sin(this.angle) * this.length + this.length,
      Math.cos(this.angle) * this.width + this.width,
      Math.sin(this.angle) * this.height + this.height
    );
  }
}

/**
 * Ellipsoid wrapper class
 *
 */
class WEllipsoid extends FlexObject {
  item: Ellipsoid;
  radiusX: number;
  radiusY: number;
  radiusZ: number;

  constructor() {
    super();
    let itemId = Math.random() > 0.5 ? 'Ellipsoid' : 'Hemiellipsoid';
    this.item = Scene.createItem(itemId, 0, 0, 0) as Ellipsoid;
    this.baseInit();
    this.init();
  }

  init(): void {
    this.radiusX = Helper.randNumBetween(0.5, 1.5);
    this.radiusY = Helper.randNumBetween(0.5, 1.5);
    this.radiusZ = Helper.randNumBetween(0.5, 1.5);
  }

  update(): void {
    this.baseUpdate();
    this.item.setSize(
      Math.sin(this.angle) * this.radiusX + this.radiusX,
      Math.cos(this.angle) * this.radiusY + this.radiusY,
      Math.sin(this.angle) * this.radiusZ + this.radiusZ
    );
  }
}

/**
 * Capsule wrapper class
 *
 */
class WCapsule extends FlexObject {
  item: Capsule;
  radius: number;
  height: number;

  constructor() {
    super();
    this.item = Scene.createItem('Capsule', 0, 0, 0) as Capsule;
    this.baseInit();
    this.init();
  }

  init(): void {
    this.radius = Helper.randNumBetween(0.3, 1);
    this.height = Helper.randNumBetween(0.3, 1);
  }

  update(): void {
    this.baseUpdate();
    this.item.setSize(
      Math.sin(this.angle) * this.radius + this.radius,
      Math.cos(this.angle) * this.height + this.height
    );
  }
}

/**
 * Cylinder wrapper class
 *
 */
class WCylinder extends FlexObject {
  item: Cylinder;
  radiusX: number;
  radiusY: number;
  height: number;

  constructor() {
    super();
    this.item = Scene.createItem('EllipticCylinder', 0, 0, 0) as Cylinder;
    this.baseInit();
    this.init();
  }

  init(): void {
    this.radiusX = Helper.randNumBetween(0.3, 0.7);
    this.radiusY = Helper.randNumBetween(0.3, 0.7);
    this.height = Helper.randNumBetween(0.3, 1.5);
  }

  update(): void {
    this.baseUpdate();
    this.item.setSize(
      Math.sin(this.angle) * this.radiusX + this.radiusX,
      Math.cos(this.angle) * this.radiusY + this.radiusY,
      Math.sin(this.angle) * this.height + this.height
    );
  }
}

/**
 * Cone wrapper class
 *
 */
class WCone extends FlexObject {
  item: Cone;
  radius: number;
  height: number;

  constructor() {
    super();
    this.item = Scene.createItem('Cone', 0, 0, 0) as Cone;
    this.baseInit();
    this.init();
  }

  init(): void {
    this.radius = Helper.randNumBetween(0.3, 0.7);
    this.height = Helper.randNumBetween(0.3, 1.5);
  }

  update(): void {
    this.baseUpdate();
    this.item.setSize(
      Math.sin(this.angle) * this.radius + this.radius,
      Math.cos(this.angle) * this.height + this.height
    );
  }
}

/**
 * ConeFrustum wrapper class
 *
 */
class WConeFrustum extends FlexObject {
  item: ConeFrustum;
  bottomRadius: number;
  topRadius: number;
  height: number;

  constructor() {
    super();
    this.item = Scene.createItem('ConeFrustum', 0, 0, 0) as ConeFrustum;
    this.baseInit();
    this.init();
  }

  init(): void {
    this.bottomRadius = Helper.randNumBetween(0.3, 0.7);
    this.topRadius = Helper.randNumBetween(0.3, 0.7);
    this.height = Helper.randNumBetween(0.3, 1.5);
  }

  update(): void {
    this.baseUpdate();
    this.item.setSize(
      Math.sin(this.angle) * this.bottomRadius + this.bottomRadius,
      Math.cos(this.angle) * this.topRadius + this.topRadius,
      Math.sin(this.angle) * this.height + this.height
    );
  }
}

/**
 * Init demo
 *
 */
let cam = Scene.getCamera();
cam.setPosition(0, 0, -50);

let flexObjs = [];
for (let i = 0; i < 6; i++) {
  flexObjs.push(
    new WFrustum(),
    //new WTorus(), Torus kills performance
    new WCuboid(),
    new WEllipsoid(),
    new WCapsule(),
    new WCylinder(),
    new WCone(),
    new WConeFrustum()
  );
}

Scene.scheduleRepeating(() => {
  flexObjs.forEach((flexObj) => {
    flexObj.update();
    flexObj.display();
  });
}, 0);
