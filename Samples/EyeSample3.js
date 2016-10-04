const STATE_OPEN = "OPEN";
const STATE_CLOSED = "CLOSED";
const BLINK_DURATION = 0.11;

// Converts from degrees to radians.
Math.radians = function (degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
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

var Eyelid = function (item, state) {
  this.item = item;
  this.state = state;
  this.animator = new Animator();
};

Eyelid.prototype.update = function (t) {
  this.animator.update(t);
};

Eyelid.prototype.down = function () {
  /*
   if (this.state === STATE_CLOSED) return;
   this.state = STATE_CLOSED;
   */
  var that = this;
  this.animator.addAnimation(new Animation("Down", BLINK_DURATION / 2, (function () {
    var lastProgress = 0;
    const angle = 75;
    return function (anim) {
      var p = lastProgress;
      lastProgress = angle * anim.getProgress();
      // Space.log(anim.toString() + " lastProgress = " + lastProgress);
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
  this.animator.addAnimation(new Animation("Up", BLINK_DURATION / 2, (function () {
    var lastProgress = 0;
    const angle = 75;
    return function (anim) {
      var p = lastProgress;
      lastProgress = angle * anim.getProgress();
      // Space.log(anim.toString() + " lastProgress = " + lastProgress);
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

var Pupil = function (item) {
  this.item = item;
  this.animator = new Animator();
};

Pupil.prototype.left = function () {
  var that = this;
  this.animator.addAnimation(new Animation("Left", BLINK_DURATION / 2, (function () {
    var lastProgress = 0;
    const distance = 0.15;
    return function (anim) {
      var p = lastProgress;
      lastProgress = distance * anim.getProgress();
      // Space.log(anim.toString() + " lastProgress = " + lastProgress);
      that.item.moveLocal(0, -(lastProgress - p), 0, true);
    };
  })()));
};

Pupil.prototype.right = function () {
  var that = this;
  this.animator.addAnimation(new Animation("Right", BLINK_DURATION / 2, (function () {
    var lastProgress = 0;
    const distance = 0.15;
    return function (anim) {
      var p = lastProgress;
      lastProgress = distance * anim.getProgress();
      // Space.log(anim.toString() + " lastProgress = " + lastProgress);
      that.item.moveLocal(0, lastProgress - p, 0, true);
    };
  })()));
};

Pupil.prototype.update = function (t) {
  this.animator.update(t);
};

var Eye = function (eyeItem) {
  this.topEyelid = new Eyelid(eyeItem.part("topEyelid"), STATE_OPEN);
  this.bottomEyelid = new Eyelid(eyeItem.part("bottomEyelid"), STATE_OPEN);
  this.pupil = new Pupil(eyeItem.part("pupil"));
};

Eye.prototype.update = function (t) {
  this.topEyelid.update(t);
  this.bottomEyelid.update(t);
  this.pupil.update(t);
};

Eye.prototype.blink = function () {
  this.topEyelid.blinkTop();
  this.bottomEyelid.blinkBottom();
};

Eye.prototype.right = function () {
  this.pupil.right();
};

Eye.prototype.left = function () {
  this.pupil.left();
};

var EyedObject = function (item) {
  this.leftEye = new Eye(item.part("LeftEye"));
  this.rightEye = new Eye(item.part("RightEye"));
};

EyedObject.prototype.blink = function () {
  this.leftEye.blink();
  this.rightEye.blink();
};

EyedObject.prototype.right = function () {
  this.leftEye.right();
  this.rightEye.right();
};

EyedObject.prototype.left = function () {
  this.leftEye.left();
  this.rightEye.left();
};

EyedObject.prototype.update = function (t) {
  this.leftEye.update(t);
  this.rightEye.update(t);
};

// ===================================================================

var startTime = 0;
var totalTime = 0;

var elephant = new EyedObject(Space.item("imapObWTsT"));
var tree = new EyedObject(Space.item("Jsqj60uMeS"));
var tree2 = new EyedObject(Space.item("4tvtLJYadq"));

Space.scheduleRepeating(function (dt) {
  if (startTime === 0) {
    startTime = dt;
  }
  totalTime = dt - startTime;
  // Space.log("Total time: " + totalTime);
  elephant.update(totalTime);
  tree.update(totalTime);
  tree2.update(totalTime);
}, 0);

function blinkRepeat(eye) {
  eye.blink();
  Space.schedule(function () {
    blinkRepeat(eye);
  }, 2);
}

blinkRepeat(elephant.leftEye);
blinkRepeat(elephant.rightEye);

blinkRepeat(tree.leftEye);
blinkRepeat(tree.rightEye);

blinkRepeat(tree2.leftEye);
blinkRepeat(tree2.rightEye);

function rightAndBackRepeat(eye) {
  eye.right();
  Space.schedule(function () {
    eye.left();
    Space.schedule(function () {
      leftAndBackRepeat(eye);
    }, 3);
  }, 3);
}

function leftAndBackRepeat(eye) {
  eye.left();
  Space.schedule(function () {
    eye.right();
    Space.schedule(function () {
      rightAndBackRepeat(eye);
    }, 3);
  }, 3);
}

rightAndBackRepeat(elephant.rightEye);
rightAndBackRepeat(elephant.leftEye);
