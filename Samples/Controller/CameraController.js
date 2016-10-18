define(function() {
  var CameraController = function(aim, target, distance) {
    this.aim = aim;
    this.target = target;
    this.distace = distance;
    this.camera = Space.getCamera();
  };

  CameraController.prototype.getAimPosition = function() {
    var pos = this.camera.getPosition();
    var dir = this.camera.getDirection();
    var dz = this.distace * dir.z;
    var ratio = this.distace;
    var z = pos.z + dz;
    if (z < 0) {
      ratio = -1 * this.distace * pos.z / dz;
      z = 0;
    }
    return {x: pos.x + dir.x * ratio, y: pos.y + dir.y * ratio, z: z}
  };

  CameraController.prototype.start = function() {
    var that = this;
    this.disp1 = Space.scheduleRepeating(function() {
      var p = that.getAimPosition();
      that.aim.setPosition(p.x, p.y, p.z, false);
    }, 0);

    var lst = {x: 0, y: 0, z: 0};
    var DELTA = 0.1;
    this.disp2 = Space.scheduleRepeating(function() {
      var v = that.getAimPosition();
      if (Math.abs(lst.x - v.x) > DELTA || Math.abs(lst.y - v.y) > DELTA || Math.abs(lst.z - v.z) > DELTA) {
        that.target.flyLikeButterflyTo(v.x, v.y, v.z);
        lst.x = v.x;
        lst.y = v.y;
        lst.z = v.z;
      }
    }, 0.5);
  };

  CameraController.prototype.stop = function() {
    if (typeof this.disp1 != "undefined" && typeof this.disp2 != undefined) {
      this.disp1.dispose();
      this.disp2.dispose();
    }
  };

  return CameraController;
});