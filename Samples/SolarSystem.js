var earthScale = 1;

var Color = function (red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;
};

var Sun = function () {
  var sun = Space.createItem("Cloud", 0, 0, 0);
  sun.setScale(4);
  sun.setColor(255, 255, 0);
  var sunCore = Space.createItem("Sphere", 0, 0, 0.25);
  sunCore.setScale(3);
  sunCore.setColor(255, 255, 0);
};

var Planet = function (scale, orbit, color, z) {
  this.item = Space.createItem("Sphere", orbit, 0, z);
  this.item.setScale(scale);
  this.orbit = orbit;
  this.item.setColor(color.red, color.green, color.blue);
  this.z = z;
};

Planet.prototype.setPosition = function (x, y, z) {
  this.item.setPosition(x, y, z);
};

new Sun();

var earth = new Planet(earthScale, 3, new Color(135, 206, 250), 0.5);
var mars = new Planet(earthScale * 0.53, 5, new Color(220, 20, 60), 1);
var jupiter = new Planet(earthScale * 11.19, 17, new Color(105, 105, 105), -11.19/4);

var earthAnimator;
var marsAnimator;
var jupiterAnimator;

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/animation/", function () {
  require(['animation', "CyclingAnimator"], function (animation, CyclingAnimator) {

    function createEarthAnimation() {
      return new animation.Animation("Orbit", 3, function (anim) {
        var p = 360 * anim.getProgress() * Math.PI / 180;
        // Space.log("Progress: " + p);
        earth.setPosition(earth.orbit * Math.cos(p), earth.orbit * Math.sin(p), earth.z);
      });
    }

    function createMarsAnimation() {
      return new animation.Animation("Orbit", 6, function (anim) {
        var p = 360 * anim.getProgress() * Math.PI / 180;
        mars.setPosition(mars.orbit * Math.cos(p), mars.orbit * Math.sin(p), mars.z);
      });
    }

    function createJupiterAnimation() {
      return new animation.Animation("Orbit", 16, function (anim) {
        var p = 360 * anim.getProgress() * Math.PI / 180;
        jupiter.setPosition(jupiter.orbit * Math.cos(p), jupiter.orbit * Math.sin(p), jupiter.z);
      });
    }

    earthAnimator = new CyclingAnimator(createEarthAnimation);
    marsAnimator = new CyclingAnimator(createMarsAnimation);
    jupiterAnimator = new CyclingAnimator(createJupiterAnimation);

    Space.scheduleRepeating(function () {
      earthAnimator.update();
      marsAnimator.update();
      jupiterAnimator.update();
    }, 0);
  });
});
