function randomVector(radius) {
  var v = {};
  v.x = Math.random() * radius;
  v.y = Math.random() * radius;
  v.z = Math.random() * radius + 5;
  return v;
}

function normalize(v) {
  var norm = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  v.x /= norm;
  v.y /= norm;
  v.z /= norm;
  return v;
}

var cube;
var radius = 5;
var speed = 0.02;
var angle;
var pos;
var dir;

init();
Space.scheduleRepeating(function () {
  if (angle >= 2 * Math.PI) {
    init();
  }
  cube.addRotation(pos.x, pos.y, pos.z, dir.x, dir.y, dir.z, speed);
  angle += speed;
}, 0);

function init(){
  Space.clear();
  pos = randomVector(radius);
  dir = randomVector(1);
  normalize(dir);
  Space.createVectorItem(pos.x, pos.y, pos.z, dir.x, dir.y, dir.z);
  var posCube = randomVector(radius);
  cube = Space.createItem("Cube", posCube.x, posCube.y, posCube.z);
  angle = 0;
}