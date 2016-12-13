//test "moveLinear" and "rotate" animations

var man = Space.createItem('LP_Man', 0, 0, 0);
man.say("moveLinear");
var cnt = 0;

go();
function turn() {
  man.rotate(0, 0, 1, Math.PI * 0.5, 2, go);
}
function go() {
  if (cnt % 4 === 0) {
    distance = Math.random() * 8 + 2;
  }
  var dir = {};
  dir.x = cnt % 2 === 0 ? 0 : (cnt % 4 === 1 ? 1 : -1);
  dir.y = cnt % 2 === 1 ? 0 : (cnt % 4 === 0 ? 1 : -1);
  dir.z = 0;
  var position = man.getPosition();
  var targetX = position.x + dir.x * distance;
  var targetY = position.y + dir.y * distance;
  var targetZ = position.z;
  cnt += 1;
  man.moveLinear(targetX, targetY, targetZ, 1.5, turn);
}