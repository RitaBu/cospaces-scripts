//http://newcospaces.dx.labs.intellij.net/#Project:CkTcwhNsVW0.GWs1ktTIKDY:Bphqpl-f-jm.C26wI_GYLi5

//var carRed = Space.item("BTh_UtU_55K.H0gOeHQ3wlv");
//var carWhite = Space.item("Ymf-gS32OW.Eo_153VtdBr");
//var carYellow = Space.item("EGAKeuNSKxa.BqYcT_jbHir");
//var carGray = Space.item("DJK8m3pgBGC.HYAqM4LPD6c");
//var carBlue = Space.item("F9rOG_-g_5G.C1RZWXPbHsb");

//var colors = [carGray, carBlue, carRed, carWhite, carYellow];

function create(x, y, w, h) {
  var r = 2;
  var d = 1;

  var vec0 = Space.createVectorItem(-w + r + x, h + y, 0, d, 0, 0);
  var vec1 = Space.createVectorItem(w - r + x, h + y, 0, d, 0, 0);
  var vec2 = Space.createVectorItem(w + x, h - r + y, 0, 0, -d, 0);
  var vec3 = Space.createVectorItem(w + x, -h + r + y, 0, 0, -d, 0);

  var vec4 = Space.createVectorItem(w + x - r, -h + y, 0, -d, 0, 0);
  var vec5 = Space.createVectorItem(-w + r + x, -h + y, 0, -d, 0, 0);
  var vec6 = Space.createVectorItem(-w + x, -h + r + y, 0, 0, d, 0);
  var vec7 = Space.createVectorItem(-w + x, h - r + y, 0, 0, d, 0);

  var vec = [vec0, vec1, vec2, vec3, vec4, vec5, vec6, vec7];
  addCarsToPath(vec, 4);
}

function createPathFromPoints(points) {
  var vec = [];
  var nl = points.length;
  for (var i = 0; i < nl; i++) {
    var x = points[i][0];
    var y = points[i][1];
    var r = points[i][2];
    var nx = points[(i + 1) % nl][0];
    var ny = points[(i + 1) % nl][1];
    var nr = points[(i + 1) % nl][2];
    var dx = nx - x;
    var dy = ny - y;
    var l = Math.sqrt(dx * dx + dy * dy);
    dx /= l;
    dy /= l;
    var v1 = Space.createVectorItem(x + r * dx, y + r * dy, 0, dx, dy, 0);
    var v2 = Space.createVectorItem(nx - nr * dx, ny - nr * dy, 0, dx, dy, 0);
    vec.push(v1);
    vec.push(v2);
  }
  return vec;
}

function addCarsToPath(vec, n, color) {
  var nl = vec.length;
  var car;
  for (var i = 0; i < n; i++) {
    var line = Space.createCurveItem();
    for (var j = i; j <= i + nl; j++) {
      line.addVertex(vec[j % nl].id());
    }
    var modelId = i % 2 === 0 ? "LP_Car" : "LP_Bus";
    car = Space.createItem(modelId, vec[i].getPosition().x, vec[i].getPosition().y, 0);
    if (color != null)
      car.setColor(color[0], color[1], color[2]);
    car.moveBezier([line.id()], 2, true);
    car.setScale(0.8);
  }
  return car;
}

function path1(d, w1, h1, w2, h2) {
  var points = [];
  var r1 = 2;
  var r2 = 1.3;
  points.push([d, -d, r2]);
  points.push([w1, -d, r1]);
  points.push([w1, -d - h1 * 2, r1]);
  points.push([d, -d - h1 * 2, r1]);

  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 2, [0, 255, 100]);
}

function path2(d, w1, h1, w2, h2) {
  var points = [];
  var r1 = 2;
  //points.push([w1, -d, r1]);
  points.push([w1, -d - h1 * 2, r1]);
  points.push([d, -d - h1 * 2, r1]);
  points.push([d, d, r1]);
  points.push([-w1, d, r1]);
  points.push([-w1, d + h1 * 2, r1]);
  points.push([w1, d + h1 * 2, r1]);
  //points.push([w1, -d - h1 * 2, r1]);
  //points.push([-d, -d, r1]);

  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 3, [255, 0, 0]);
}

