var radius = 5;
var man = Space.createItem('LP_Man', 0, 0, radius);
var woman = Space.createItem('LP_Wom', 0, 0, 1);
var placeholder = Space.createItem("Sphere", 0, 0, 0);
placeholder.setScale(0.5);
placeholder.setColor("Blue");

move();
woman.moveTo(-5, 5);

function randomPosition(){
  return {x: (Math.random() * 2 - 1) * radius, y: (Math.random() * 2 - 1) * radius, z: Math.random() * 2 * radius};
}

function move() {
  var pos = randomPosition();
  placeholder.setPosition(pos.x, pos.y, pos.z);
  man.moveTo(pos.x, pos.y, pos.z, move);
}
