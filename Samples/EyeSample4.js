Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/", function () {
  require(['AnimatedEye'], function (AnimatedEye) {
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

// ===================================================================

    var elephant = new EyedObject(Space.item("imapObWTsT"));
    var tree = new EyedObject(Space.item("Jsqj60uMeS"));
    var tree2 = new EyedObject(Space.item("4tvtLJYadq"));

    Space.scheduleRepeating(function () {
      elephant.update();
      tree.update();
      tree2.update();
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
    rightAndBackRepeat(elephant.leftEye);  });
});

