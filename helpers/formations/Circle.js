define(function () {
  return function (r, startAngle, distAngle) {
    this.next = function () {
      var x = r * Math.cos(startAngle);
      var y = r * Math.sin(startAngle);
      startAngle += distAngle;

      return {x: x, y: y};
    }
  };
});
