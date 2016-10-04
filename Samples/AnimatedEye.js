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

var animation_js = "https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/animation/animation.js";
Space.loadScript(animation_js, function () {
  Space.log("AnimatedEye Library loaded.");
});