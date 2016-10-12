//https://studio.cospaces.io/#Project:H0DmHz-g9K8.G82KTNh1She:BLXfBnTrrnt.FWK6VyWLEmk
//User 1

function blink(pupil) {
  pupil.setColor(255, 255, 255);
  Space.schedule(function () {
    pupil.setColor(0, 0, 0);
  }, 0.06);
}

function blinkRepeat(eye) {
  var pupil = eye.getPart("pupil");
  blink(pupil);
  Space.schedule(function () {
    blinkRepeat(eye);
  }, 3);
}

var leftEye = Space.getItem("fdDAOhkXP5");
var rightEye = Space.getItem("naihDdoqEK");

blinkRepeat(leftEye);
blinkRepeat(rightEye);
