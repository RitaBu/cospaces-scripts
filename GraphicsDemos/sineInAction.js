function Cube(xPos, yPos, zPos) {
  this.item = Scene.createItem('Cube', xPos, yPos, zPos);
  this.xPos = xPos;
  this.yPos = yPos;
  this.zPos = zPos;
}

Cube.prototype.setPosition = function(xPos, yPos, zPos) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.zPos = zPos;
  this.updatePosition();
};

Cube.prototype.updatePosition = function() {
  this.item.setPosition(this.xPos, this.yPos, this.zPos);
};

var cubes = [];
for (var i = 0; i < 40; i++) {
  for (var j = 0; j < 40; j++) {
    cubes.push(new Cube((i - 20) / 2, (j - 20) / 2, 0));
  }
}

var radians = 0;
Scene.scheduleRepeating(function() {
  cubes.forEach(function(cube) {
    cube.setPosition(cube.xPos, cube.yPos, Math.sin(radians + cube.xPos / 5 + cube.yPos / 5) + 3);
    cube.item.setScale(cube.zPos / 4);
  });
  radians += 0.05;
}, 0);

