const SHOW_ORBITS = true;

var earthScale = 1;
var earthAnimationDuration = 3;

// Converts from degrees to radians.
Math.radians = function (degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
  return radians * 180 / Math.PI;
};

var Color = function (red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;
};

var Sun = function () {
  var sun = Space.createItem("Cloud", 0, 0, -1);
  sun.setScale(4);
  sun.setColor(255, 255, 0);
  var sunCore = Space.createItem("Sphere", 0, 0, -0.75);
  sunCore.setScale(3);
  sunCore.setColor(255, 255, 0);
};

var Planet = function (item, scale, orbit, color, z) {
  if (item !== null) {
    this.item = item;
    this.item.setPosition(0, 0, z);
  } else {
    this.item = Space.createItem("Sphere", orbit, 0, 0, z);
    this.item.setScale(scale);
    this.item.setColor(color.red, color.green, color.blue);
  }
  this.orbit = orbit;
  this.z = z;
  if (SHOW_ORBITS) {
    this.orbitItem = Space.createItem("Torus", 0, 0, 0);
    this.orbitItem.setColor(128, 128, 128);
    this.orbitItem.setMajorX(orbit);
    var d = 0.02;
    this.orbitItem.setMinorX(d);
    this.orbitItem.setMinorZ(d);
  }
};

Planet.prototype.setPosition = function (x, y, z) {
  this.item.setPosition(x, y, z);
};

new Sun();

var earth = new Planet(Space.item("Jqy4MACT23"), earthScale, 3, new Color(135, 206, 250), -0.5);
var mars = new Planet(null, earthScale * 0.53, 5, new Color(220, 20, 60), -0.5);
var jupiter = new Planet(Space.item("7sN5plXgah"), earthScale * 11.19, 17, new Color(105, 105, 105), -11.19 / 2);
var saturn = new Planet(Space.item("yXEVdXBOZJ"), earthScale * 11.19, 29, new Color(105, 255, 105), -1);

var earthAnimator;
var marsAnimator;
var jupiterAnimator;
var saturnAnimator;
var saturnSpinAnimator;

Space.setMood(0);

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/animation/", function () {
  require(['animation', "CyclingAnimator"], function (animation, CyclingAnimator) {

    function createPlanetOrbitAnimation(planet, duration) {
      return new animation.Animation("Orbit", duration, function (anim) {
        var p = 360 * anim.getProgress() * Math.PI / 180;
        planet.setPosition(planet.orbit * Math.cos(p), planet.orbit * Math.sin(p), planet.z);
      });
    }

    function createPlanetSpinAnimation(planet, duration) {
      return new animation.Animation("Spin", duration, (function () {
        var lastProgress = 0;
        const angle = 360;
        return function (anim) {
          var p = lastProgress;
          lastProgress = angle * anim.getProgress();
          //Project.log(anim.toString() + " lastProgress = " + lastProgress);
          //planet.addLocalRotation(0, 0, 0, 0, 0, 1, Math.radians(-(lastProgress - p)), true);
        };
      })());
    }

    earthAnimator = new CyclingAnimator(function () {return createPlanetOrbitAnimation(earth, earthAnimationDuration)});
    marsAnimator = new CyclingAnimator(function () {return createPlanetOrbitAnimation(mars, earthAnimationDuration * 2)});
    jupiterAnimator = new CyclingAnimator(function () {return createPlanetOrbitAnimation(jupiter, earthAnimationDuration * 12)});
    saturnAnimator = new CyclingAnimator(function () {return createPlanetOrbitAnimation(saturn, earthAnimationDuration * 29)});
    saturnSpinAnimator = new CyclingAnimator(function () {return createPlanetSpinAnimation(saturn, 2)});

    Space.scheduleRepeating(function () {
      earthAnimator.update();
      marsAnimator.update();
      jupiterAnimator.update();
      saturnAnimator.update();
      saturnSpinAnimator.update();
    }, 0);
  });
});
