function randomPosition() {
  return {x: (Math.random() * 2 - 1) * radius, y: (Math.random() * 2 - 1) * radius, z: Math.random() * 2 * radius};
}

var radius = 5;

var woman = Space.createItem('LP_Wom', 0, 0, radius);
var target2 = Space.createItem("Sphere", 0, 0, 0);
target2.setScale(0.5);
target2.setColor(255, 0, 0);

moveToObj();
function moveToObj() {
  var pos = randomPosition();
  target2.setPosition(pos.x, pos.y, pos.z);
  woman.say('moveBezierToObj');
  woman.moveBezierToObj(target2, '', radius / 2, function() {
    woman.say('rotateLocal');
    woman.rotateLocal(0, 1, 0, Math.PI * 0.25 * (1 + Math.random()), 1, moveToObj);
  });
}