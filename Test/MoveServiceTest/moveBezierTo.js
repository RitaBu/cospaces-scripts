function randomPosition() {
  return {x: (Math.random() * 2 - 1) * radius, y: (Math.random() * 2 - 1) * radius, z: Math.random() * 2 * radius};
}

var radius = 5;

var man = Space.createItem('LP_Man', 0, 0, radius);
man.say('moveBezierTo');
var target = Space.createItem("Sphere", 0, 0, 0);
target.setScale(0.5);
target.setColor(0, 0, 255);

moveTo();
function moveTo() {
  var pos = randomPosition();
  target.setPosition(pos.x, pos.y, pos.z);
  man.moveBezierTo(pos.x, pos.y, pos.z, radius / 2, moveTo);
}

var woman = Space.createItem('LP_Wom', 0, 0, radius);
woman.say('moveBezierToObj');
var target2 = Space.createItem("Sphere", 0, 0, 0);
target2.setScale(0.5);
target2.setColor(255, 0, 0);

moveToObj();
function moveToObj() {
  var pos = randomPosition();
  target2.setPosition(pos.x, pos.y, pos.z);
  woman.moveBezierToObj(target2, '', radius / 2, moveToObj);
}