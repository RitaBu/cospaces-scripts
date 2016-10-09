var earthScale = 1;

var sun = Space.createItem("Cloud", 0, 0, 0);
sun.setScale(4);
sun.setColor(255, 255, 0);
var sunCore = Space.createItem("Sphere", 0, 0, 0.25);
sunCore.setScale(3);
sunCore.setColor(255, 255, 0);

var earthOrbit = 3;
var earthZ = 1;
var earth = Space.createItem("Sphere", earthOrbit, 0, earthZ);
earth.setScale(earthScale);
earth.setColor(135, 206, 250);

var marsOrbit = 5;
var marsZ = 1;
var mars = Space.createItem("Sphere", marsOrbit, 0, marsZ);
mars.setScale(earthScale * 0.53);
mars.setColor(220, 20, 60);

var jupiterOrbit = 17;
var jupiterZ = -11.19/4;
var jupiter = Space.createItem("Sphere", jupiterOrbit, 0, jupiterZ);
jupiter.setScale(earthScale * 11.19);
jupiter.setColor(105, 105, 105);

var earthAnimator;
var marsAnimator;
var jupiterAnimator;

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/animation/", function () {
  require(['animation', "CyclingAnimator"], function (animation, CyclingAnimator) {

    function createEarthAnimation() {
      return new animation.Animation("Orbit", 3, function (anim) {
        var p = 360 * anim.getProgress() * Math.PI / 180;
        // Space.log("Progress: " + p);
        earth.setPosition(earthOrbit * Math.cos(p), earthOrbit * Math.sin(p), earthZ, true);
      });
    }

    function createMarsAnimation() {
      return new animation.Animation("Orbit", 6, function (anim) {
        var p = 360 * anim.getProgress() * Math.PI / 180;
        mars.setPosition(marsOrbit * Math.cos(p), marsOrbit * Math.sin(p), marsZ, true);
      });
    }

    function createJupiterAnimation() {
      return new animation.Animation("Orbit", 16, function (anim) {
        var p = 360 * anim.getProgress() * Math.PI / 180;
        jupiter.setPosition(jupiterOrbit * Math.cos(p), jupiterOrbit * Math.sin(p), jupiterZ, true);
      });
    }

    earthAnimator = new CyclingAnimator(createEarthAnimation, false);
    marsAnimator = new CyclingAnimator(createMarsAnimation, false);
    jupiterAnimator = new CyclingAnimator(createJupiterAnimation, true);

    Space.scheduleRepeating(function () {
      earthAnimator.update();
      marsAnimator.update();
      jupiterAnimator.update();
    }, 0);
  });
});
