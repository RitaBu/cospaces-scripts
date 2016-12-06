/*
 * height must be bigger than zPos !and! the current z position
 * */

var radius = 10;
var ball = Space.createItem('Sphere', 0, 0, 0);
var vector = Space.createVectorItem(0, 0, 0, 0, 0, 1);

throwBall();
function throwBall() {
  var xPos = (Math.random() * 2 - 1) * radius;
  var yPos = (Math.random() * 2 - 1) * radius;
  var zPos = Math.random() * radius;
  var z = ball.getPosition().z;
  var height = Math.random() * radius / 2 + Math.max(zPos, z);
  vector.deleteFromSpace();
  var pos = ball.getPosition();
  vector = Space.createVectorItem(pos.x, pos.y, pos.z, xPos - pos.x, yPos - pos.y, zPos - pos.z);
  ball.throwTo(xPos, yPos, zPos, height, function () {
    Space.schedule(throwBall, 2);
  });
}