var lion = Space.createItem('LP_Lion', 0, 0, 0);

Space.scheduleRepeating(function() {
  lion.setRandomColor();
}, 0.1);
