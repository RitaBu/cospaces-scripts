var cube = Space.createItem('Cube', 0, 0, 0.5);
cube.setScale(3);
cube.say('Hover over me.');

cube.onHover(function(state) {
  if (state) {
    Space.renderShadows(true);
  } else {
    Space.renderShadows(false);
  }
});
