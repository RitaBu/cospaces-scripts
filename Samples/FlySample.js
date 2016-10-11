Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/", function () {
  require(['Fly'], function (Fly) {

    var fly = new Fly(Space.item("q5VWCw7hVA"));

    Space.scheduleRepeating(function () {
      fly.update();
    }, 0);

    function flySwing() {
      fly.swing();
      Space.schedule(function () {
        flySwing();
      }, 0.1);
    }

    flySwing();
  });
});