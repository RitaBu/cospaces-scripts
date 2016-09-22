// http://newcospaces.dx.labs.intellij.net/shorten/nNyw
// https://cospac.es/YKGQ

var tank1 = DX.item("tank1");
var water1 = DX.item("water1");
var water2 = DX.item("water2");
var pipe = DX.item("pipe");
var w = DX.item("weight");
var h = tank1.getHeight();
var weight = true;

pipe.setColor(0, 100, 255);
water1.setNumVertices(64);
water2.setNumVertices(64);

resetWithWeight();

var exec = false;

DX.setHeartbeatInterval(0.01);
DX.heartbeat(function (dt) {
  var step = 0.02;
  var h1 = water1.getHeight();
  var h2 = water2.getHeight();
  var pos;
  if (weight) {
    if (h1 > 0) {
      water1.setHeight(h1 - step);
      water2.setHeight(h2 + step);
      pos = water1.position();
      w.setPosition(pos[0], pos[1], pos[2] + water1.getHeight());
    }
    else {
      pipe.setColor(255, 255, 255);
      if (!exec) {
        exec = true;
        DX.runLater(resetWithoutWeight, 1);
      }
    }
  }
  else {
    if (h2 > h1) {
      water1.setHeight(h1 + step);
      water2.setHeight(h2 - step);
    }
    else {
      if (!exec) {
        exec = true;
        DX.runLater(resetWithWeight, 1);
      }
    }

  }
});

function resetWithWeight() {
  water1.setHeight(h * 0.5 - 0.1);
  water2.setHeight(h * 0.5 - 0.1);
  var pos = water1.position();
  w.setPosition(pos[0], pos[1], pos[2] + water1.getHeight());
  weight = true;
  exec = false;
}

function resetWithoutWeight() {
  pipe.setColor(0, 100, 255);
  w.setPosition(5, 0, 0);
  weight = false;
  exec = false;
}
