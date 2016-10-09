define(['animation'], function (Animation, Animator) {
  return function (animCreator, debug) {
    this.animCreator = animCreator;
    this.animation = this.animCreator();
    this.animator = new Animator(debug);
    this.animator.addAnimation(this.animation);

    this.update = function () {
      this.animator.update();
      if (this.animation.finished) {
        this.animation = this.animCreator();
        this.animator.addAnimation(this.animation);
      }
    };
  };
});
