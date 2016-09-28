//https://studio.cospaces.io/#Project:H0DmHz-g9K8.G82KTNh1She:BLXfBnTrrnt.FWK6VyWLEmk
//Space 1

function blink(pupil) {
  pupil.setColor(255, 255, 255);
  DX.runLater(function () {
    pupil.setColor(0, 0, 0);
  }, 0.06);
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

var leftEye = DX.item("fdDAOhkXP5");
var rightEye = DX.item("naihDdoqEK");

blinkRepeat(leftEye);
blinkRepeat(rightEye);

moveRight(leftEye);

var beginTime = 0;
var totalTime = 0;

DX.setHeartbeatInterval(0);
DX.heartbeat(function (dt) {
  if (beginTime === 0) {
    beginTime = dt;
  }
  totalTime += dt;
  DX.log(totalTime);
});