// http://newcospaces.dx.labs.intellij.net/shorten/nNyw
// https://cospac.es/YKGQ

var tank1 = Space.item("tank1");
var water1 = Space.item("water1");
var water2 = Space.item("water2");
var pipe = Space.item("pipe");
var w = Space.item("weight");
var h = tank1.getHeight();
var weight = true;

pipe.setColor(0, 100, 255);
water1.setNumVertices(64);
water2.setNumVertices(64);

resetWithWeight();

var interval = 0.01;

Space.schedule(update, interval);

function update(){
  var step = 0.04;
  var h1 = water1.getHeight();
  var h2 = water2.getHeight();
  if(weight){
    if(h1 > 0){
      water1.setHeight(h1 - step);
      water2.setHeight(h2 + step);
      pos = water1.position();
      w.setPosition(pos[0], pos[1], pos[2] + water1.getHeight());
      Space.schedule(update, interval);
    }
    else{
      pipe.setColor(255,255,255);
      Space.schedule(resetWithoutWeight, 1);
    }
  }
  else{
    if(h2 > h1){
      water1.setHeight(h1 + step);
      water2.setHeight(h2 - step);
      Space.schedule(update, interval);
    }
    else{
      Space.schedule(resetWithWeight, 1);
    }

  }
}

function resetWithWeight(){
  water1.setHeight(h * 0.5 - 0.1);
  water2.setHeight(h * 0.5 - 0.1);
  pos = water1.position();
  w.setPosition(pos[0], pos[1], pos[2] + water1.getHeight());
  weight = true;
  Space.schedule(update, interval);
}

function resetWithoutWeight(){
  pipe.setColor(0, 100, 255);
  w.setPosition(5, 0, 0);
  weight = false;
  Space.schedule(update, interval);
}
