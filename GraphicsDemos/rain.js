// Link: https://cospac.es/wAiZ
const drops = [];
const cam = Scene.getCamera();
const isPlayerCam = typeof cam.add !== 'undefined';

const random = (min, max) => Math.random() * (max - min) + min;

const N = 200;
for (let i = 0; i < N; i++) {
  let x, y, z;

  if (isPlayerCam) {
    var camPos = cam.getPosition();
    x = camPos.x + random(-15, 15);
    y = camPos.y + random(-15, 15);
    z = camPos.z + random(1, 12);
  } else {
    x = random(-15, 15);
    y = random(-15, 15);
    z = random(1, 12);
  }

  let drop = Scene.createItem('Cuboid', x, y, z);
  drop.setColor(0, 0, 255);
  drop.setSize(0.005, 0.005, 0.1);
  drop.dz = random(10, 15);
  drops.push(drop);
}

let t = Scene.currentTime();
let t2, dt;

let update = () => {
  t2 = Scene.currentTime();
  dt = t2 - t;
  t = t2;

  for (let i = 0; i < drops.length; i++) {
    camPos = cam.getPosition();

    let drop = drops[i];
    let dropPos = drop.getPosition();

    if (dropPos.z < 0) {
      let x, y, z;

      if (isPlayerCam) {
        x = camPos.x + random(-15, 15);
        y = camPos.y + random(-15, 15);
        z = camPos.z + 12;
      } else {
        x = random(-15, 15);
        y = random(-15, 15);
        z = 12;
      }

      drop.dz = random(10, 15);
      drop.setPosition(x, y, z);
    } else {
      drop.setPosition(dropPos.x + 0.5 * dt, dropPos.y + 0.5 * dt, dropPos.z - drop.dz * dt);
    }
  }

  Scene.schedule(update, 0);
};

update();
