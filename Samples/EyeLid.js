const STATE_OPEN = "OPEN";
const STATE_CLOSED = "CLOSED";
const BLINK_DURATION = 0.11;

var startTime = 0;
var totalTime = 0;

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

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
  this.currentTime = t;
  if ((t - this.startTime) > this.duration) {
    this.finished = true;
    //DX.log(this.toString() + " finished");
  }
  this.exec(this);
};

Animation.prototype.getProgress = function () {
  if (this.finished) return 1;
  var timeLeft = this.startTime + this.duration - this.currentTime;
  // DX.log("Timeleft " + timeLeft);
  // DX.log("duration " + this.duration);
  return 1 - timeLeft / this.duration;
};

var Eyelid = function (item, state) {
  this.item = item;
  this.state = state;
  this.anims = [];
};

Eyelid.prototype.update = function (t) {
  if (this.anims.length > 0) {
    var a = this.anims[0];
    a.update(t);
    // DX.log(a.toString() + " Progress: " + a.getProgress());
    if (a.finished) {
      this.anims.shift();
      if (this.anims.length > 0) {
        a = this.anims[0];
        a.start(t);
        // DX.log(a.toString() + " finished. Left " + this.anims.length + " animations");
      }
    }
  }
};

Eyelid.prototype.addAnimation = function (a) {
  this.anims.push(a);
  if (this.anims.length == 1) {
    a.start(totalTime);
  }
};

Eyelid.prototype.down = function () {
  /*
   if (this.state === STATE_CLOSED) return;
   this.state = STATE_CLOSED;
   */
  var that = this;
  this.addAnimation(new Animation("Down", BLINK_DURATION / 2, (function () {
    var lastProgress = 0;
    return function (anim) {
      var p = lastProgress;
      lastProgress = 75 * anim.getProgress();
      // DX.log(anim.toString() + " lastProgress = " + lastProgress);
      that.item.rotateLocalAxis(0, 1, 0, 0, 1, 0, Math.radians(-(lastProgress - p)), true);
    };
  })()));
};

Eyelid.prototype.up = function () {
  /*
   if (this.state === STATE_OPEN) return;
   this.state = STATE_OPEN;
   */
  var that = this;
  this.addAnimation(new Animation("Up", BLINK_DURATION / 2, (function () {
    var lastProgress = 0;
    return function (anim) {
      var p = lastProgress;
      lastProgress = 75 * anim.getProgress();
      // DX.log(anim.toString() + " lastProgress = " + lastProgress);
      that.item.rotateLocalAxis(0, 1, 0, 0, 1, 0, Math.radians(lastProgress - p), true);
    };
  })()));
};

Eyelid.prototype.blinkTop = function () {
  this.down();
  this.up();
};

Eyelid.prototype.blinkBottom = function () {
  this.up();
  this.down();
};

var Eye = function (eyeItem) {
  this.topEyelid = new Eyelid(eyeItem.part("topEyelid"), STATE_OPEN);
  this.bottomEyelid = new Eyelid(eyeItem.part("bottomEyelid"), STATE_OPEN);
};

Eye.prototype.update = function (t) {
  this.topEyelid.update(t);
  this.bottomEyelid.update(t);
};

Eye.prototype.blink = function () {
  this.topEyelid.blinkTop();
  this.bottomEyelid.blinkBottom();
};

var topEyelid = new Eyelid(DX.item("oRE07xiEX3"), STATE_OPEN);
var bottomEyelid = new Eyelid(DX.item("Aytf70hzTt"), STATE_OPEN);

var rightEye = new Eye(DX.item("HsahejpO9w"));
var leftEye = new Eye(DX.item("roDyL5azf3"));


DX.setHeartbeatInterval(0);
DX.heartbeat(function (dt) {
  if (startTime === 0) {
    startTime = dt;
  }
  totalTime = dt - startTime;
  //x, y, z, axisX, axisY, axisZ, angle, discrete
  //topEyelid.rotateLocalAxis(0, 0, 0, 0, 1, 0, -dt * 0.0001, true);
  //topEyelid.moveLocal(1, 0, 0);
  // DX.log("Total time: " + totalTime);
  leftEye.update(totalTime);
  rightEye.update(totalTime);
});

function blinkRepeatEye(eye) {
  eye.blink();
   DX.runLater(function () {
     blinkRepeatEye(eye);
   }, 2);
}

blinkRepeatEye(leftEye);
blinkRepeatEye(rightEye);
