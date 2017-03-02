var cube = Scene.createItem('Cube', 0, 0, 0.5);
cube.setScale(3);
cube.say('Hover over me.');

cube.onHover(function(state) {
  if (state) {
    Scene.renderShadows(true);
  } else {
    Scene.renderShadows(false);
  }
});
