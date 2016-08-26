Formation = {
  rect: function (rows, cols, distX, distY, callback) {
    for (var i = 0; i < rows; ++i) {
      for (var j = 0; j < cols; ++j) {
        callback(distX * j, distY * i);
      }
    }
  },

  circle: function (r, startAngle, endAngle, distAngle, callback) {
    for (var angle = startAngle; angle < endAngle; angle += distAngle) {
      callback(r * Math.cos(angle), r * Math.sin(angle));
    }
  },

  spiral: function (angle, distance, chord, callback) {
    for (var theta = chord / distance; theta <= angle;) {
      var r = distance * theta;
      var x = r * Math.cos(theta);
      var y = r * Math.sin(theta);
      theta += chord / r;
      callback(x, y);
    }
  },

  Spiral: function(distance, chord) {
    var theta = chord / distance;

    this.next = function() {
      var r = distance * theta;
      var x = r * Math.cos(theta);
      var y = r * Math.sin(theta);
      theta += chord / r;

      return {x: x, y: y};
    }
  }
};