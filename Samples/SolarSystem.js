var sun = Space.createItem("Sphere", 0, 0, 0);
sun.setScale(5);
sun.setColor(255, 255, 0);

var earth = Space.createItem("Sphere", 3, 0, 1);
earth.setColor(135, 206, 250);

var earthAnimation;
var earthAnimator;

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/animation/", function () {
  require(['animation', "CyclingAnimator"], function (animation, CyclingAnimator) {

    function createEarthAnimation() {
      return new animation.Animation("Orbit", 6, function (anim) {
        var p = 360 * anim.getProgress() * Math.PI / 180;
        // Space.log("Progress: " + p);
        earth.setPosition(3 * Math.cos(p), 3 * Math.sin(p), 1, true);
      });
    }

    earthAnimation = createEarthAnimation();
    earthAnimator = new CyclingAnimator(createEarthAnimation);

    Space.scheduleRepeating(function () {
      earthAnimator.update();
    }, 0);
  });
});
