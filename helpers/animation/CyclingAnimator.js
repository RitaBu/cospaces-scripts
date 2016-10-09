define(['animation'], function (animation) {
  return function (animCreator, debug) {
    Space.log("CyclingAnimator.constructor");
    this.animCreator = animCreator;
    this.animation = this.animCreator();
    this.animator = new animation.Animator(debug);
    this.animator.addAnimation(this.animation);
    var that = this;
    this.update = function () {
      that.animator.update();
      if (that.animation.finished) {
        that.animation = that.animCreator();
        that.animator.addAnimation(that.animation);
      }
    };
  };
});
