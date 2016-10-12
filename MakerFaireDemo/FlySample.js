var frogSound = Space.loadSound("a01b4a147ef61b660f9bdecdb0eb54a031299b3dcf617a2bd84f893329c99122");
var flySound = Space.loadSound("1df61e9d62778eaeccb6f521decbc6bae18e364bfc6dbc1bcd1867a2826a95d6");

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/", function () {
  require(['Fly/Fly', 'Frog/Frog'], function (Fly, Frog) {

    var fly = new Fly(Space.getItem("9OMwazjWDz"));
    var frog = new Frog(Space.getItem("pmWoOSsnSi"));

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

    function tongueR() {
      frog.tongueToggle();
      var r = getRandom(3, 5);
      Space.schedule(function () {
        tongueR();
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