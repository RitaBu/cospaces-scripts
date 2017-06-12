var epsilon = 0.001;
var width = 0.25;

var plateTop = Scene.getItem("plateTop") as Cone;
var plateBottom = Scene.getItem("plateBottom") as Cone;
var disk1Left = Scene.getItem("disk1Left") as Shape;
var disk2Left = Scene.getItem("disk2Left") as Shape;
var disk3Left = Scene.getItem("disk3Left") as Shape;
var disk4Left = Scene.getItem("disk4Left") as Shape;
var disk5Bottom = Scene.getItem("disk5Bottom") as Shape;
var disk5Top = Scene.getItem("disk5Top") as Shape;

var clawBottom = Scene.getItem("clawBottom") as Shape;
var clawRightTop = Scene.getItem("clawRightTop") as Shape;
var clawLeftTop = Scene.getItem("clawLeftTop") as Shape;
var clawRightLeft = Scene.getItem("clawRightLeft") as Shape;
var clawRightRight = Scene.getItem("clawRightRight") as Shape;
var clawLeftLeft = Scene.getItem("clawLeftLeft") as Shape;
var clawLeftRight = Scene.getItem("clawLeftRight") as Shape;
var rubberLeft = Scene.getItem("rubberLeft") as Shape;
var rubberRight = Scene.getItem("rubberRight") as Shape;

Scene.setPhysicsEnabled(true, false);

var cubes = Scene.getItems();
cubes.forEach(function(item) {
  if (item.hasOwnProperty("name")) {
    if (item.name() !== null && item.name() !== undefined && item.name().includes("Cube")) {
      item.setDensity(0.01);
    }
  }
});

rubberLeft.setFriction(5);
rubberRight.setFriction(5);
rubberLeft.setDensity(15);
rubberRight.setDensity(15);

plateBottom.setFriction(0);
plateBottom.setStatic(true);
plateTop.setFriction(0);
disk5Bottom.setFriction(0);
var hTop = plateTop.height();
var hBottom = plateBottom.height();
var plateJoint = plateBottom.motorJointToItem(plateTop, 0, 0, hBottom / 2 + epsilon,
    0, 0, -hTop / 2,
    0, 0, 1, 0, 0, 1);
plateJoint.setMaxForce(10000);
var diskLeft1Joint = disk1Left.motorJointToItem(disk2Left, 0, 0, width * 2.5,
    0, 0, -width * 1.5,
    0, 0, 1, 0, 0, -1);
diskLeft1Joint.setMaxForce(5000);

var diskLeft3Joint = disk3Left.motorJointToItem(disk4Left, 0, 0, -width * 1.5,
    0, 0, -width * 2.5,
    0, 0, 1, 0, 0, 1);
diskLeft3Joint.setMaxForce(5000);
var disk5Joint = disk5Bottom.motorJointToItem(disk5Top, 0, 0, width / 4,
    0, 0, -width / 4,
    0, 0, 1, 0, 0, 1);
disk5Joint.setMaxForce(5000);

/*
 CLAW
 */
var jointBottomRightLeft = clawBottom.hingeJointToItem(clawRightLeft, 1.5 * width, 0, width * (0.25 + 0.5),
    0, -2.5 * width, 0, 0, 0, 1, 0, 0, 1);
jointBottomRightLeft.setMaxForce(1000);
var jointBottomRightRight = clawBottom.hingeJointToItem(clawRightRight, 3.5 * width, 0, width * (0.25 + 0.5),
    0, -2.5 * width, 0, 0, 0, 1, 0, 0, 1);
jointBottomRightRight.setMaxForce(5000);
var jointBottomLeftRight = clawBottom.hingeJointToItem(clawLeftRight, -1.5 * width, 0, width * (0.25 + 0.5),
    0, -2.5 * width, 0, 0, 0, 1, 0, 0, 1);
jointBottomLeftRight.setMaxForce(1000);
var jointBottomLeftLeft = clawBottom.hingeJointToItem(clawLeftLeft, -3.5 * width, 0, width * (0.25 + 0.5),
    0, -2.5 * width, 0, 0, 0, 1, 0, 0, 1);
jointBottomLeftLeft.setMaxForce(5000);
var jointTopRightLeft = clawRightTop.hingeJointToItem(clawRightLeft, -1 * width, 0, width * 0.75,
    0, 2.5 * width, 0, 0, 0, 1, 0, 0, 1);
jointTopRightLeft.setMaxForce(5000);
var jointTopRightRight = clawRightTop.hingeJointToItem(clawRightRight, width, 0, width * 0.75,
    0, 2.5 * width, 0, 0, 0, 1, 0, 0, 1);
