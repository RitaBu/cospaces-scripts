define(function () {
  var Animation = function (name, duration, exec, debug) {
    this.name = name;
    this.duration = duration;
    this.finished = true;
    this.exec = exec;
    this.startTime = 0;
    this.DEBUG = (typeof debug !== 'undefined') ?  debug : false;
  };

  Animation.prototype.toString = function () {
    return "[Animation] " + this.name;
  };

  Animation.prototype.start = function () {
    this.startTime = Space.currentTime();
    this.finished = false;
    Space.log(this.toString() + " started");
  };

  Animation.prototype.update = function () {
    if ((Space.currentTime() - this.startTime) > this.duration) {
      this.finished = true;
      if (this.DEBUG){
        Space.log(this.toString() + " finished");
      }
    }
    this.exec(this);
  };

  Animation.prototype.getProgress = function () {
    if (this.finished) return 1;
    var timeLeft = this.startTime + this.duration - Space.currentTime();
    if (this.DEBUG){
      Space.log("Time left " + timeLeft);
      Space.log("Duration " + this.duration);
    }
    return 1 - timeLeft / this.duration;
  };

  var Animator = function (debug) {
    this.anims = [];
    this.DEBUG = (typeof debug !== 'undefined') ?  debug : false;
  };

  Animator.prototype.update = function () {
    if (this.anims.length > 0) {
      var a = this.anims[0];
      a.update();
      if (this.DEBUG) {
        Space.log(a.toString() + " Progress: " + a.getProgress());
      }
      if (a.finished) {
        this.anims.shift();
        if (this.anims.length > 0) {
          a = this.anims[0];
          a.start();
          if (this.DEBUG) {
            Space.log(a.toString() + " finished. Left " + this.anims.length + " animations");
          }
        }
      }
    }
  };

  Animator.prototype.addAnimation = function (a) {
    if (this.DEBUG) {
      Space.log("Added " + (this.anims.length + 1) + " animation");
    }
    this.anims.push(a);
    if (this.anims.length == 1) {
      a.start();
    }
  };

  return {Animation: Animation, Animator: Animator};
});

