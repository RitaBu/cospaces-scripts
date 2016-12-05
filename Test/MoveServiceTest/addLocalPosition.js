var radius = 5;
var cube = Space.createItem('Cube', 0, 0, 5);
var placeholder = Space.createItem("Sphere", 0, 0, 5);
placeholder.setScale(0.5);
placeholder.setColor("Blue");

Space.scheduleRepeating(move, 2);

function move() {
  var posP = placeholder.getPosition();
  var posC = cube.getPosition();
  cube.addLocalPosition(posP.x - posC.x, posP.y - posC.y, posP.z - posC.z);
  var pos = {x: Math.random() * radius, y: Math.random() * radius, z: Math.random() * radius};
  placeholder.setPosition(pos.x, pos.y, pos.z);
}