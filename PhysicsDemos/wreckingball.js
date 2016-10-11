var wreckingBall = Space.createItem("Sphere", 5, 0, 6);
var wx = 1;
var wy = 0.2;
var wz = 1;
var dy = 0.7;
var dx = 0;
var n = 5;
for (var i = 0; i < n; i++) {
    var h = i * (wz + wy);
    Space.createItem("FxCd", dx, -dy, h).setSize(wx, wy, wz);
    Space.createItem("FxCd", dx, 0, h).setSize(wx, wy, wz);
    Space.createItem("FxCd", dx, dy, h).setSize(wx, wy, wz);
    Space.createItem("FxCd", dx, 0, h + wz).setSize(wx, 2 * dy + wy, wy);
}

Space.setPhysicsEnabled(true);
wreckingBall.jointToGround(0, 0, 6);
wreckingBall.setScale(2);
wreckingBall.setDensity(60000);
