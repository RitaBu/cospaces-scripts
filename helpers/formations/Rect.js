define(function () {
  return function (cols, distX, distY) {
    var i = 0;
    var j = 0;
    this.next = function () {
      var x = distX * j;
      var y = distY * i;
      j++;
      if (j >= cols) {
        j = 0;
        i++;
      }

      return {x: x, y: y};
    }
  };
});
