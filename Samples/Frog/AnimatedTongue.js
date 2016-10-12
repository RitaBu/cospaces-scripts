define(['../../helpers/animation/animation'], function (animation) {
  var DURATION = 0.5;

  var AnimatedTongue = function (item) {
    this.animator = new animation.Animator(false);
  };

  AnimatedTongue.prototype.update = function () {
    this.animator.update();
  };

  AnimatedTongue.prototype.out = function () {
    var that = this;
    this.animator.addAnimation(new animation.Animation("Out", DURATION, (function () {
      var sizeZ = that.item.getSize()[2];
      const range = 0.5;
      return function (anim) {
        var p = anim.getProgress();
        that.item.setZ(sizeZ + range * p);
      };
    })()));
  };

  AnimatedTongue.prototype.in = function () {
    var that = this;
    this.animator.addAnimation(new animation.Animation("In", DURATION, (function () {
      const range = 0.5;
      var sizeZ = that.item.getSize()[2];
      return function (anim) {
        var p = anim.getProgress();
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