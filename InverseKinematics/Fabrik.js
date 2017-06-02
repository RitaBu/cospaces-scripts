function Vector3(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.mul = function (s) {
    return new Vector3(this.x * s, this.y * s, this.z * s);
  };
  this.norm = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  };
}
Vector3.sub = function (v1, v2) {
  return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
};
Vector3.add = function (v1, v2) {
  return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
};

function Chain(joints) {

  this.tolerance = 0.01;
  this.speed = 1 / 60;
  this.maxIter = 15;

  this.n = joints.length;
  this.joints = joints;
  this.target = joints[this.n - 1];
  this.origin = joints[0];

  this.lengths = [];
  for (var i = 0; i < joints.length - 1; i += 1) {
    this.lengths.push(dist(joints[i], joints[i + 1]));
    // Space.log("this.lengths[" + i + "]: " + this.lengths[i]);
  }
  this.totallength = 0;
  for (var i = 0; i < this.lengths.length; i += 1) {
    this.totallength += this.lengths[i];
  }
  // Space.log("totallength " + this.totallength);
  function mix(p1, p2, l) {
    return Vector3.add(p1.mul((1 - l)), p2.mul(l));
  }

  function dist(p1, p2) {
    return Vector3.sub(p1, p2).norm();
  }

  // this.targetStep = function () {
  //   var last = this.joints[this.n - 1];
  //   var d = dist(last, this.target);
  //   if (d <= this.speed) {
  //     return this.target;
  //   }
  //   return newJoint(last, this.target, this.speed / d);
  // };

  this.backward = function () {
    this.joints[this.n - 1] = this.target;
    for (var i = this.n - 2; i >= 0; i -= 1) {
      var l = this.lengths[i] / dist(this.joints[i + 1], this.joints[i]);
      this.joints[i] = mix(this.joints[i + 1], this.joints[i], l);
    }
  };

  this.forward = function () {
    this.joints[0] = this.origin;
    for (var i = 0; i < this.n - 1; i += 1) {
      var l = this.lengths[i] / dist(this.joints[i + 1], this.joints[i]);
      this.joints[i + 1] = mix(this.joints[i], this.joints[i + 1], l);
    }
  };

  this.solve = function () {
    var distance = dist(this.joints[0], this.target);
    if (distance > this.totallength) {
      for (var i = 0; i < this.n - 1; i += 1) {
        var l = this.lengths[i] / dist(this.target, this.joints[i]);
        this.joints[i + 1] = mix(this.joints[i], this.target, l);
      }
    } else {
      var iter = 0;
      distance = dist(this.joints[this.n - 1], this.target);
      while (distance > this.tolerance) {
        this.backward();
        this.forward();
        distance = dist(this.joints[this.n - 1], this.target);
        iter += 1;
        if (iter > this.maxIter) break;
      }
    }
  };

  this.setTarget = function (x, y, z) {
    this.target = new Vector3(x, y, z);
  };

  return this;
}

var target = Scene.createItem("sph", 0, 1, 1);
target.setScale(0.1);

var j0 = new Vector3(-2, 0, 0);
var j1 = new Vector3(-2, 0, 0.5);
var j2 = new Vector3(-2, 0, 1);
var j3 = new Vector3(-2, 0, 1.5);
var j4 = new Vector3(-2, 0, 3);
var j5 = new Vector3(-2, 0, 4);
var joints = [j0, j1, j2, j3, j4, j5];

var chain1 = new Chain(joints);
var tail1 = Scene.createPathTail();
tail1.setColor("ab4722");

j0 = new Vector3(2, 0, 0);
j1 = new Vector3(2, 0, 0.5);
j2 = new Vector3(2, 0, 1);
j3 = new Vector3(2, 0, 1.5);
j4 = new Vector3(2, 0, 3);
j5 = new Vector3(2, 0, 4);
joints = [j0, j1, j2, j3, j4, j5];

var chain2 = new Chain(joints);
var tail2 = Scene.createPathTail();
tail2.setColor("5d96d0");

function step(chain, tail) {
  var p = target.getPosition();
  chain.setTarget(p.x, p.y, p.z);
  chain.solve();
  tail.removeAll();
  for (var i = 0; i < chain.joints.length; i += 1) {
    var joint = chain.joints[i];
    tail.addLast(joint.x, joint.y, joint.z);
  }
}

Scene.scheduleRepeating(function () {
  step(chain1, tail1);
  step(chain2, tail2);
}, 0);

function randPos() {
  var r = 4;
  return new Vector3(Math.random() * 2 * r - r, Math.random() * 2 * r - r, Math.random() * r)
}

function move(){
  var p = randPos();
  var t = 3;
  target.moveBezierTo(p.x, p.y, p.z, t, move);
}

move();