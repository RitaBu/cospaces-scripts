var cube = Scene.createItem('Cube', 2, -2, 1);

Scene.scheduleRepeating(function() {
  cube.addLocalRotation(0, 0, 0, 1, 1, 1, 0.01);
}, 0);
