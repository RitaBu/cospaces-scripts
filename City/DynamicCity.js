var city = Space.createCity(3, 3, 1);

city.addTrees(1, 0, true);
city.addTrees(3, 0, true);

city.addTrees(3, 1, true);

city.addTrees(1, 3, true);
city.addTrees(2, 3, true);
city.addTrees(3, 3, true);

city.addTrees(0, 0, false);
city.addTrees(0, 1, false);
city.addTrees(0, 2, false);

city.addTrees(1, 0, false);
city.addTrees(1, 2, false);

city.addTrees(3, 0, false);
city.addTrees(3, 2, false);

city.rebuild();

var rs = city.roadSize() / 4;
var bs = city.blockSize() / 2;

var velocity = 2;

function Trajectory() {
  this.vertices = [];

  this.route = [];

  this.addNextDestination = function (h, w) {
    this.route.push([h, w]);
  };

  const RIGHT = 0;
  const UP = 1;
  const LEFT = 2;
  const DOWN = 3;

  this.createTrajectory = function () {
    var n = this.route.length;
    for (var i = 0; i < n; i++) {
      var prevH = this.route[(i + n - 1) % n][0];
      var prevW = this.route[(i + n - 1) % n][1];
      var curH = this.route[i][0];
      var curW = this.route[i][1];
      var nextH = this.route[(i + 1) % n][0];
      var nextW = this.route[(i + 1) % n][1];
      var bp = city.getBlockPosition(curH, curW);
      var inRoad;
      var outRoad;
      if (prevH == curH) {
        inRoad = prevW < curW ? LEFT : RIGHT;
      } else {
        inRoad = prevH < curH ? UP : DOWN;
      }
      if (nextH == curH) {
        outRoad = nextW > curW ? RIGHT : LEFT;
      } else {
        outRoad = nextH > curH ? DOWN : UP;
      }
      var inVec = this.createTurn(inRoad, -1);
      var outVec = this.createTurn(outRoad, 1);

      var r1 = bs * 0.4;
      var r2 = bs * 0.4;
      var v1 = Space.createVectorItem(bp.x + inVec[0], bp.y + inVec[1], 0.1, inVec[2] * r1, inVec[3] * r1, 0);
      var v2 = Space.createVectorItem(bp.x + outVec[0], bp.y + outVec[1], 0.1, outVec[2] * r2, outVec[3] * r2, 0);
      this.vertices.push(v1);
      this.vertices.push(v2);
    }
  };

  this.createTurn = function (pos, dir) {
    var shift = 1.3;
    switch (pos) {
      case RIGHT:
        return [bs, -dir * rs * shift, dir, 0];
      case UP:
        return [dir * rs * shift, bs, 0, dir];
      case LEFT:
        return [-bs, dir * rs * shift, -dir, 0];
      case DOWN:
        return [-dir * rs * shift, -bs, 0, -dir];
      default:
        return [0, 0, 0];
    }
  };

  this.addCars = function (n) {
    var nl = this.vertices.length;
    var car;
    for (var i = 0; i < n; i++) {
      var line = Space.createCurveItem();
      for (var j = i; j <= i + nl; j++) {
        line.addVertex(this.vertices[j % nl].id());
      }
      var modelId = i % 2 === 0 ? "LP_Car" : "LP_Bus";
      car = Space.createItem(modelId, this.vertices[i].getPosition().x, this.vertices[i].getPosition().y, 0.1);
      car.moveBezier([line.id()], velocity, true);
      car.setScale(0.8);
    }
    return car;
  };

}

function createPath1() {
  var tr = new Trajectory();
  tr.addNextDestination(0, 0);
  tr.addNextDestination(0, 3);
  tr.addNextDestination(1, 3);
  tr.addNextDestination(1, 0);
  tr.createTrajectory();
  tr.addCars(8);
}

function createPath2() {
  var tr = new Trajectory();
  tr.addNextDestination(3, 1);
  tr.addNextDestination(3, 2);
  tr.addNextDestination(0, 2);
  tr.addNextDestination(0, 1);
  tr.createTrajectory();
  tr.addCars(8);
}

function createPath3() {
  var tr = new Trajectory();
  tr.addNextDestination(3, 2);
  tr.addNextDestination(2, 2);
  tr.addNextDestination(2, 1);
  tr.addNextDestination(1, 1);
  tr.addNextDestination(1, 2);
  tr.createTrajectory();
  tr.addCars(5);
}

createPath1();
createPath2();
createPath3();

var file = "%%98efa9b173c24d877a7d54f51889bc5a7d98d0b9b747c4e771cf53589e1b41fc:";
var states = ["D", "C", "A", "B"];

function addTrafficLight(h, w, dt) {
  var pos = city.getBlockPosition(h, w);
  var x = pos.x;
  var y = pos.y;
  var d = 0.7 * bs;
  var d2 = 0.5 * bs;
  var item0 = Space.createItem(file + states[0], x + d, y + d2, 0);
  item0.setHorizontalDirection(1, 0);
  item0.setProperty("light", "red");

  var item1 = Space.createItem(file + states[0], x - d, y - d2, 0);
  item1.setHorizontalDirection(-1, 0);
  item1.setProperty("light", "red");

  var item2 = Space.createItem(file + states[0], x - d2, y + d, 0);
  item2.setHorizontalDirection(0, 1);
  item2.setProperty("light", "red");

  var item3 = Space.createItem(file + states[0], x + d2, y - d, 0);
  item3.setHorizontalDirection(0, -1);
  item3.setProperty("light", "red");

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

  Space.schedule(tick, 1 + dt);
}

addTrafficLight(1, 1, 0);
addTrafficLight(1, 2, 1);
addTrafficLight(2, 1, 1);
addTrafficLight(2, 2, 0);

Space.setCarDriveController(3, 1.5);
Space.renderShadows(false);
Space.renderServiceItems(false);