function longPath(d, w1, h1, w2, h2) {
  var points = [];
  var r1 = 2;
  var r2 = 1.3;
  points.push([-w1, -h2, r1]);
  points.push([-w1, -d, r1]);
  points.push([-d, -d, r2]);
  points.push([-d, -d - h1 * 2, r1]);
  points.push([-w1, -d - h1 * 2, r1]);
  points.push([-w1, d + h1 * 2, r1]);
  points.push([w1, d + h1 * 2, r1]);
  points.push([w1, -d - h1 * 2, r1]);
  points.push([d, -d - h1 * 2, r1]);
  points.push([d, -d, r2]);
  points.push([w1, -d, r1]);
  points.push([w1, -h2, r1]);

  points.push([d, -h2, r1]);
  points.push([d, -d, r2]);
  points.push([w1, -d, r1]);
  points.push([w1, -d - h1 * 2, r1]);
  points.push([d, -d - h1 * 2, r1]);
  points.push([d, h2, r1]);
  points.push([w1, h2, r1]);
  points.push([w1, d, r1]);
  points.push([-d, d, r1]);
  points.push([-d, -h2, r1]);

  var vec = createPathFromPoints(points);
  return addCarsToPath(vec, 1, [100, 100, 100]);
}

Space.renderShadows(false);
Space.renderServiceItems(false);

var file = "%%98efa9b173c24d877a7d54f51889bc5a7d98d0b9b747c4e771cf53589e1b41fc:"
var states = ["D", "C", "A", "B"];

var d = 1.8;
var item0 = Space.createItem(file + states[0], d, d, 0);
item0.setHorizontalDirection(1, 0);
item0.setProperty("light", "red");

var item1 = Space.createItem(file + states[0], -d, -d, 0);
item1.setHorizontalDirection(-1, 0);
item1.setProperty("light", "red");

var item2 = Space.createItem(file + states[0], -d, d, 0);
item2.setHorizontalDirection(0, 1);
item2.setProperty("light", "red");

var item3 = Space.createItem(file + states[0], d, -d, 0);
item3.setHorizontalDirection(0, -1);
item3.setProperty("light", "red");

create(0, 5, 10, 4);
create(0, -5, 10, 4);

create(5.5, 0, 4.5, 15);
create(-5.5, 0, 4.5, 15);

path1(1, 10, 4);
path2(1, 10, 4);

var focusCar = longPath(1, 10, 4, 4.5, 15);

Space.setCarDriveController(1, 0.5);

var index = 0;
function tick() {
  index = (index + 1) % 4;
  var pause;

  if (index === 0) {
    item0.setProperty("light", "red");
    item0.setModelId(file + states[0]);
    item1.setProperty("light", "red");
    item1.setModelId(file + states[0]);

    item2.setProperty("light", "green");
    item2.setModelId(file + states[2]);
    item3.setProperty("light", "green");
    item3.setModelId(file + states[2]);
    pause = 6;
  } else if (index === 2) {
    item0.setProperty("light", "green");
    item0.setModelId(file + states[2]);
    item1.setProperty("light", "green");
    item1.setModelId(file + states[2]);

    item2.setProperty("light", "red");
    item2.setModelId(file + states[0]);
    item3.setProperty("light", "red");
    item3.setModelId(file + states[0]);
    pause = 6;
  } else {
    item0.setProperty("light", "yellow");
    item0.setModelId(file + states[3]);
    item1.setProperty("light", "yellow");
    item1.setModelId(file + states[3]);

    item2.setProperty("light", "yellow");
    item2.setModelId(file + states[3]);
    item3.setProperty("light", "yellow");
    item3.setModelId(file + states[3]);
    pause = 3;
  }
  Space.schedule(tick, pause);
}

