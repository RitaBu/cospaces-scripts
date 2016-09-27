function blink(obj) {
  obj.setColor(255, 255, 255);
  DX.runLater(function () {
    obj.setColor(0, 0, 0);
  }, 0.5);
}