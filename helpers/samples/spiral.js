Space.items().forEach(function (item) {
  item.remove();
});

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/", function () {
  require(['formations/Spiral'], function (Spiral) {
    var spiral = new Spiral(1, 1);
    var n = 0;
    (function newItem() {
      Space.schedule(function () {
        var next = spiral.next();
        Space.createItem("Sphere", next.x, next.y);
        if (++n < 100) {
          newItem();
        }
      }, 0.2);
    })();
  });
});
