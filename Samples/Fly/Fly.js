define(['../../helpers/animation/animation'], function (animation) {
  var Fly = function (item) {
    this.animator = new animation.Animator(false);
    this.item = item;
    this.rightWing = item.getPart("RightWing");
    this.leftWing = item.getPart("LeftWing");
  };

  Fly.prototype.update = function () {
    this.animator.update();
  };

  Fly.prototype.wingsUp = function () {
    var that = this;
    var a = new animation.Animation("Wings Up", 0.02, (function () {
      var lastProgress = 0;
      const angle = 45;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        // Project.log(anim.toString() + " lastProgress = " + lastProgress);
        that.rightWing.rotateLocalAxis(1, 0, 0, 1, 0, 0, Math.radians(-(lastProgress - p)), true);
        that.leftWing.rotateLocalAxis(1, 0, 0, 1, 0, 0, -Math.radians(-(lastProgress - p)), true);
      };
    })(), false);
    this.animator.addAnimation(a);
  };

  Fly.prototype.wingsDown = function () {
    var that = this;
    var a = new animation.Animation("Wings Down", 0.02, (function () {
      var lastProgress = 0;
      const angle = 45
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        // Project.log(anim.toString() + " lastProgress = " + lastProgress);
        that.rightWing.rotateLocalAxis(1, 0, 0, 1, 0, 0, -Math.radians(-(lastProgress - p)), true);
        that.leftWing.rotateLocalAxis(1, 0, 0, 1, 0, 0, Math.radians(-(lastProgress - p)), true);
      };
    })(), false);
    this.animator.addAnimation(a);
  };

  Fly.prototype.swing = function () {
    this.wingsUp();
    this.wingsDown();
    // this.wingsUp();
    // this.wingsDown();
  };

  return Fly;
});