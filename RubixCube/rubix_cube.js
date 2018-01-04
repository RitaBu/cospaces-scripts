Scene.setDefaultOrigin("Center");

var size = 0.875;

var cubes = [];
for (var i = 0; i < 3; i++) {
  cubes[i] = [];
  for (var j = 0; j < 3; j++) {
    cubes[i][j] = [];
    for (var k = 0; k < 3; k++) {
      cubes[i][j][k] = Scene.createItem("FxCd", i - 1, j - 1, k + 1);
      cubes[i][j][k].setSize(size, size, size);
      cubes[i][j][k].setColor(128, 128, 128); //gray
    }
  }
}

function createFrustum() {
  var frstm = Scene.createItem("Frst4", 0, 0, 0);

  var bottom = size * 0.9;
  var top = bottom * 0.8;
  var height = 0.025;

  frstm.setSize(bottom, bottom, top, top, height);
  return frstm;
}

for (i = 0; i < 3; i++) {
  for (j = 0; j < 3; j++) {
    var frstm = createFrustum();
    frstm.setColor(255, 0, 0); //red
    frstm.attachToItem("Bottom", cubes[i][j][2], "Top");

    frstm = createFrustum();
    frstm.setColor(255, 128, 0); //orange
    frstm.attachToItem("Bottom", cubes[i][j][0], "Bottom");

    frstm = createFrustum();
    frstm.setColor(255, 255, 255); //white
    frstm.attachToItem("Bottom", cubes[0][i][j], "Left");

    frstm = createFrustum();
    frstm.setColor(255, 255, 0); //yellow
    frstm.attachToItem("Bottom", cubes[2][i][j], "Right");

    frstm = createFrustum();
    frstm.setColor(0, 0, 255); //blue
    frstm.attachToItem("Bottom", cubes[i][0][j], "Back");

    frstm = createFrustum();
    frstm.setColor(0, 255, 0); //green
    frstm.attachToItem("Bottom", cubes[i][2][j], "Front");
  }
}

var rotateAround112 = function () {
  var center = cubes[1][1][2];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      center.add(cubes[i][j][2]);
    }
  }
  center.rotateLocal(0, 0, 1, Math.PI * 0.5, 3, callback112);
};

var callback112 = function () {
  var temp = cubes[0][0][2];
  cubes[0][0][2] = cubes[2][0][2];
  cubes[2][0][2] = cubes[2][2][2];
  cubes[2][2][2] = cubes[0][2][2];
  cubes[0][2][2] = temp;

  temp = cubes[0][1][2];
  cubes[0][1][2] = cubes[1][0][2];
  cubes[1][0][2] = cubes[2][1][2];
  cubes[2][1][2] = cubes[1][2][2];
  cubes[1][2][2] = temp;

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      cubes[i][j][2].removeFromParent();
    }
  }

  rotateAround211();
};

var rotateAround211 = function () {
  var center = cubes[2][1][1];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      center.add(cubes[2][i][j]);
    }
  }
  center.rotateLocal(1, 0, 0, Math.PI * 0.5, 3, callback211);
};

var callback211 = function () {
  var temp = cubes[2][0][0];
  cubes[2][0][0] = cubes[2][2][0];
  cubes[2][2][0] = cubes[2][2][2];
  cubes[2][2][2] = cubes[2][0][2];
  cubes[2][0][2] = temp;

  temp = cubes[2][0][1];
  cubes[2][0][1] = cubes[2][1][0];
  cubes[2][1][0] = cubes[2][2][1];
  cubes[2][2][1] = cubes[2][1][2];
  cubes[2][1][2] = temp;

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      cubes[2][i][j].removeFromParent();
    }
  }

  rotateAround112();
};

rotateAround112();