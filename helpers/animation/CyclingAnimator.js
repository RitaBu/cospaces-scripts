define(['animation'], function (Animation, Animator) {
  return function (animCreator, debug) {
    this.animCreator = animCreator;
    this.animation = this.animCreator();
    this.animator = new Animator(debug);
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
