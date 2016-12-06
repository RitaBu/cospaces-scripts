function randomVector(radius) {
  var v = {};
  v.x = Math.random() * radius;
  v.y = Math.random() * radius;
  v.z = Math.random() * radius;
  return v;
}

var cube = Space.createItem("Cube", 0, 0, 0);
var vector = Space.createVectorItem(0, 0, 0, 1, 0, 0);
var radius = 5;
var speed = 0.02;
var angle;
var pos = {};
var dir = {};

init();
Space.scheduleRepeating(function () {
  if (angle >= 4 * Math.PI) {
    init();
  }
  cube.addRotation(pos.x, pos.y, pos.z, dir.x, dir.y, dir.z, speed);
  angle += speed;
}, 0);

function init() {
  pos = randomVector(radius);
  pos.z += radius;
  dir = randomVector(1);
  var norm = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
  dir.x /= norm;
  dir.y /= norm;
  dir.z /= norm;
  var posCube = randomVector(radius);
  cube.setPosition(posCube.x, posCube.y, posCube.z + radius);
  vector.deleteFromSpace();
  vector = Space.createVectorItem(pos.x, pos.y, pos.z, dir.x * radius, dir.y * radius, dir.z * radius);
  angle = 0;
}