jointTopRightRight.setMaxForce(5000);

var jointTopLeftRight = clawLeftTop.hingeJointToItem(clawLeftRight, width, 0, width * 0.75,
    0, 2.5 * width, 0, 0, 0, 1, 0, 0, 1);
jointTopLeftRight.setMaxForce(5000);
var jointTopLeftLeft = clawLeftTop.hingeJointToItem(clawLeftLeft, -width, 0, width * 0.75,
    0, 2.5 * width, 0, 0, 0, 1, 0, 0, 1);
jointTopLeftLeft.setMaxForce(5000);

//Claw variables
var oX = clawBottom.getAxisX();
var clawBottomPos = clawBottom.getPhysicsPosition();
var x1 = dot(sub(rubberLeft.getPhysicsPosition(), clawBottomPos), oX);
var x2 = dot(sub(rubberRight.getPhysicsPosition(), clawBottomPos), oX);
var dx = 0.01;
var maxV = 30;
var dt = 1.0 / 20;

Scene.scheduleRepeating(function() {
  var clawBottomPos = clawBottom.getPhysicsPosition();
  var clawBottomVel = clawBottom.getVelocity();
  var oX = clawBottom.getAxisX();

  var rp1 = sub(rubberLeft.getPhysicsPosition(), clawBottomPos)
  var curX1 = dot(rp1, oX);
  var dx1 = x1 - curX1;
  var vx1 = clamp(dx1 / dt, -maxV, maxV);
  var v1 = rubberLeft.getVelocity();
  var rv1 = sub(v1, clawBottomVel);
  var vel1 = add(v1, mul(oX, -dot(rv1, oX) + vx1));
  rubberLeft.setVelocity(vel1.x, vel1.y, vel1.z);

  var rp2 = sub(rubberRight.getPhysicsPosition(), clawBottomPos)
  var curX2 = dot(rp2, oX);
  var dx2 = x2 - curX2;
  var vx2 = clamp(dx2 / dt, -maxV, maxV);
  var v2 = rubberRight.getVelocity();
  var rv2 = sub(v2, clawBottomVel);
  var vel2 = add(v2, mul(oX, -dot(rv2, oX) + vx2));
  rubberRight.setVelocity(vel2.x, vel2.y, vel2.z);
},0);

/*
 BLOCKLY HANDLERS
 Check "Activity" code for details. Hit "Play" and switch to blockly tab to test blocks
 */
var plateJointProp = "plateJoint";
var joint1Prop = "joint1";
var joint2Prop = "joint2";
var joint3Prop = "joint3";
var clawsProp = "claws";

Scene.onPropertyChanged(plateJointProp, function() {
  if (Scene.getProperty(plateJointProp) == "start") {
    var angle = parseFloat(Scene.getProperty(plateJointProp + "Angle"));
    var speed = parseFloat(Scene.getProperty(plateJointProp + "Speed"));
    plateJoint.rotateLocal(angle, speed, function() {
      Scene.setProperty(plateJointProp, "done");
      Space.log("Plate"  +plateJoint.getAngle());
    })
  }
});

Scene.onPropertyChanged(joint1Prop, function() {
  if (Scene.getProperty(joint1Prop) == "start") {
    var angle = parseFloat(Scene.getProperty(joint1Prop + "Angle"));
    var speed = parseFloat(Scene.getProperty(joint1Prop + "Speed"));
    diskLeft1Joint.rotateLocal(angle, speed, function() {
      Scene.setProperty(joint1Prop, "done");

      //Debug
      Space.log("Joint 1" + diskLeft1Joint.getAngle());
    })
  }
});

Scene.onPropertyChanged(joint2Prop, function() {
  if (Scene.getProperty(joint2Prop) == "start") {
    var angle = parseFloat(Scene.getProperty(joint2Prop + "Angle"));
    var speed = parseFloat(Scene.getProperty(joint2Prop + "Speed"));
    diskLeft3Joint.rotateLocal(-angle, speed, function() {
      Scene.setProperty(joint2Prop, "done");
    })
  }
});

Scene.onPropertyChanged(joint3Prop, function() {
  if (Scene.getProperty(joint3Prop) == "start") {
    var angle = parseFloat(Scene.getProperty(joint3Prop + "Angle"));
    var speed = parseFloat(Scene.getProperty(joint3Prop + "Speed"));
    disk5Joint.rotateLocal(angle, speed, function() {
      Scene.setProperty(joint3Prop, "done");

      //Debug
      Space.log(disk5Joint.getAngle());
    })
  }
});

