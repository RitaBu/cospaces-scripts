
var beginTime = 0;
var totalTime = 0;

var eyeLid = DX.item("itwDLHAkPv");

DX.setHeartbeatInterval(0);
DX.heartbeat(function (dt) {
  if (beginTime === 0) {
    beginTime = dt;
  }
  totalTime += dt;
  //x, y, z, axisX, axisY, axisZ, angle, discrete
  eyeLid.rotateLocalAxis(0, 0, 0, 0, 1, 0, dt * 0.1, true);
});
