define(['../../helpers/animation/animation'], function (animation) {
  var AnimatedTongue = function (item) {
    this.animator = new animation.Animator(false);
  };

  AnimatedTongue.prototype.update = function() {
    this.animator.update();
  };

  AnimatedTongue.prototype.out = function () {
    this.animator.addAnimation();
  };

  AnimatedTongue.prototype.in = function () {
    this.animator.addAnimation();
  };

  AnimatedTongue.prototype.toggle = function () {
    this.out();
    this.in();
  };

  return AnimatedTongue;
});