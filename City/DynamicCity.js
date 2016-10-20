var city = Space.createCity(3, 3, 2);
var rs = city.roadSize() / 4;
var bs = city.blockSize() / 2;

function Trajectory() {
  this.vertices = [];

  this.route = [];

  this.addNextDestination = function (h, w) {
    this.route.push([h, w]);
  };

  var RIGHT = 0;
  var UP = 1;
  var LEFT = 2;
  var DOWN = 3;

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

      var r1 = bs * 0.35;
      var r2 = bs * 0.35;
      var v1 = Space.createVectorItem(bp.x + inVec[0], bp.y + inVec[1], 0, inVec[2] * r1, inVec[3] * r1, 0);
      var v2 = Space.createVectorItem(bp.x + outVec[0], bp.y + outVec[1], 0, outVec[2] * r2, outVec[3] * r2, 0);
      this.vertices.push(v1);
      this.vertices.push(v2);
    }
  };

  this.createTurn = function (pos, dir) {
    switch (pos) {
      case RIGHT:
        return [bs, -dir * rs, dir, 0];
      case UP:
        return [dir * rs, bs, 0, dir];
      case LEFT:
        return [-bs, dir * rs, -dir, 0];
      case DOWN:
        return [-dir * rs, -bs, 0, -dir];
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
      car = Space.createItem(modelId, this.vertices[i].getPosition().x, this.vertices[i].getPosition().y, 0);
      car.moveBezier([line.id()], 5, true);
      car.setScale(1);
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
  tr.addCars(5);
}

createPath1();
createPath2();

Space.setCarDriveController(1, 0.6);
Space.renderShadows(false);
Space.renderServiceItems(true);