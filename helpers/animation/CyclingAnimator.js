define(['animation'], function (Animation, Animator) {
  var CyclingAnimator = function (animCreator, debug) {
    this.animCreator = animCreator;
    this.animation = this.animCreator();
    this.animator = new Animator(debug);
    this.animator.addAnimation(this.animation);
  };

  CyclingAnimator.prototype.update = function () {
    this.animator.update();
    if (this.animation.finished) {
      this.animation = this.animCreator();
      this.animator.addAnimation(this.animation);
    }
  };

  return CyclingAnimator;
});
