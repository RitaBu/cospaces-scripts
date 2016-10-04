var startTime = 0;
var totalTime = 0;

var Animation = function (name, duration, exec) {
  this.name = name;
  this.duration = duration;
  this.finished = true;
  this.exec = exec;
};

Animation.prototype.toString = function () {
  return "[Animation] " + this.name;
};

Animation.prototype.start = function (t) {
  this.startTime = t;
  this.currentTime = 0;
  this.finished = false;
};

Animation.prototype.update = function (t) {
  this.currentTime = t;
  if ((t - this.startTime) > this.duration) {
    this.finished = true;
    //Space.log(this.toString() + " finished");
  }
  this.exec(this);
};

Animation.prototype.getProgress = function () {
  if (this.finished) return 1;
  var timeLeft = this.startTime + this.duration - this.currentTime;
  // Space.log("Timeleft " + timeLeft);
  // Space.log("duration " + this.duration);
  return 1 - timeLeft / this.duration;
};

var Animator = function () {
  this.anims = [];
};

Animator.prototype.update = function (t) {
  if (this.anims.length > 0) {
    var a = this.anims[0];
    a.update(t);
    // Space.log(a.toString() + " Progress: " + a.getProgress());
    if (a.finished) {
      this.anims.shift();
      if (this.anims.length > 0) {
        a = this.anims[0];
        a.start(t);
        //Space.log(a.toString() + " finished. Left " + this.anims.length + " animations");
      }
    }
  }
};

Animator.prototype.addAnimation = function (a) {
  //Space.log("Added " + (this.anims.length + 1) + " animation");
  this.anims.push(a);
  if (this.anims.length == 1) {
    a.start(totalTime);
  }
};
