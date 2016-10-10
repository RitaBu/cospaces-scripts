var earthScale = 1;
var earthAnimationDuration = 3;

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
var jupiter = new Planet(earthScale * 11.19, 17, new Color(105, 105, 105), -11.19 / 4);

var earthAnimator;
var marsAnimator;
var jupiterAnimator;

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/animation/", function () {
  require(['animation', "CyclingAnimator"], function (animation, CyclingAnimator) {

    function createPlanetAnimation(planet, duration) {
      return new animation.Animation("Orbit", duration, function (anim) {
        var p = 360 * anim.getProgress() * Math.PI / 180;
        planet.setPosition(planet.orbit * Math.cos(p), planet.orbit * Math.sin(p), planet.z);
      });
    }

    earthAnimator = new CyclingAnimator(function () {return createPlanetAnimation(earth, earthAnimationDuration)});
    marsAnimator = new CyclingAnimator(function () {return createPlanetAnimation(mars, earthAnimationDuration * 2)});
    jupiterAnimator = new CyclingAnimator(function () {return createPlanetAnimation(jupiter, earthAnimationDuration * 5)});

    Space.scheduleRepeating(function () {
      earthAnimator.update();
      marsAnimator.update();
      jupiterAnimator.update();
    }, 0);
  });
});
