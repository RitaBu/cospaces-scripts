for (var i = 0; i <= 5; i++) {
  Scene.createItem('Cube', i / 2, i / 2, i / 2);
}

Scene.schedule(function() {
  Scene.clear();
}, 2);
