DX.Formation = DX.Formation || {};

DX.Formation.rect = function (rows, cols, distX, distY, callback) {
  for (var i = 0; i < rows; ++i) {
    for (var j = 0; j < cols; ++j) {
      callback(distX * j, distY * i);
    }
  }
};

DX.Formation.circle = function (r, startAngle, endAngle, distAngle, callback) {
  for (var angle = startAngle; angle < endAngle; angle += distAngle) {
    callback(r * Math.cos(angle), r * Math.sin(angle));
  }
};

DX.Formation.spiral = function (angle, distance, chord, callback) {
  for (var theta = chord / distance; theta <= angle;) {
    var r = distance * theta;
    var x = r * Math.cos(theta);
    var y = r * Math.sin(theta);
    theta += chord / r;
    callback(x, y);
  }
};