var radius = 5;
var pause = 2;
function randomAxis() {
  var axis = {x: Math.random(), y: Math.random(), z: Math.random()};
  var norm = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
  axis.x /= norm;
  axis.y /= norm;
  axis.z /= norm;
  return axis;
}

var man = Space.createItem('LP_Man', 0, 0, 4);
var transparent = Space.createItem('LP_Man', 0, 0, 4);
transparent.setOpacity(0.2);
var pos = man.getPosition();
var vector = Space.createVectorItem(0, 0, 0, 1, 0, 0);

rotate();
function rotate() {
  var angle = Math.random() * Math.PI * 4 - Math.PI * 2;
  var axis = randomAxis();
  vector.deleteFromSpace();
  vector = Space.createVectorItem(pos.x, pos.y, pos.z, axis.x, axis.y, axis.z);
  transparent.addRotation(pos.x, pos.y, pos.z, axis.x, axis.y, axis.z, angle);
  man.say("angle: " + angle * (180 / Math.PI));
  man.rotate(axis.x, axis.y, axis.z, angle, Math.abs(angle * 2), function(){
    Space.schedule(rotate, pause);
  });
}