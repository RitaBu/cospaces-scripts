var cube = Space.createItem('Cube', 2, -2, 1);

Space.scheduleRepeating(function() {
  cube.addLocalRotation(0, 0, 0, 1, 1, 1, 0.01);
}, 0);
