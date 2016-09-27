//https://studio.cospaces.io/#Project:H0DmHz-g9K8.G82KTNh1She:BLXfBnTrrnt.FWK6VyWLEmk
//Space 2

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

function moveRight(eye) {
  var pupil = eye.part("pupil");
  // pupil.move();
}

var leftEye = DX.item("NuOg0NAxT2");
var eyeLid = DX.item("mNZuW8CSs4");

blinkRepeat(leftEye);

moveRight(leftEye);
