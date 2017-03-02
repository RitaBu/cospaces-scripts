var cube = Scene.createItem('Cube', -3, -3, 0);

Scene.scheduleRepeating(function() {
  cube.addLocalPosition(0.5, 0.3, 0.2);
}, 2);
