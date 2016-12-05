function randomVector(radius) {
  var v = {};
  v.x = Math.random() * radius;
  v.y = Math.random() * radius;
  v.z = Math.random() * radius + 5;
  return v;
}
var radius = 5;

var cube = Space.createItem('Cube', -3, -3, 0);

Space.scheduleRepeating(function () {
  var pos = cube.getPosition();
  var d = {x: Math.random() * radius, y: Math.random() * radius, z: Math.random() * radius};
  cube.addLocalPosition(d.x, d.y, d.z);
}, 2);
