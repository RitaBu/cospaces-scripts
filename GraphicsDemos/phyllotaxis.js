Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

var n = 0; // number of spheres
var c = 0.2;
var angle, radius, xPos, yPos;

Space.scheduleRepeating(function() {
  angle = n * Math.radians(137.5);
  radius = c * Math.sqrt(n);
  xPos = radius * Math.cos(angle);
  yPos = radius * Math.sin(angle);

  var sphere = Space.createItem('Sphere', xPos, yPos, Math.cos(n / 300) + 1);
  sphere.setScale(0.4 * (radius % 2));
  sphere.setColor(n % 256, 255, n * 4 % 256);

  n++;
}, 0);
