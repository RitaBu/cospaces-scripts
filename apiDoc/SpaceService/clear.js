for (var i = 0; i <= 5; i++) {
  Space.createItem('Cube', i / 2, i / 2, i / 2);
}

Space.schedule(function() {
  Space.clear();
}, 2);
