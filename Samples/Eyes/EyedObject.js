define(['./AnimatedEye'], function (AnimatedEye) {
  var EyedObject = function (item) {
    this.leftEye = new AnimatedEye(item.part("LeftEye"));
    this.rightEye = new AnimatedEye(item.part("RightEye"));
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

  EyedObject.prototype.update = function () {
    this.leftEye.update();
    this.rightEye.update();
  };

  return EyedObject;
});

