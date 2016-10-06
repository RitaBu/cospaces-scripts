Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/animation", function() {
  require(["Animator"]);
});

var pacman = Space.item("jpVlEPRfcw");

var Pacman = function (item) {
  this.item = item;
};