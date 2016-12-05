var man = Space.createItem('LP_Man', 0, 0, 0);
man.say("Move linear");
var distance = Math.random() * 8 + 2;
var cnt = 0;

turnAndGo();
function turnAndGo() {
  var dir = {};
  dir.x = cnt % 2 === 0 ? 0 : (cnt % 4 === 1 ? 1 : -1);
  dir.y = cnt % 2 === 1 ? 0 : (cnt % 4 === 0 ? 1 : -1);
  dir.z = 0;
  var position = man.getPosition();
  var targetX = position.x + dir.x * distance;
  var targetY = position.y + dir.y * distance;
  var targetZ = position.z + dir.z * distance;
  man.moveLinear(targetX, targetY, targetZ, 1);
  cnt += 1;
  Space.schedule(function () {
    turnAndGo();
  }, 1.5);
}