var cube = Space.createItem('Cube', -3, -3, 0);

Space.scheduleRepeating(function() {
  cube.addLocalPosition(0.5, 0.3, 0.2);
}, 2);