Scene.onPropertyChanged(clawsProp, function() {
  if (Scene.getProperty(clawsProp) == "start") {
    var angle = parseFloat(Scene.getProperty(clawsProp + "Angle"));
    var speed = parseFloat(Scene.getProperty(clawsProp + "Speed"));
    var clampedAngle = clamp(angle, -90, 90);
    setClawAngle(angle);
    Scene.schedule(function() {
      Scene.setProperty(clawsProp, "done");
    }, 0.5)
  }
});

//Helper functions
function clamp(value, min, max) {
  value = Math.min(Math.max(value, min), max);
  return value;
}

function sub(u, v) {
  return {
    x: u.x - v.x,
    y: u.y - v.y,
    z: u.z - v.z
  }
}

function add(u, v) {
  return {
    x: u.x + v.x,
    y: u.y + v.y,
    z: u.z + v.z
  }
}

function dot(u, v) {
  return u.x * v.x + u.y * v.y + u.z * v.z;
}

function mul(u, a) {
  return {
    x: u.x * a,
    y: u.y * a,
    z: u.z * a
  }
}

function setClawAngle(x) {
  x1 = -x;
  x2 = x;
}

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
Vector3.projectOnPlane = function (normal, p) {
  var c = Vector3.dot(normal, p) / normal.norm2();
  return new Vector3.sub(p, normal.mul(c));
};

var DEBUG = true;

function Chain(joints) {

  this.tolerance = 0.01;
  this.maxIter = 15;

  this.n = joints.length;
  this.joints = joints;
  this.origin = joints[0].pos;
  this.target = joints[this.n - 1].pos;

  this.lengths = [];
  for (var i = 0; i < joints.length - 1; i += 1) {
    this.lengths.push(dist(joints[i].pos, joints[i + 1].pos));
  }

  function mix(p1, p2, l) {
    return Vector3.add(p1.mul((1 - l)), p2.mul(l));
  }

  function dist(p1, p2) {
    return Vector3.sub(p1, p2).norm();
  }

  this.backward = function () {
    this.joints[this.n - 1].pos = this.target;
    for (var i = this.n - 2; i >= 0; i -= 1) {
      var l = this.lengths[i] / dist(this.joints[i + 1].pos, this.joints[i].pos);
      this.joints[i].pos = mix(this.joints[i + 1].pos, this.joints[i].pos, l);
    }
  };

  this.forward = function () {
    this.joints[0].pos = this.origin;
    for (var i = 0; i < this.n - 1; i += 1) {
      var l = this.lengths[i] / dist(this.joints[i + 1].pos, this.joints[i].pos);
      this.joints[i + 1].pos = mix(this.joints[i].pos, this.joints[i + 1].pos, l);
    }
  };

  this.solveForTarget = function (x, y, z) {
    this.setTarget(x, y, z);
    var iter = 0;
    var distance = dist(this.joints[this.n - 1].pos, this.target);
    while (distance > this.tolerance) {
      this.backward();
      this.forward();
      distance = dist(this.joints[this.n - 1].pos, this.target);
      iter += 1;
      if (iter > this.maxIter) break;
    }
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

    var rightvec = new Vector3(1, 0, 0);
    var upvec = Vector3.cross(rightvec, Vector3.sub(p, joint.pos));

    // get the 2D components
    var xaspect = Vector3.dot(adjust, rightvec);
    var yaspect = Vector3.dot(adjust, upvec);

    // get the cross section of the cone
    var height = proj.norm();
    var left = height * Math.tan(joint.l);
    var right = height * Math.tan(joint.r);
    var up = height * Math.tan(joint.u);
    var down = height * Math.tan(joint.d);

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

  this.getAngle = function(ind) {
    var p1 = ind > 0 ? joints[ind - 1].pos : new Vector3(joints[ind].pos.x, joints[ind].pos.y, -1);
    var p2 = joints[ind].pos;
    var p3 = joints[ind + 1].pos;
    var rotation = new Vector3(1, 0, 0);
    var reference = Vector3.sub(p2, p1);
    var dir = Vector3.sub(p3, p2);
    var angle = Math.acos(clamp(Vector3.dot(reference, dir) / (reference.norm() * dir.norm()), -1, 1));
    var s = sign(Vector3.dot(Vector3.cross(reference, dir), rotation));
    return angle * s;
  };

  return this;
}

function Joint(pos, right) {
  var angle = Math.PI;
  var angle1 = Math.PI;

  this.l = angle;
  this.r = angle;
  this.u = angle1;
  this.d = angle1;

  this.pos = pos;
  this.right = right;
}

function dist(v1, v2){
  var s = sub(v1, v2);
  return Math.sqrt(dot(s, s));
}

function sign(v1) {
  return v1 >= 0 ? 1 : -1;
}

function norm(v) {
  return Math.sqrt(dot(v, v));
}

function angle(v1, v2) {
  return Math.acos(dot(v1, v2) / (norm(v1) * norm(v2)));
}

function cross (a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x};
};

