define(['../formations/Circle', '../formations/Spiral'], function (Circle, Spiral) {
  return function (distance, chord, r, startAngle, distAngle, itemsPerSpiral) {
    var c = new Circle(r, startAngle, distAngle);

    var n = 0;
    var center = null;
    var s = null;
    this.next = function () {
      if (!center || !s) {
        center = c.next();
        s = new Spiral(distance, chord)
      }
      var onSpiral = s.next();
      var pos = {x: onSpiral.x + center.x, y: onSpiral.y + center.y};
      n++;
      if (n >= itemsPerSpiral) {
        center = null;
        n = 0;
      }

      return pos;
    }
  };
});
