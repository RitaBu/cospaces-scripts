function blink(pupil) {
  pupil.setColor(255, 255, 255);
  DX.runLater(function () {
    pupil.setColor(0, 0, 0);
  }, 0.1);
}

function blinkRepeat(eye) {
  var pupil = eye.part("pupil");
  blink(pupil);
  DX.runLater(function () {
    blinkRepeat(eye);
  }, 3);
}

var leftEye = DX.item("fdDAOhkXP5");
var rightEye = DX.item("naihDdoqEK");

blinkRepeat(leftEye);
blinkRepeat(rightEye);