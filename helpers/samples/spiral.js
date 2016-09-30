Space.items().forEach(function (item) {
  item.remove();
});

Space.loadScript("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/formations/formation.js", function () {
  var spiral = new Formation.Spiral(1, 1);
  var n = 0;
  (function newItem() {
    Space.schedule(function() {
      var next = spiral.next();
      Space.createItem("Sphere", next.x, next.y);
      if (++n < 100) {
        newItem();
      }
    }, 0.2);
  })();
});
