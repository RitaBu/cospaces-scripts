var ball = Space.createItem('Sphere', -5, -5, 0);
ball.throwTo(5, 5, 0, 10, function() {
  ball.setColor(255, 0, 0);
});
