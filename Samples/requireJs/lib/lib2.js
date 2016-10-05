define(["./lib1"], function(lib1) {
  var Lib2 = function() {
  };

  Lib2.prototype.getName = function() {
    return (new lib1()).getName();
  };

  return Lib2;
});