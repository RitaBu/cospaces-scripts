var mainRotorItem = DX.item("q7lQAi7BPE");
var tailRotorItem = DX.item("d7eXQCxY5A");

DX.setHeartbeatInterval(0);
DX.heartbeat(function () {
  mainRotorItem.rotateLocalAxis(0, 0, 0, 0, 0, 3, 5 * Math.PI / 180, true);
  tailRotorItem.rotateLocalAxis(0, 0, 0, 0, 0, 3, 10 * Math.PI / 180, true);
});
