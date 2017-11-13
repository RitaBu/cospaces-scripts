// Link: https://cospac.es/uhLm

let snowflakes = [];
let cam = Scene.getCamera();
let camPos = cam.getPosition();
let isPlayerCam = typeof cam.add !== 'undefined';

let random = (min, max) => Math.random() * (max - min) + min;

for (let i = 0; i < 200; i++) {
  let x, y, z;

  if (isPlayerCam) {
    x = camPos.x + random(-15, 15);
    y = camPos.y + random(-15, 15);
    z = camPos.z + random(1, 12);
  } else {
    x = random(-15, 15);
    y = random(-15, 15);
    z = random(1, 12);
  }

  let flake = Scene.createItem('LP_Cube', x, y, z);
  flake.setColor(255, 255, 255);
  flake.setScale(0.03);
  snowflakes.push(flake);
}

Scene.scheduleRepeating(() => {
  for (let i = 0; i < snowflakes.length; i++) {
    camPos = cam.getPosition();

    let flake = snowflakes[i];
    let flakePos = flake.getPosition();

    if (flakePos.z < 0) {
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

      flake.setPosition(x, y, z);
    } else {
      flake.setPosition(flakePos.x + 0.004, flakePos.y + 0.004, flakePos.z - 0.05);
    }
  }
}, 0);
