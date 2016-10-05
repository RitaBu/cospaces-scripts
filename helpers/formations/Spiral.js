define(function () {
  return function (distance, chord) {
    var theta = chord / distance;

    this.next = function () {
      var r = distance * theta;
      var x = r * Math.cos(theta);
      var y = r * Math.sin(theta);
      theta += chord / r;

      return {x: x, y: y};
    }
  };
});