Space.schedule(tick, 1);
focusCar.focusOn(true);
//http://newcospaces.dx.labs.intellij.net/#Project:CkTcwhNsVW0.GWs1ktTIKDY:Bphqpl-f-jm.C26wI_GYLi5

//var carRed = Space.item("BTh_UtU_55K.H0gOeHQ3wlv");
//var carWhite = Space.item("Ymf-gS32OW.Eo_153VtdBr");
//var carYellow = Space.item("EGAKeuNSKxa.BqYcT_jbHir");
//var carGray = Space.item("DJK8m3pgBGC.HYAqM4LPD6c");
//var carBlue = Space.item("F9rOG_-g_5G.C1RZWXPbHsb");

//var colors = [carGray, carBlue, carRed, carWhite, carYellow];

function create(x, y, w, h) {
  var r = 2;
  var d = 1;

  var vec0 = Space.createVectorItem(-w + r + x, h + y, 0, d, 0, 0);
  var vec1 = Space.createVectorItem(w - r + x, h + y, 0, d, 0, 0);
  var vec2 = Space.createVectorItem(w + x, h - r + y, 0, 0, -d, 0);
  var vec3 = Space.createVectorItem(w + x, -h + r + y, 0, 0, -d, 0);

  var vec4 = Space.createVectorItem(w + x - r, -h + y, 0, -d, 0, 0);
  var vec5 = Space.createVectorItem(-w + r + x, -h + y, 0, -d, 0, 0);
  var vec6 = Space.createVectorItem(-w + x, -h + r + y, 0, 0, d, 0);
  var vec7 = Space.createVectorItem(-w + x, h - r + y, 0, 0, d, 0);

  var vec = [vec0, vec1, vec2, vec3, vec4, vec5, vec6, vec7];
  addCarsToPath(vec, 4);
}

function createPathFromPoints(points) {
  var vec = [];
  var nl = points.length;
  for (var i = 0; i < nl; i++) {
    var x = points[i][0];
    var y = points[i][1];
    var r = points[i][2];
    var nx = points[(i + 1) % nl][0];
    var ny = points[(i + 1) % nl][1];
    var nr = points[(i + 1) % nl][2];
    var dx = nx - x;
    var dy = ny - y;
    var l = Math.sqrt(dx * dx + dy * dy);
    dx /= l;
    dy /= l;
    var v1 = Space.createVectorItem(x + r * dx, y + r * dy, 0, dx, dy, 0);
    var v2 = Space.createVectorItem(nx - nr * dx, ny - nr * dy, 0, dx, dy, 0);
    vec.push(v1);
    vec.push(v2);
  }
  return vec;
}

function addCarsToPath(vec, n, color) {
  var nl = vec.length;
  var car;
  for (var i = 0; i < n; i++) {
    var line = Space.createCurveItem();
    for (var j = i; j <= i + nl; j++) {
      line.addVertex(vec[j % nl].id());
    }
    var modelId = i % 2 === 0 ? "LP_Car" : "LP_Bus";
    car = Space.createItem(modelId, vec[i].getPosition().x, vec[i].getPosition().y, 0);
    if (color != null)
      car.setColor(color[0], color[1], color[2]);
    car.moveBezier([line.id()], 2, true);
    car.setScale(0.8);
  }
  return car;
}

function path1(d, w1, h1, w2, h2) {
  var points = [];
  var r1 = 2;
  var r2 = 1.3;
  points.push([d, -d, r2]);
  points.push([w1, -d, r1]);
  points.push([w1, -d - h1 * 2, r1]);
  points.push([d, -d - h1 * 2, r1]);

  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 2, [0, 255, 100]);
}

function path2(d, w1, h1, w2, h2) {
  var points = [];
  var r1 = 2;
  //points.push([w1, -d, r1]);
  points.push([w1, -d - h1 * 2, r1]);
  points.push([d, -d - h1 * 2, r1]);
  points.push([d, d, r1]);
  points.push([-w1, d, r1]);
  points.push([-w1, d + h1 * 2, r1]);
  points.push([w1, d + h1 * 2, r1]);
  //points.push([w1, -d - h1 * 2, r1]);
  //points.push([-d, -d, r1]);

  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 3, [255, 0, 0]);
}

