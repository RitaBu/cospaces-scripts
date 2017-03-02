// vector
var v = {
  // initial point
  xPos: 0,
  yPos: 0,
  zPos: 0,
  // terminal point
  xDir: 0,
  yDir: 0,
  zDir: 1
};

var cube = Scene.createItem('Cube', 1, 0, 0);

Scene.scheduleRepeating(function() {
  cube.addRotation(v.xPos, v.yPos, v.zPos, v.xDir, v.yDir, v.zDir, 0.01);
}, 0);
