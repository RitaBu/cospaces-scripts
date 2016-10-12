Space.clear();

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/", function () {
  require(['formations/Spiral', 'formations/Circle', 'formations/Rect'], function (Spiral, Circle, Rect) {
    var n = 50;
    var items = [];
    for (var i = 0; i < n; ++i) {
      items.push(Space.createItem("Sphere"));
    }

    function getFormation(i) {
      switch (i) {
        case 0:
          return new Rect(10, 1, 1);
        case 1:
          return new Circle(5, 0, Math.PI * 2 / n);
        default:
          return new Spiral(1, 1);
      }
    }

    (function newFormation(i) {
      var formation = getFormation(i);
      items.forEach(function (item) {
        var next = formation.next();
        item.throwTo(next.x, next.y, 0, Math.random() * 10 + 0.1);
      });
      Space.schedule(function () {
        newFormation((i + 1) % 3);
      }, 5);
    })(0);
  });
});
