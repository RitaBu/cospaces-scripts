DX.items().forEach(function(item) {
  item.remove();
});

function norm(vec){
  var n = [];
  var len = sqrtOfSumSqr(vec);
  n[0] = vec[0] / len;
  n[1] = vec[1] / len;
  n[2] = vec[2] / len;
  return n;
}

function sqrtOfSumSqr(point) {
  return Math.sqrt(point[0] * point[0] + point[1] * point[1] + point[2] * point[2]);
}

function vecToQuat(vec, angl){
  var quat = [];
  var n = norm(vec);
  quat[3] = Math.cos(angl / 2);
  quat[0] = n[0] * Math.sin(angl / 2);
  quat[1] = n[1] * Math.sin(angl / 2);
  quat[2] = n[2] * Math.sin(angl / 2);
  return quat;
}

var a = 1;
var first = true;
for (var angle = 2 * Math.PI; angle < 6 * Math.PI; angle += Math.PI / 30) {
  var id = DX.createItem("FxCd", 0, 0, 0);
  var cuboid = DX.item(id);
  var quat;
  if (first) {
    quat = vecToQuat([1, 0, 0], -0.6);
    first = false;
  } else {
    quat = vecToQuat([0, 0, 1], angle);
  }
  cuboid.setSize(1, 0.3, 2.5);
  cuboid.moveToPos(a * angle * Math.cos(angle), a * angle * Math.sin(angle), 0,
      quat[0], quat[1], quat[2], quat[3]);
}

DX.setPhysicsEnabled(true);