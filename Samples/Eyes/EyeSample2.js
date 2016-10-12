Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/", function () {
  require(['EyedObject'], function (EyedObject) {
    var elephant = new EyedObject(Space.getItem("imapObWTsT"));
    var tree = new EyedObject(Space.getItem("Jsqj60uMeS"));
    var tree2 = new EyedObject(Space.getItem("4tvtLJYadq"));

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

