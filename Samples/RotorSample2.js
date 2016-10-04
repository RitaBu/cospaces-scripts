var s = Space.resource("899add87ab9b5d7f04d83c6e040abb581b6363bf90271af7a064e4398bfef6a2");
s.setVolume(0.5);
s.play(true);

var mainRotorItem = Space.item("q7lQAi7BPE");
var tailRotorItem = Space.item("d7eXQCxY5A");

Space.scheduleRepeating(function () {
  mainRotorItem.rotateLocalAxis(0, 0, 0, 0, 0, 3, 5 * Math.PI / 180, true);
  tailRotorItem.rotateLocalAxis(0, 0, 0, 0, 0, 3, 10 * Math.PI / 180, true);
}, 0);

//===================
// Animation
//===================

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


//===================
// AnimatedEye
//===================

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

//states: 1 - down, 2 - neutral, 3 - up
var EyeBrow = function (item, left) {
  this.item = item;
  this.left = left;
  this.animator = new Animator();
  this.state = 2;
};

EyeBrow.prototype.update = function (t) {
  this.animator.update(t);
};

EyeBrow.prototype.neutral = function () {
  if (this.state === 2) return;
  var that = this;
  var stateTo = this.state - 2;
  this.animator.addAnimation(new Animation("Neutral", BLINK_DURATION / 2, (function () {
    var lastProgress = 0;
    const angle = 25;
    return function (anim) {
      var p = lastProgress;
      lastProgress = angle * anim.getProgress();
      // Space.log(anim.toString() + " lastProgress = " + lastProgress);
      that.item.rotateLocalAxis(0, 1, 0, 0, 1, 0, Math.radians(lastProgress - p), true);
    };
  })()));
};

EyeBrow.prototype.up = function () {
};

EyeBrow.prototype.down = function () {
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

Space.log("Everything loaded. Starting...");
var rightEye = new Eye(Space.item("Lnq7saT89i"));
var leftEye = new Eye(Space.item("tbT09ciZTu"));

Space.scheduleRepeating(function () {
  var t = Space.currentTime();
  if (startTime === 0) {
    startTime = t;
  }
  totalTime = t - startTime;
  rightEye.update(Space.currentTime());
  leftEye.update(Space.currentTime());
}, 0);

var left = false;
var currentPos = 2;

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function blinkR() {
  leftEye.blink();
  rightEye.blink();
  var r = getRandom(3, 5);
  Space.schedule(function () {
    blinkR();
  }, r);
}

function moveEyesR() {
  var r = getRandom(1, 3);
  if (r > currentPos) {
    for (var i = currentPos; i < r; i++) {
      leftEye.right();
      rightEye.right();
    }
  } else if (currentPos > r) {
    for (i = r; i < currentPos; i++) {
      leftEye.left();
      rightEye.left();
    }
  }
  currentPos = r;
  Space.schedule(function () {
    moveEyesR();
  }, r);
}

blinkR();
moveEyesR();