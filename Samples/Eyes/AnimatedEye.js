define(['../../helpers/animation/animation'], function (animation) {
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
    this.animator = new animation.Animator();
  };

  Eyelid.prototype.update = function () {
    this.animator.update();
  };

  Eyelid.prototype.down = function () {
    /*
     if (this.state === STATE_CLOSED) return;
     this.state = STATE_CLOSED;
     */
    var that = this;
    this.animator.addAnimation(new animation.Animation("Down", BLINK_DURATION / 2, (function () {
      var lastProgress = 0;
      const angle = 75;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        // Project.log(anim.toString() + " lastProgress = " + lastProgress);
        that.item.addLocalRotation(0, 1, 0, 0, 1, 0, Math.radians(-(lastProgress - p)), true);
      };
    })()));
  };

  Eyelid.prototype.up = function () {
    /*
     if (this.state === STATE_OPEN) return;
     this.state = STATE_OPEN;
     */
    var that = this;
    this.animator.addAnimation(new animation.Animation("Up", BLINK_DURATION / 2, (function () {
      var lastProgress = 0;
      const angle = 75;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        // Project.log(anim.toString() + " lastProgress = " + lastProgress);
        that.item.addLocalRotation(0, 1, 0, 0, 1, 0, Math.radians(lastProgress - p), true);
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

  var Pupil = function (item, eyeItem) {
    this.item = item;
    var white = eyeItem.getPart("white");
    this.pos = white.getPosition();
    this.axisZ = eyeItem.getAxisZ();
    normalize(this.axisZ);
    //Project.log(this.axisZ);
    this.animator = new animation.Animator();
  };

  function normalize(axis){
    var norm = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
    axis.x = axis.x / norm;
    axis.y = axis.y / norm;
    axis.z = axis.z / norm;
  }

  Pupil.prototype.left = function () {
    var that = this;
    this.animator.addAnimation(new animation.Animation("Left", BLINK_DURATION / 2, (function () {
      var lastProgress = 0;
      const angle = 30;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        // Project.log(anim.toString() + " lastProgress = " + lastProgress);
        that.item.rotate(that.pos.x, that.pos.y, that.pos.z, that.axisZ.x, that.axisZ.y, that.axisZ.z, Math.radians(lastProgress - p), false);
      };
    })()));
  };

  Pupil.prototype.right = function () {
    var that = this;
    this.animator.addAnimation(new animation.Animation("Right", BLINK_DURATION / 2, (function () {
      var lastProgress = 0;
      const angle = 30;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        // Project.log(anim.toString() + " lastProgress = " + lastProgress);
        that.item.rotate(that.pos.x, that.pos.y, that.pos.z, that.axisZ.x, that.axisZ.y, that.axisZ.z, Math.radians(-(lastProgress - p)), true);
      };
    })()));
  };

  Pupil.prototype.update = function () {
    this.animator.update();
  };

//states: 1 - down, 2 - neutral, 3 - up
  var Eyebrow = function (item, left) {
    this.item = item;
    this.left = left;
    this.animator = new animation.Animator();
    this.state = 2;
  };

  Eyebrow.prototype.update = function () {
    this.animator.update();
  };

  Eyebrow.prototype.neutral = function () {
    if (this.state === 2) return;
    var that = this;
    var stateTo = this.state - 2;
    this.animator.addAnimation(new animation.Animation("Neutral", BLINK_DURATION / 2, (function () {
      var lastProgress = 0;
      const angle = 25 * stateTo;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        // Project.log(anim.toString() + " lastProgress = " + lastProgress);
        that.item.addLocalRotation(0, 1, 0, 0, 1, 0, Math.radians(lastProgress - p), true);
      };
    })()));
  };

  Eyebrow.prototype.up = function () {
    if (this.state === 3) return;
    var that = this;
    var r = this.left ? 3 : 1;
    var stateTo = r - this.state;
    this.animator.addAnimation(new animation.Animation("Up", BLINK_DURATION / 2, (function () {
      var lastProgress = 0;
      const angle = 25 * stateTo;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        // Project.log(anim.toString() + " lastProgress = " + lastProgress);
        that.item.addLocalRotation(0, 1, 0, 0, 1, 0, Math.radians(lastProgress - p), true);
      };
    })()));
  };

  Eyebrow.prototype.down = function () {
    if (this.state === 1) return;
    var that = this;
    var r = this.left ? 1 : 3;
    var stateTo = r - this.state;
    this.animator.addAnimation(new animation.Animation("Down", BLINK_DURATION / 2, (function () {
      var lastProgress = 0;
      const angle = 25 * stateTo;
      return function (anim) {
        var p = lastProgress;
        lastProgress = angle * anim.getProgress();
        // Project.log(anim.toString() + " lastProgress = " + lastProgress);
        that.item.addLocalRotation(0, 1, 0, 0, 1, 0, Math.radians(lastProgress - p), true);
      };
    })()));
  };

  var Eye = function (eyeItem, eyebrowItem, left) {
    this.topEyelid = new Eyelid(eyeItem.getPart("topEyelid"), STATE_OPEN);
    this.bottomEyelid = new Eyelid(eyeItem.getPart("bottomEyelid"), STATE_OPEN);
    this.pupil = new Pupil(eyeItem.getPart("pupil"), eyeItem);
    if (eyebrowItem !== undefined) {
      this.eyebrow = new Eyebrow(eyebrowItem, left);
    }
  };

  Eye.prototype.update = function () {
    this.topEyelid.update();
    this.bottomEyelid.update();
    this.pupil.update();
    if (this.eyebrow !== undefined) {
      this.eyebrow.update();
    }
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

  Eye.prototype.eyebrowUp = function () {
    if (this.eyebrow !== undefined) {
      this.eyebrow.up();
    }
  };

  Eye.prototype.eyebrowDown = function () {
    if (this.eyebrow !== undefined) {
      this.eyebrow.down();
    }
  };

  return Eye;
});

