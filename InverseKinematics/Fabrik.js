function Vector3(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
Vector3.prototype.norm = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
Vector3.prototype.norm2 = function () {
  return Vector3.dot(this, this);
};
Vector3.prototype.mul = function (s) {
  return new Vector3(this.x * s, this.y * s, this.z * s);
};
Vector3.prototype.add = function (v) {
  return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
};
Vector3.prototype.normalized = function () {
  return this.mul(1 / this.norm());
};
Vector3.prototype.clone = function () {
  return new Vector3(this.x, this.y, this.z);
};
Vector3.sub = function (v1, v2) {
  return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
};
Vector3.add = function (v1, v2) {
  return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
};
Vector3.dot = function (v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};
Vector3.cross = function (a, b) {
  return new Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x);
};

function Chain(joints) {

  this.tolerance = 0.01;
  this.speed = 1 / 60;
  this.maxIter = 15;

  this.n = joints.length;
  this.joints = joints;
  this.origin = joints[0].pos;
  this.target = joints[this.n - 1].pos;

  this.lengths = [];
  for (var i = 0; i < joints.length - 1; i += 1) {
    this.lengths.push(dist(joints[i].pos, joints[i + 1].pos));
  }

  this.totallength = 0;
  for (var i = 0; i < this.lengths.length; i += 1) {
    this.totallength += this.lengths[i];
  }

  function mix(p1, p2, l) {
    return Vector3.add(p1.mul((1 - l)), p2.mul(l));
  }

  function dist(p1, p2) {
    return Vector3.sub(p1, p2).norm();
  }

  function updateUp(up, dir) {
    return Vector3.add(up, dir.mul(-Vector3.dot(up, dir) / dir.norm2())).normalized();
  }

  this.backward = function () {
    this.joints[this.n - 1].pos = this.target;
    for (var i = this.n - 2; i >= 0; i -= 1) {
      var l = this.lengths[i] / dist(this.joints[i + 1].pos, this.joints[i].pos);
      this.joints[i].pos = mix(this.joints[i + 1].pos, this.joints[i].pos, l);
      this.joints[i].up = updateUp(this.joints[i].up, Vector3.sub(this.joints[i + 1].pos, this.joints[i].pos));
      // this.orientationalConstrain(this.joints[i]);
    }
  };

  this.forward = function () {
    this.joints[0].pos = this.origin;
    for (var i = 0; i < this.n - 1; i += 1) {
      // this.orientationalConstrain(this.joints[i]);
      var l = this.lengths[i] / dist(this.joints[i + 1].pos, this.joints[i].pos);
      this.joints[i + 1].pos = mix(this.joints[i].pos, this.joints[i + 1].pos, l);
      // p = Vector3.sub(p, this.joints[i].pos);
      // var dir = i > 0 ? Vector3.sub(this.joints[i].pos, this.joints[i - 1].pos) : new Vector3(0, 0, 1);
      // this.joints[i + 1].pos = this.rotationalConstrain(p, dir, this.joints[i]);
      // this.joints[i].up = updateUp(this.joints[i].up, Vector3.sub(this.joints[i + 1].pos, this.joints[i].pos));
    }
  };

  this.solve = function () {
    var distance = dist(this.joints[0].pos, this.target);
    if (distance > this.totallength) {
      for (var i = 0; i < this.n - 1; i += 1) {
        var l = this.lengths[i] / dist(this.target, this.joints[i].pos);
        this.joints[i + 1].pos = mix(this.joints[i].pos, this.target, l);
      }
    } else {
      var iter = 0;
      distance = dist(this.joints[this.n - 1].pos, this.target);
      while (distance > this.tolerance) {
        this.backward();
        this.forward();
        distance = dist(this.joints[this.n - 1].pos, this.target);
        iter += 1;
        if (iter > this.maxIter) break;
      }
    }
  };

  this.orientationalConstrain = function (joint, dir) {
  };

  this.rotationalConstrain = function (p, dir, joint) {
    dir = dir.normalized();
    var scalar = Vector3.dot(p, dir);
    var proj = dir.mul(scalar);

    // get the vector from the projection to the calculated vector
    var adjust = Vector3.sub(p, proj);
    if (scalar < 0) { // if we're below the cone flip the projection vector
      proj = proj.mul(-1);
    }

    var upvec = joint.up;
    var rightvec = Vector3.cross(dir, upvec);

    // get the 2D components
    var xaspect = Vector3.dot(adjust, rightvec);
    var yaspect = Vector3.dot(adjust, upvec);

    // get the cross section of the cone
    var height = proj.norm();
    var left = -height * Math.tan(joint.l);
    var right = height * Math.tan(joint.r);
    var up = height * Math.tan(joint.u);
    var down = -height * Math.tan(joint.d);

    // find the quadrant
    var xbound = xaspect >= 0 ? right : left;
    var ybound = yaspect >= 0 ? up : down;

    var f = p;
    // check if in 2D point lies in the ellipse
    var ellipse = xaspect * xaspect / (xbound * xbound) + yaspect * yaspect / (ybound * ybound);
    var inbounds = ellipse <= 1;

    if (!inbounds) {
      // get the angle of our out of ellipse point
      var angle = Math.atan2(yaspect, xaspect);
      // find nearest point
      var x = xbound * Math.cos(angle);
      var y = ybound * Math.sin(angle);
      // convert back to 3D
      f = proj.add(rightvec.mul(x)).add(upvec.mul(y)).normalized().mul(p.norm());
    }
    return f;
  };

  this.setTarget = function (x, y, z) {
    this.target = new Vector3(x, y, z);
  };

  return this;
}

function Joint(pos, up) {
  var angle = Math.PI * 0.4;

  this.l = angle;
  this.r = angle;
  this.u = angle;
  this.d = angle;

  this.pos = pos;
  this.up = up;
}

var target = Scene.createItem("sph", 0, 1, 1);
target.setScale(0.1);
var up = new Vector3(1, 0, 0);

var j0 = new Joint(new Vector3(0, 0, 0), up.clone());
var j1 = new Joint(new Vector3(0, 0, 0.5), up.clone());
var j2 = new Joint(new Vector3(0, 0, 1), up.clone());
var j3 = new Joint(new Vector3(0, 0, 1.5), up.clone());
var j4 = new Joint(new Vector3(0, 0, 3), up.clone());
var j5 = new Joint(new Vector3(0, 0, 4), up.clone());
var joints = [j0, j1, j2, j3, j4, j5];

var chain1 = new Chain(joints);
var tail1 = Scene.createPathTail();
tail1.setColor("ab4722");

function step(chain, tail) {
  var p = target.getPosition();
  chain.setTarget(p.x, p.y, p.z);
  chain.solve();
  tail.removeAll();
  for (var i = 0; i < chain.joints.length; i += 1) {
    var pos = chain.joints[i].pos;
    tail.addLast(pos.x, pos.y, pos.z);
  }
}

Scene.scheduleRepeating(function () {
  step(chain1, tail1);
}, 0);

function randPos() {
  var r = 3;
  return new Vector3(Math.random() * 2 * r - r, Math.random() * 2 * r - r, Math.random() * r)
}

function move() {
  var p = randPos();
  var t = 3;
  target.moveBezierTo(p.x, p.y, p.z, t, move);
}

move();