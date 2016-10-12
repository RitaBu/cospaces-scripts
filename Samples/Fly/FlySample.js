Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/", function () {
  require(['Fly/Fly', 'Frog/Frog'], function (Fly, Frog) {

    var fly = new Fly(Space.item("q5VWCw7hVA"));
    var frog = new Frog(Space.item("rmGHz2ajS6"));

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
          frog.lookRight();
        }
      } else if (currentPos > r) {
        for (i = r; i < currentPos; i++) {
          frog.lookLeft();
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