function longPath(d, w1, h1, w2, h2) {
  var points = [];
  var r1 = 2;
  var r2 = 1.3;
  points.push([-w1, -h2, r1]);
  points.push([-w1, -d, r1]);
  points.push([-d, -d, r2]);
  points.push([-d, -d - h1 * 2, r1]);
  points.push([-w1, -d - h1 * 2, r1]);
  points.push([-w1, d + h1 * 2, r1]);
  points.push([w1, d + h1 * 2, r1]);
  points.push([w1, -d - h1 * 2, r1]);
  points.push([d, -d - h1 * 2, r1]);
  points.push([d, -d, r2]);
  points.push([w1, -d, r1]);
  points.push([w1, -h2, r1]);

  points.push([d, -h2, r1]);
  points.push([d, -d, r2]);
  points.push([w1, -d, r1]);
  points.push([w1, -d - h1 * 2, r1]);
  points.push([d, -d - h1 * 2, r1]);
  points.push([d, h2, r1]);
  points.push([w1, h2, r1]);
  points.push([w1, d, r1]);
  points.push([-d, d, r1]);
  points.push([-d, -h2, r1]);

  var vec = createPathFromPoints(points);
  return addCarsToPath(vec, 1, [100, 100, 100]);
}

Space.renderShadows(false);
Space.renderServiceItems(false);

var file = "%%98efa9b173c24d877a7d54f51889bc5a7d98d0b9b747c4e771cf53589e1b41fc:"
var states = ["D", "C", "A", "B"];

var d = 1.8;
var item0 = Space.createItem(file + states[0], d, d, 0);
item0.setHorizontalDirection(1, 0);
item0.setProperty("light", "red");

var item1 = Space.createItem(file + states[0], -d, -d, 0);
item1.setHorizontalDirection(-1, 0);
item1.setProperty("light", "red");

var item2 = Space.createItem(file + states[0], -d, d, 0);
item2.setHorizontalDirection(0, 1);
item2.setProperty("light", "red");

var item3 = Space.createItem(file + states[0], d, -d, 0);
item3.setHorizontalDirection(0, -1);
item3.setProperty("light", "red");

create(0, 5, 10, 4);
create(0, -5, 10, 4);

create(5.5, 0, 4.5, 15);
create(-5.5, 0, 4.5, 15);

path1(1, 10, 4);
path2(1, 10, 4);

var focusCar = longPath(1, 10, 4, 4.5, 15);

Space.setCarDriveController(1, 0.5);

var index = 0;
function tick() {
  index = (index + 1) % 4;
  var pause;

  if (index === 0) {
    item0.setProperty("light", "red");
    item0.setModelId(file + states[0]);
    item1.setProperty("light", "red");
    item1.setModelId(file + states[0]);

    item2.setProperty("light", "green");
    item2.setModelId(file + states[2]);
    item3.setProperty("light", "green");
    item3.setModelId(file + states[2]);
    pause = 6;
  } else if (index === 2) {
    item0.setProperty("light", "green");
    item0.setModelId(file + states[2]);
    item1.setProperty("light", "green");
    item1.setModelId(file + states[2]);

    item2.setProperty("light", "red");
    item2.setModelId(file + states[0]);
    item3.setProperty("light", "red");
    item3.setModelId(file + states[0]);
    pause = 6;
  } else {
    item0.setProperty("light", "yellow");
    item0.setModelId(file + states[3]);
    item1.setProperty("light", "yellow");
    item1.setModelId(file + states[3]);

    item2.setProperty("light", "yellow");
    item2.setModelId(file + states[3]);
    item3.setProperty("light", "yellow");
    item3.setModelId(file + states[3]);
    pause = 3;
  }
  Space.schedule(tick, pause);
}

Space.schedule(tick, 1);
focusCar.focusOn(true);
