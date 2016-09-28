const STATE_OPEN = "OPEN";
const STATE_CLOSED = "CLOSED";

var startTime = 0;
var totalTime = 0;

var Animation = function(duration, callback) {
  this.duration = duration;
  this.finished = true;
  this.callback = callback;
};

Animation.prototype.start = function(t) {
  this.startTime = t;
  this.finished = false;
};

Animation.prototype.update = function (t) {
  if (t - this.startTime < this.duration) {
    this.finished = true;
    this.callback();
  }
};

var EyeLid = function(item, state) {
  this.item = item;
  this.state = state;
};

EyeLid.prototype.isAnimated = function () {
  if (this.animation === undefined) return false;
  return !this.animation.finished;
};

EyeLid.prototype.update = function (t) {
  this.animation.update(t);
  if (!this.isAnimated()) return;

};

EyeLid.prototype.close = function () {
  this.close(function () {});
};

EyeLid.prototype.close = function (callback) {
  if (this.state === STATE_CLOSED) return;
  this.state = STATE_CLOSED;
  this.animation = new Animation(0.5, callback);
  this.animation.start(totalTime);
};

EyeLid.prototype.open = function () {
  this.open(function () {});
};

EyeLid.prototype.open = function (callback) {
  if (this.state === STATE_OPEN) return;
  this.state = STATE_OPEN;
  this.animation = new Animation(0.5, callback);
  this.animation.start(totalTime);
};

EyeLid.prototype.blink = function () {
  var that = this;
  this.close(function () {
    that.open();
  });
};

var eyeLid = new EyeLid(DX.item("itwDLHAkPv"), STATE_OPEN);

DX.setHeartbeatInterval(1);
DX.heartbeat(function (dt) {
  if (startTime === 0) {
    startTime = dt;
  }
  totalTime = dt - startTime;
  DX.log("Total time: " + totalTime);
  //x, y, z, axisX, axisY, axisZ, angle, discrete
  //eyeLid.rotateLocalAxis(0, 0, 0, 0, 1, 0, -dt * 0.0001, true);
  //eyeLid.moveLocal(1, 0, 0);
  if (eyeLid.isAnimated()) {
    eyeLid.update(totalTime);
  }
});

function blinkRepeat(eyeLid) {
  eyeLid.blink();
  DX.runLater(function () {
    blinkRepeat(eyeLid);
  }, 2);
}

blinkRepeat(eyeLid);
