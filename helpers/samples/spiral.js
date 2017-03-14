Scene.clear();

Scene.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/", function () {
  require(['formations/Spiral'], function (Spiral) {
    var spiral = new Spiral(1, 1);
    var n = 0;
    (function newItem() {
      Scene.schedule(function () {
        var next = spiral.next();
        Scene.createItem("Sphere", next.x, next.y, 0);
        if (++n < 100) {
          newItem();
        }
      }, 0.2);
    })();
  });
});
