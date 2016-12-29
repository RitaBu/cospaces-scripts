function randomPosition() {
  return {x: (Math.random() * 2 - 1) * radius, y: (Math.random() * 2 - 1) * radius, z: Math.random() * 2 * radius};
}

var radius = 5;

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