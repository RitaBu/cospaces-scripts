Space.items().forEach(function (item) {
  item.remove();
});

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/", function () {
  require(['samples/CircleOfSpirals'], function (CircleOfSpirals) {
    var formation = new CircleOfSpirals(0.1, 0.5, 5, 0, Math.PI * 2 / 10, 10);
    var n = 0;
    (function newItem() {
      Space.schedule(function () {
        var next = formation.next();
        Space.createItem("Sphere", next.x, next.y);
        if (++n < 100) {
          newItem();
        }
      }, 0.1);
    })();
  });
});
