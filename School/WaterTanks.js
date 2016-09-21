// http://newcospaces.dx.labs.intellij.net/shorten/nNyw
// https://cospac.es/YKGQ

var f10 = DX.item("tank1");
var f1 = DX.item("water1");
var f2 = DX.item("water2");
var pipe = DX.item("pipe");
var w = DX.item("weight");
var h = f10.getHeight();
var weight = true;

pipe.setColor(0, 100, 255);
f1.setNumVertices(64);
f2.setNumVertices(64);

resetWithWeight();

var exec = false;

DX.setHeartbeatInterval(0.01);
DX.heartbeat(function(dt) {
  var step = 0.02;
  var h1 = f1.getHeight();
  var h2 = f2.getHeight();
  if(weight){
    if(h1 > 0){
      f1.setHeight(h1 - step);
      f2.setHeight(h2 + step);
      pos = f1.position();
      w.setPosition(pos[0], pos[1], pos[2] + f1.getHeight());
    }
    else{
      pipe.setColor(255,255,255);
      if(!exec){
        exec = true;
        DX.runLater(resetWithoutWeight, 1);
      }
    }
  }
  else{
    if(h2 > h1){
      f1.setHeight(h1 + step);
      f2.setHeight(h2 - step);
    }
    else{
      if(!exec){
        exec = true;
        DX.runLater(resetWithWeight, 1);
      }
    }

  }
});

function resetWithWeight(){
  f1.setHeight(h * 0.5 - 0.1);
  f2.setHeight(h * 0.5 - 0.1);
  pos = f1.position();
  w.setPosition(pos[0], pos[1], pos[2] + f1.getHeight());
  weight = true;
  exec = false;
}

function resetWithoutWeight(){
  pipe.setColor(0, 100, 255);
  w.setPosition(5, 0, 0);
  weight = false;
  exec = false;
}
