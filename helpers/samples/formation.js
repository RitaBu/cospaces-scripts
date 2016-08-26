function clear() {
  DX.items().forEach(function (item) {
    item.remove();
  });
}

DX.loadScript("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/helpers/formations/formation.js", function () {
  var funcs = [
    function () {
      Formation.rect(5, 5, 1, 1, function (x, y) {
        DX.createItem("Sphere", x, y, 0);
      });
    },

    function () {
      Formation.spiral(Math.PI * 6, 1, 1, function (x, y) {
        DX.createItem("Sphere", x, y, 0);
      });
    },

    function () {
      Formation.circle(5, 0, Math.PI * 2, Math.PI / 6, function (x, y) {
        DX.createItem("Sphere", x, y, 0);
      });
    }
  ];

  var next = function (i) {
    clear();
    funcs[i]();
    DX.runLater(function () {
      i += 1;
      i %= funcs.length;
      next(i);
    }, 2)
  };

  next(0);
});
