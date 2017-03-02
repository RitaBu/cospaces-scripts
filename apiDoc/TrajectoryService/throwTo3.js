var balls = [];
for(var i = 0; i < 5; i++) {
  balls.push(Scene.createItem('Sphere', i, i, 0));
}

Scene.scheduleRepeating(function() {
  balls.forEach(function(ball) {
    var xPos = Math.random() * 10 - 10;
    var yPos = Math.random() * 10 - 10;
    var zPos = 0;
    var height = Math.random() * 5 + 1;

    ball.throwTo(xPos, yPos, zPos, height);
  });
}, 4);
