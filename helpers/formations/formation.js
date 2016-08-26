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

  Rect: function(cols, distX, distY) {
    var i = 0;
    var j = 0;
    this.next = function() {
      var x = distX * j;
      var y = distY * i;
      j++;
      if (j >= cols) {
        j = 0;
        i++;
      }

      return {x: x, y: y};
    }
  },

  Circle: function(r, startAngle, distAngle) {
    this.next = function() {
      var x = r * Math.cos(startAngle);
      var y = r * Math.sin(startAngle);
      startAngle += distAngle;

      return {x: x, y: y};
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