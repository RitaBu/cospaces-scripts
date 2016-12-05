var radius = 5;
var man = Space.createItem('LP_Man', 0, 0, radius);
var woman = Space.createItem('LP_Wom', 1, 1, 1);
var placeholder = Space.createItem("Sphere", 0, 0, 0);
placeholder.setScale(0.5);
placeholder.setColor("Blue");

move();
woman.move(-5, 5);

function randomDirection(){
  return {x: (Math.random() * 2 - 1) * radius, y: (Math.random() * 2 - 1) * radius, z: (Math.random() * 2 - 1) * radius};
}

function move() {
  var pos = randomDirection();
  var posP = man.getPosition();
  placeholder.setPosition(posP.x + pos.x, posP.y + pos.y, posP.z + pos.z);
  man.move(pos.x, pos.y, pos.z, move);
}
