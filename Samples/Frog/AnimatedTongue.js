define(['../../helpers/animation/animation'], function (animation) {
  var DURATION = 0.5;

  var AnimatedTongue = function (item) {
    this.item = item;
    this.animator = new animation.Animator(false);
  };

  AnimatedTongue.prototype.update = function () {
    this.animator.update();
  };

  AnimatedTongue.prototype.out = function () {
    var that = this;
    var sizeZ = that.item.getSize()[2];
    const range = 0.5;
    this.animator.addAnimation(new animation.Animation("Out", DURATION, (function () {
      Project.log("sizeZ: " + sizeZ);
      return function (anim) {
        var p = anim.getProgress();
        Project.log("Out: " + p + " " + (sizeZ + range * p));
        that.item.setZ(sizeZ + range * p);
      };
    })()));
  };

  AnimatedTongue.prototype.in = function () {
    var that = this;
    var sizeZ = that.item.getSize()[2];
    const range = 0.5;
    this.animator.addAnimation(new animation.Animation("In", DURATION, (function () {
      Project.log("sizeZ: " + sizeZ);
      return function (anim) {
        var p = anim.getProgress();
        Project.log("In: " + p + " " + (sizeZ - range * p));
        that.item.setZ(sizeZ - range * p);
      };
    })()));
  };

  AnimatedTongue.prototype.toggle = function () {
    this.out();
    this.in();
  };

  return AnimatedTongue;
});