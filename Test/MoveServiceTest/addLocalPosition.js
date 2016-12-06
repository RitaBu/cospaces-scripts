var radius = 5;
var cube = Space.createItem('Cube', 0, 0, 5);
var vector;
var dir;
var cnt = 0;

Space.scheduleRepeating(move, 1);

function move() {
  var posC = cube.getPosition();
  if (cnt % 3 === 0) {
    dir = {
      x: (Math.random() * 2 - 1) * radius,
      y: (Math.random() * 2 - 1) * radius,
      z: (Math.random() * 2 - 1) * radius
    };
    vector = Space.createVectorItem(posC.x, posC.y, posC.z, dir.x, dir.y, dir.z);
  }
  else if (cnt % 3 === 1) {
    cube.addLocalPosition(dir.x, dir.y, dir.z);
  }
  else if (cnt % 3 === 2) {
    vector.deleteFromSpace();
  }
  cnt += 1;
}