define(['../../helpers/animation/animation'], function (animation) {
  var DURATION = 0.5;

  var AnimatedTongue = function (item) {
    this.item = item;
    this.size = that.item.getSize();
    this.animator = new animation.Animator(false);
  };

  AnimatedTongue.prototype.update = function () {
    this.animator.update();
  };

  AnimatedTongue.prototype.out = function () {
    var that = this;
    const range = 0.5;
    this.animator.addAnimation(new animation.Animation("Out", DURATION, (function () {
      return function (anim) {
        var p = anim.getProgress();
        Project.log("Out: " + p + " " + (this.size[2] + range * p));
        that.item.setSize(this.size[0], this.size[1], this.size[2] + range * p);
      };
    })()));
  };

  AnimatedTongue.prototype.in = function () {
    var that = this;
    const range = 0.5;
    this.animator.addAnimation(new animation.Animation("In", DURATION, (function () {
      return function (anim) {
        var p = anim.getProgress();
        Project.log("In: " + p + " " + (this.size[2] - range * p));
        that.item.setSize(this.size[0], this.size[1], this.size[2] + range * (1 - p));
      };
    })()));
  };

  AnimatedTongue.prototype.toggle = function () {
    this.out();
    this.in();
  };

  return AnimatedTongue;
});