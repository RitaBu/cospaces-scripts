var s = Space.resource("899add87ab9b5d7f04d83c6e040abb581b6363bf90271af7a064e4398bfef6a2");
s.setVolume(0.5);
s.play(true);

var mainRotorItem = Space.item("q7lQAi7BPE");
var tailRotorItem = Space.item("d7eXQCxY5A");

Space.scheduleRepeating(function () {
  mainRotorItem.rotateLocalAxis(0, 0, 0, 0, 0, 3, 5 * Math.PI / 180, true);
  tailRotorItem.rotateLocalAxis(0, 0, 0, 0, 0, 3, 10 * Math.PI / 180, true);
}, 0);
Space.setRenderShadows(false);

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/", function () {
  require(['AnimatedEye'], function (AnimatedEye) {
    var rightEye = new AnimatedEye(Space.item("Lnq7saT89i"), Space.item("lwi4GxxSuH"), false);
    var leftEye = new AnimatedEye(Space.item("tbT09ciZTu"), Space.item("VZuD0QyXaD"), true);

// Main game loop

    Space.scheduleRepeating(function () {
      leftEye.update();
      rightEye.update();
    }, 0);

    var currentPos = 2;
    var currentEBPos = 2;

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

    function moveEyebrowsR() {
      var r = getRandom(1, 3);
      if (r > currentEBPos) {
        for (var i = currentEBPos; i < r; i++) {
          leftEye.eyebrowUp();
          rightEye.eyebrowUp();
        }
      } else if (currentEBPos > r) {
        for (i = r; i < currentEBPos; i++) {
          leftEye.eyebrowDown();
          rightEye.eyebrowDown();
        }
      }
      currentEBPos = r;
      Space.schedule(function () {
        moveEyebrowsR();
      }, r);
    }

    blinkR();
    moveEyesR();
    moveEyebrowsR();  }
  );
});
