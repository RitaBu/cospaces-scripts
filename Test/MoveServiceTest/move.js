var radius = 5;
var man = Space.createItem('LP_Man', 0, 0, radius);
var woman = Space.createItem('LP_Wom', 1, 1, 1);

function randomDirection(){
  return {x: (Math.random() * 2 - 1) * radius, y: (Math.random() * 2 - 1) * radius, z: (Math.random() * 2 - 1) * radius};
}

var placeholder = Space.createItem("Sphere", 0, 0, 0);
placeholder.setScale(0.5);
placeholder.setColor("Blue");
function move() {
  var dir = randomDirection();
  var posP = man.getPosition();
  placeholder.setPosition(posP.x + dir.x, posP.y + dir.y, posP.z + dir.z);
  man.move(dir.x, dir.y, dir.z, move);
}
move();


var placeholder2 = Space.createItem("Sphere", 0, 0, 0);
placeholder2.setScale(0.5);
placeholder2.setColor(255, 0, 0);
Space.scheduleRepeating(function () {
  var dir = randomDirection();
  var posP = woman.getPosition();
  placeholder2.setPosition(posP.x + dir.x, posP.y + dir.y, posP.z );
  woman.move(dir.x, dir.y);
}, 5);
