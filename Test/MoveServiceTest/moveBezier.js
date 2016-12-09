var num = 8;
var radius = 10;
var vel = 3;
var line = Space.createCurveItem();

for (var i = 0; i < num; i++) {
  var dir = {
    x: (Math.random() * 2 - 1),
    y: (Math.random() * 2 - 1),
    z: (Math.random() * 2 - 1)
  };
  var pos = {
    x: (Math.random() * 2 - 1) * radius,
    y: (Math.random() * 2 - 1) * radius,
    z: (Math.random() + 1) * radius
  };
  var v = Space.createVectorItem(pos.x, pos.y, pos.z, dir.x, dir.y, dir.z);
  line.addVertex(v.id());
}

var item = Space.createItem("LP_Lion", 0, 0, 0);
item.say('moveBezier(lineId, v, repeat)');
item.moveBezier(line.id(), vel, true);