var xPos;
var yPos;
var zPos;
var radius = 4;
var theta = 0;
var phi = 0;

Space.scheduleRepeating(function() {
  xPos = radius * Math.sin(theta) * Math.cos(phi);
  yPos = radius * Math.sin(theta) * Math.sin(phi);
  zPos = radius * Math.cos(theta) + 5;

  var sphere = Space.createItem('Sphere', xPos, yPos, zPos);
  sphere.setScale(0.3);

  if (theta > Math.PI) {
    theta = 0;
  }

  if (phi > 2 * Math.PI) {
    phi = 0;
  }

  theta += 0.1;
  phi += 0.1;
}, 0);
