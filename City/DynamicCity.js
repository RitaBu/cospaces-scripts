var city = Space.createCity(4, 4, 2);
var rs = city.getRoadSize() / 4;
var bs = city.getBlockSize() / 2;

var carScale = 0.3;

function createPathFromPoints(points) {
  var vec = [];
  var nl = points.length;
  for (var i = 0; i < nl; i++) {
    var h = points[i][0];
    var w = points[i][1];
    var nh = points[(i + 1) % nl][0];
    var nw = points[(i + 1) % nl][1];
    var bp = city.getBlockPosition(h, w);
    var nbp = city.getBlockPosition(nh, nw);
    var xo = 0, yo = 0;
    if (h == nh) {
      if (w < nw) {
        yo = -rs;
      }
      else {
        yo = rs;
      }
    }
    else {
      if (h < nh) {
        xo = -rs;
      }
      else {
        xo = rs;
      }
    }
    var x = bp.x + xo;
    var y = bp.y + yo;
    var nx = nbp.x + xo;
    var ny = nbp.y + yo;

    var dx = nx - x;
    var dy = ny - y;
    var l = Math.sqrt(dx * dx + dy * dy);
    dx /= l;
    dy /= l;

    var r = 2;
    var v1 = Space.createVectorItem(x + dx * bs, y + dy * bs, 0, dx, dy, 0);
    var v2 = Space.createVectorItem(nx - dx * bs * r, ny - dy * bs * r, 0, dx, dy, 0);
    vec.push(v1);
    vec.push(v2);
  }
  return vec;
}

/*
City.addCarsToPath(vec, n, function (i) {
  var car;
  if (n < 5) {
    car = Space.createItem("LP_Bus", 0, 0, 0);
    car.setScale(0.5);
    car.setColor(0, 255, 0);
  } else {
    car = Space.createItem("LP_Car", 0, 0, 0);
    car.setColor(255, 255, 0);
  }
  return car;
});
*/

function addCarsToPath(vec, n, color) {
  var nl = vec.length;
  var car;
  for (var i = 0; i < n; i++) {
    var line = Space.createCurveLineItem();
    for (var j = i; j <= i + nl; j++) {
      line.addVertex(vec[j % nl].id());
    }
    var modelId = "LP_Car";
    car = Space.createItem(modelId, vec[i].position().x, vec[i].position().y, 0);
    if (color != null) {
      car.setColor(color[0], color[1], color[2]);
    }

    car.addToBezier3DPathCurve(line.id());
    car.finishBezier3DPath(2, true);
    car.setScale(carScale);
  }
  return car;
}

function createPath1() {
  var points = [];
  points.push([0, 0]);
  points.push([0, 3]);
  points.push([1, 3]);
  points.push([1, 0]);
  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 8);
}

function createPath2() {
  var points = [];
  points.push([0, 3]);
  points.push([3, 3]);
  points.push([3, 0]);
  points.push([0, 0]);
  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 8);
}

function createPath3() {
  var points = [];
  points.push([1, 3]);
  points.push([1, 0]);
  points.push([2, 0]);
  points.push([2, 3]);
  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 8);
}

function createPath4() {
  var points = [];
  points.push([1, 1]);
  points.push([1, 2]);
  points.push([2, 2]);
  points.push([2, 1]);
  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 8);
}

var trafficLightModelId = "%%98efa9b173c24d877a7d54f51889bc5a7d98d0b9b747c4e771cf53589e1b41fc:";
var states = ["D", "C", "A", "B"];

function addTrafficLight(h, w, dt) {
  var pos = city.getBlockPosition(h, w);
  var x = pos.x;
  var y = pos.y;
  var d = 0.6 * bs;
  Space.log(x + " " + y);
  var item0 = Space.createItem(trafficLightModelId + states[0], x + d, y + d, 0);
  item0.setRotationOZ(1, 0, true);
  item0.setProperty("light", "red");

  var item1 = Space.createItem(trafficLightModelId + states[0], x - d, y - d, 0);
  item1.setRotationOZ(-1, 0, true);
  item1.setProperty("light", "red");

  var item2 = Space.createItem(trafficLightModelId + states[0], x - d, y + d, 0);
  item2.setRotationOZ(0, 1, true);
  item2.setProperty("light", "red");

  var item3 = Space.createItem(trafficLightModelId + states[0], x + d, y - d, 0);
  item3.setRotationOZ(0, -1, true);
  item3.setProperty("light", "red");

  var index = 0;

  function tick() {
    index = (index + 1) % 4;
    var pause;

    if (index === 0) {
      item0.setProperty("light", "red");
      item0.setModelId(trafficLightModelId + states[0]);
      item1.setProperty("light", "red");
      item1.setModelId(trafficLightModelId + states[0]);

      item2.setProperty("light", "green");
      item2.setModelId(trafficLightModelId + states[2]);
      item3.setProperty("light", "green");
      item3.setModelId(trafficLightModelId + states[2]);
      pause = 6;
    } else if (index === 2) {
      item0.setProperty("light", "green");
      item0.setModelId(trafficLightModelId + states[2]);
      item1.setProperty("light", "green");
      item1.setModelId(trafficLightModelId + states[2]);

      item2.setProperty("light", "red");
      item2.setModelId(trafficLightModelId + states[0]);
      item3.setProperty("light", "red");
      item3.setModelId(trafficLightModelId + states[0]);
      pause = 6;
    } else {
      item0.setProperty("light", "yellow");
      item0.setModelId(trafficLightModelId + states[3]);
      item1.setProperty("light", "yellow");
      item1.setModelId(trafficLightModelId + states[3]);

      item2.setProperty("light", "yellow");
      item2.setModelId(trafficLightModelId + states[3]);
      item3.setProperty("light", "yellow");
      item3.setModelId(trafficLightModelId + states[3]);
      pause = 3;
    }
    Space.schedule(tick, pause);
  }

  Space.schedule(tick, 1 + dt);
}

createPath1();
createPath2();
createPath3();
createPath4();

addTrafficLight(1, 1, 0);
addTrafficLight(1, 2, 1);
addTrafficLight(2, 1, 1);
addTrafficLight(2, 2, 0);

Space.setCarDriveController(1, 0.5);
Space.setRenderShadows(false);
Space.setRenderServiceItems(true);