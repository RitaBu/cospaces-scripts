var eye_js = "https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/Eye.js";

DX.loadScript(eye_js, function () {
  var eye = DX.item("naihDdoqEK");
  DX.runLater(blink(eye));
});

