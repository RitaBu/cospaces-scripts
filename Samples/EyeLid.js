const STATE_OPEN = "OPEN";
const STATE_CLOSED = "CLOSED";

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
}

Animation.prototype.start = function (t) {
  this.startTime = t;
  this.currentTime = 0;
  this.finished = false;
};

Animation.prototype.update = function (t) {
  if ((t - this.startTime) > this.duration) {
    this.finished = true;
    DX.log(this.toString() + " finished");
    return;
  }
  this.currentTime = t;
  this.exec(this.getProgress());
};

Animation.prototype.getProgress = function () {
  var timeLeft = this.startTime + this.duration - this.currentTime;
  var p = 1 - timeLeft / this.duration;
  DX.log("Timeleft " + timeLeft);
  DX.log("duration " + this.duration);
  return p;
};

var EyeLid = function (item, state) {
  this.item = item;
  this.state = state;
};

/*
EyeLid.prototype.isAnimated = function () {
  if (this.animation === undefined) return false;
  return !this.animation.finished;
};
*/

EyeLid.prototype.update = function (t) {
  if (this.animation !== undefined && this.animation !== null) {
    if (!this.animation.finished) {
      DX.log("Progress: " + this.animation.getProgress());
      this.animation.update(t);
    }
  }
};

EyeLid.prototype.close = function () {
  if (this.state === STATE_CLOSED) return;
  this.state = STATE_CLOSED;
  var that = this;
  this.animation = new Animation("Close", 1, function (progress) {
    DX.log("Here");
    that.item.rotateLocalAxis(0, 1, 0, 0, 1, 0, 45 * progress, true);
  });
  DX.log("Starting closing animation");
  this.animation.start(totalTime);
};

EyeLid.prototype.open = function () {
  if (this.state === STATE_OPEN) return;
  this.state = STATE_OPEN;
  var that = this;
  this.animation = new Animation("Open", 1, function (progress) {
    that.item.rotateLocalAxis(0, 0, 0, 0, 1, 0, -45 * progress, true);
  });
  this.animation.start(totalTime);
};

EyeLid.prototype.blink = function () {
  this.close();
};

var eyeLid = new EyeLid(DX.item("7mxj4NOSqq"), STATE_OPEN);

DX.setHeartbeatInterval(0.1);
DX.heartbeat(function (dt) {
  if (startTime === 0) {
    startTime = dt;
  }
  totalTime = dt - startTime;
  //x, y, z, axisX, axisY, axisZ, angle, discrete
  //eyeLid.rotateLocalAxis(0, 0, 0, 0, 1, 0, -dt * 0.0001, true);
  //eyeLid.moveLocal(1, 0, 0);
  DX.log("Total time: " + totalTime);
  eyeLid.update(totalTime);
});

function blinkRepeat(eyeLid) {
  eyeLid.blink();
  /*
   DX.runLater(function () {
   blinkRepeat(eyeLid);
   }, 2);
   */
}

blinkRepeat(eyeLid);
