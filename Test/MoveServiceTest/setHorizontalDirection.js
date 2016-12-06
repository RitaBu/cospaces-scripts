var lion = Space.createItem('LP_Lion', 2, 2, 2);
var vector = Space.createVectorItem(0, 0, 0, 1, 0, 0);

var angle = 0;
var radius = 5;
var dAngle = Math.PI / 10;

Space.scheduleRepeating(function () {
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);
  vector.deleteFromSpace();
  vector = Space.createVectorItem(2, 2, 2, cos * radius, sin * radius, 0);
  var r = Math.random() * radius;
  lion.setHorizontalDirection(cos * r, sin * r, 0);
  angle += dAngle;
}, 0.5);
