var cube1 = Space.createItem("Cube", 0, 0, 0);
var cube2 = Space.createItem("Cube", 0, 0, 0.5);
var cube3 = Space.createItem("Cube", 0, 0, 1);

Space.scheduleRepeating(function () {
  cube1.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
  cube2.addLocalRotation(0, 0, 0, 0, 0, 1, -Math.PI / 100);
  cube3.addLocalRotation(0, 0, 0, 0, 0, 1, 0);
}, 0);

var cube = Space.createItem('Cube', 2, -2, 1);
Space.createVectorItem(1, -3, 0, 3, 3, 3);
Space.scheduleRepeating(function () {
  cube.addLocalRotation(0, 0, 0, 1, 1, 1, 0.01);
}, 0);