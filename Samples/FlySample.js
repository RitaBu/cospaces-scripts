Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/", function () {
  require(['Fly', 'EyedObject'], function (Fly, EyedObject) {

    var fly = new Fly(Space.item("q5VWCw7hVA"));
    var frog = new EyedObject(Space.item("rmGHz2ajS6"));

    Space.scheduleRepeating(function () {
      fly.update();
      frog.update();
    }, 0);

    function getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function flySwing() {
      fly.swing();
      Space.schedule(function () {
        flySwing();
      }, 0.1);
    }

    function blinkR() {
      frog.blink();
      // leftEye.blink();
      // rightEye.blink();
      var r = getRandom(3, 5);
      Space.schedule(function () {
        blinkR();
      }, r);
    }

    var currentPos = 2;

    function moveEyesR() {
      var r = getRandom(1, 3);
      if (r > currentPos) {
        for (var i = currentPos; i < r; i++) {
          frog.leftEye.right();
          frog.rightEye.right();
        }
      } else if (currentPos > r) {
        for (i = r; i < currentPos; i++) {
          frog.leftEye.left();
          frog.rightEye.left();
        }
      }
      currentPos = r;
      Space.schedule(function () {
        moveEyesR();
      }, r);
    }

    flySwing();
    blinkR();
    moveEyesR();
  });
});