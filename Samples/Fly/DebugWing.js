define(['../../helpers/animation/animation'], function (animation) {
  var Wing = function (item) {
    this.animator = new animation.Animator(false);
    this.item = item;
  };

  Wing.prototype.update = function () {
    this.animator.update();
  };

  Wing.prototype.Up = function () {
    var that = this;
    var a = new animation.Animation("Up", 0.02, (function () {
      var lastProgress = 0;
      const angle = 45;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        that.item.rotateLocalAxis(1, 0, 0, 1, 0, 0, Math.radians(-(lastProgress - p)), true);
      };
    })(), false);
    this.animator.addAnimation(a);
  };

  Wing.prototype.Down = function () {
    var that = this;
    var a = new animation.Animation("Down", 0.02, (function () {
      var lastProgress = 0;
      const angle = 45;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        that.item.rotateLocalAxis(1, 0, 0, 1, 0, 0, -Math.radians(-(lastProgress - p)), true);
      };
    })(), false);
    this.animator.addAnimation(a);
  };

  Wing.prototype.swing = function () {
    this.Up();
    this.Down();
  };

  return Wing;
});