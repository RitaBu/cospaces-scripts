var s = Space.resource("899add87ab9b5d7f04d83c6e040abb581b6363bf90271af7a064e4398bfef6a2");

s.play(true);

var mainRotorItem = Space.item("q7lQAi7BPE");
var tailRotorItem = Space.item("d7eXQCxY5A");

Space.scheduleRepeating(function () {
  mainRotorItem.rotateLocalAxis(0, 0, 0, 0, 0, 3, 5 * Math.PI / 180, true);
  tailRotorItem.rotateLocalAxis(0, 0, 0, 0, 0, 3, 10 * Math.PI / 180, true);
}, 0);

var animatedObject_js = "https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/AnimatedEye.js";

function init() {
  Space.log("Everything loaded. Starting...");
}

Space.loadScript(animatedObject_js, init);
