//https://studio.cospaces.io/#Project:H0DmHz-g9K8.G82KTNh1She:BLXfBnTrrnt.FWK6VyWLEmk
//User 1

function blink(pupil) {
  pupil.setColor(255, 255, 255);
  Space.schedule(function () {
    pupil.setColor(0, 0, 0);
  }, 0.06);
}

function blinkRepeat(eye) {
  var pupil = eye.part("pupil");
  blink(pupil);
  Space.schedule(function () {
    blinkRepeat(eye);
  }, 3);
}

var leftEye = DX.item("fdDAOhkXP5");
var rightEye = DX.item("naihDdoqEK");

blinkRepeat(leftEye);
blinkRepeat(rightEye);

moveRight(leftEye);

var beginTime = 0;
var totalTime = 0;

Space.scheduleRepeating(function (dt) {
  if (beginTime === 0) {
    beginTime = dt;
  }
  totalTime += dt;
  Space.log(totalTime);
}, 0);