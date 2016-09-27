function blink(pupil) {
  pupil.setColor(255, 255, 255);
  DX.runLater(function () {
    pupil.setColor(0, 0, 0);
  }, 0.1);
}

function blinkRepeat(eye) {
  var pupil = eye.part("pupil");
  DX.runLater(function () {
    blink(pupil);
    blinkRepeat(eye);
  }, 3);
}

var leftEye = DX.item("naihDdoqEK");
var rightEye = DX.item("fdDAOhkXP5");

blinkRepeat(leftEye);
blinkRepeat(rightEye);