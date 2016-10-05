var city = Space.createCity(4,4,2);
var rw = city.getRoadSize() / 4;
var bs = city.getBlockSize() / 2;

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
    if(h == nh){
      if(w < nw){
        yo = -rw;
      }
      else{
        yo = rw;
      }
    }
    else{
      if(h < nh){
        xo = -rw;
      }
      else{
        xo = rw;
      }
    }
    var x = bp[0] + xo;
    var y = bp[1] + yo;
    var nx = nbp[0] + xo;
    var ny = nbp[1] + yo;

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

function addCarsToPath(vec, n, color) {
  var nl = vec.length;
  var car;
  for (var i = 0; i < n; i++) {
    var line = Space.createCurveLineItem();
    for (var j = i; j <= i + nl; j++) {
      line.addVertex(vec[j % nl].id());
    }
    var modelId = i % 2 === 0 ? "LP_Car" : "LP_Bus";
    car = Space.createItem(modelId, vec[i].position()[0], vec[i].position()[1], 0);
    if (color != null)
      car.setColor(color[0], color[1], color[2]);
    car.addToBezier3DPathCurve(line.id());
    car.finishBezier3DPath(2, true);
    car.setScale(0.4);
  }
  return car;
}

function createPath1(){
  var points = [];
  points.push([0,0]);
  points.push([0,3]);
  points.push([3,3]);
  points.push([3,0]);
  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 8);
}

function createPath2(){
  var points = [];
  points.push([0,3]);
  points.push([3,3]);
  points.push([3,0]);
  points.push([0,0]);
  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 8);
}

function createPath3(){
  var points = [];
  points.push([0,3]);
  points.push([0,1]);
  points.push([3,1]);
  points.push([3,3]);
  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 8);
}

function createPath4(){
  var points = [];
  points.push([1,0]);
  points.push([1,3]);
  points.push([2,3]);
  points.push([2,0]);
  var vec = createPathFromPoints(points);
  addCarsToPath(vec, 8);
}

createPath1();
createPath2();
createPath3();
createPath4();

Space.setCarDriveController(1, 0.5);
Space.setRenderShadows(false);
Space.setRenderServiceItems(false);