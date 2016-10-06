define(function () {
  var Animation = function (name, duration, exec) {
    this.name = name;
    this.duration = duration;
    this.finished = true;
    this.exec = exec;
    this.startTime = 0;
  };

  Animation.prototype.toString = function () {
    return "[Animation] " + this.name;
  };

  Animation.prototype.start = function () {
    this.startTime = Space.currentTime();
    this.finished = false;
  };

  Animation.prototype.update = function () {
    if ((Space.currentTime() - this.startTime) > this.duration) {
      this.finished = true;
      //Space.log(this.toString() + " finished");
    }
    this.exec(this);
  };

  Animation.prototype.getProgress = function () {
    if (this.finished) return 1;
    var timeLeft = this.startTime + this.duration - Space.currentTime();
    // Space.log("Timeleft " + timeLeft);
    // Space.log("duration " + this.duration);
    return 1 - timeLeft / this.duration;
  };

  var Animator = function () {
    this.anims = [];
  };

  Animator.prototype.update = function () {
    if (this.anims.length > 0) {
      var a = this.anims[0];
      a.update();
      // Space.log(a.toString() + " Progress: " + a.getProgress());
      if (a.finished) {
        this.anims.shift();
        if (this.anims.length > 0) {
          a = this.anims[0];
          a.start();
          //Space.log(a.toString() + " finished. Left " + this.anims.length + " animations");
        }
      }
    }
  };

  Animator.prototype.addAnimation = function (a) {
    //Space.log("Added " + (this.anims.length + 1) + " animation");
    this.anims.push(a);
    if (this.anims.length == 1) {
      a.start();
    }
  };

  return {Animation: Animation, Animator: Animator};
});