function signedAngle(referenceVector, otherVector, normalVector){
  var unsignedAngle = angle(referenceVector, otherVector);
  var s = sign(dot(cross(referenceVector, otherVector), normalVector));
  return unsignedAngle * s;
}

function getRotationAngle(angle){
  return angle < 0 ? angle + Math.PI * 2 : angle;
}

function rotate(p, o, angle){
  var t = {x: p.x - o.x, y: p.y - o.y};
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var nx = t.x * c - t.y * s + o.x;
  var ny = t.x * s + t.y * c + o.y;
  return {x: nx, y: ny, z: p.z};
}

//CONSTANTS AND CONSTRAINTS
var Y = {x: 0, y: 1, z: 0}
var Z = {x: 0, y: 0, z: -1};
var target = Scene.getItem("V6IteAdR25");

//INIT IK SOLVER
var base = plateJoint.getPosition();
var bx = base.x;
var by = base.y;
var j1 = diskLeft1Joint.getPosition();
var j2 = diskLeft3Joint.getPosition();
var d1 = dist(base, j1);
var d2 = dist (j1, j2);
var d3 = 6;

var rightV = new Vector3(1, 0, 0);
var j0 = new Joint(new Vector3(bx, by, d1), rightV.clone());
var j1 = new Joint(new Vector3(bx, by, d1 + d2), rightV.clone());
var j2 = new Joint(new Vector3(bx, by, d1 + d2 + d3), rightV.clone());
var joints = [j0, j1, j2];
var chain = new Chain(joints);

var tail = Scene.createPathTail();
tail.setColor("ab4722");

//SOLVE METHODS, RETURN NEW JOINT ANGLES
function getDirection(a1, a2){
  var dr = a1 - a2;
  dr = dr < 0 ? dr + Math.PI * 2 : dr;
  var dl = Math.PI * 2 - dr;
  dl = dl < 0 ? dl + Math.PI * 2 : dl;
  return dr < dl ? dr : -dl;
}

function solveForTarget(p){
  var origin = plateJoint.getPosition();
  var p0 = {x: p.x, y: p.y, z: 0};
  p0 = sub(p0, origin);

  var pAngle = getRotationAngle(signedAngle(Y, p0, Z));
  var pp = rotate(p, origin, pAngle);
  chain.solveForTarget(pp.x, pp.y, pp.z);

  var a0 = getRotationAngle(signedAngle(Y, p0, Z));
  var da0 = getDirection(a0, plateJoint.getAngle());

  var a1 = getRotationAngle(-chain.getAngle(0));
  var da1 = getDirection(a1, diskLeft1Joint.getAngle());

  var a2 = getRotationAngle(chain.getAngle(1));
  var da2 = getDirection(a2, diskLeft3Joint.getAngle());

  Space.log("0: " + chain.getAngle(0) + " 1: " + chain.getAngle(1));
  return [da0, da1, da2];
}

//SETTER METHODS, USE THE GIVEN ANGLES TO ROTATE THE JOINTS
var cnt = 0;

function incCnt() {
  cnt = (cnt + 1) % 4;
}

function move(){
  cnt = 1;
  var a = solveForTarget(target.getPosition());
  // Space.log(a[0] + " " + a[1] + " " + a[2]);
  plateJoint.rotateLocal(a[0], 0.5, incCnt);
  diskLeft1Joint.rotateLocal(a[1], 0.5, incCnt);
  diskLeft3Joint.rotateLocal(a[2], 0.5, incCnt);
}

var dbg = Scene.createItem("cube", 20, 20 ,0);
Scene.scheduleRepeating(function() {
  if(cnt == 0) {
    move();
  }
  //visualize
  dbg.setPosition(20, 20, 0);
  tail.removeAll();
  for (var i = 0; i < chain.joints.length; i += 1) {
    var pos = chain.joints[i].pos;
    tail.addLast(pos.x, pos.y, pos.z);
  }
}, 0);

// target.addMoveOnPlaneInteraction(-10, -10, 1, 50, 0, 0, 0, 50, 0);