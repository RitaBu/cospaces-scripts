//ungrouped
var cube1 = Space.createItem("Cube", 0, 0, 0);
var cube2 = Space.createItem("Cube", 0, 0, 0.5);
var cube3 = Space.createItem("Cube", 0, 0, 1);
cube2.setColor(255, 0, 0);
cube3.setColor(255, 255, 0);

//TEST addLocalRotation FOR UNGROUPED OBJECTS
Space.scheduleRepeating(function () {
  cube1.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
  cube2.addLocalRotation(0, 0, 0, 0, 0, 1, -Math.PI / 100);
  cube3.addLocalRotation(0, 0, 0, 0, 0, 1, 0);
}, 0);

var cubeGreen = Space.createItem("Cube", 4, 0, 0);
cubeGreen.setColor(0, 255, 0); //green

//TEST rotate & moveLinear
var f = function () {
  cubeGreen.rotate(0, 0, 1, Math.PI * 0.6, 2, function () {
    cubeGreen.moveLinear(4, 0, 3, 2, function () {
      cubeGreen.rotate(0, 0, 1, Math.PI * 1.4, 2, function () {
        cubeGreen.moveLinear(4, 0, 0, 2, f);
            });
        });
    });
};
Space.schedule(f, 2);

//grouped
var cubeWhite = Space.createItem("Cube", 2, 0, 0);
var cubeRed = Space.createItem("Cube", 2, 0, 0.5);
var cubeYellow = Space.createItem("Cube", 2, 0, 1);
cubeRed.setColor(255, 0, 0); //red
cubeYellow.setColor(255, 255, 0); //yellow

//TEST setOrientationFrom
var group = Space.createGroup();
group.add(cubeWhite);
group.add(cubeRed);
group.add(cubeYellow);

group.setOrientationFrom(cubeYellow);

//TEST addLocalRotation FOR GROUPED OBJECTS
Space.scheduleRepeating(function () {
  cubeWhite.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
  cubeRed.addLocalRotation(0, 0, 0, 0, 0, 1, -Math.PI / 100);
  cubeYellow.addLocalRotation(0, 0, 0, 0, 0, 1, 0);
}, 0);

//second group
var cubeBlue = Space.createItem("Cube", 6, 0, 0);
var cubeGray = Space.createItem("Cube", 6, 0, 0.5);
cubeBlue.setColor(0, 0, 255); //blue
cubeGray.setColor(150, 150, 150); //gray

var group2 = Space.createGroup();
group2.add(cubeBlue);
group2.add(cubeGray);

group2.setOrientationFrom(cubeBlue);

//TEST rotate FOR GROUP
group2.rotate(0, 0, 1, Math.PI * 0.6, 2, null);

/*
//move linear
Space.schedule(function() {
  var distance = 10;
  var time = 1;
  var item = group;
  var dir = item.getAxisZ();
  var norm = Math.sqrt(
      dir.x * dir.x +
      dir.y * dir.y +
      dir.z * dir.z
  );
  dir.x = dir.x / norm;
  dir.y = dir.y / norm;
  dir.z = dir.z / norm;
  var position = item.getPosition();
  var targetX = position.x + dir.x * distance;
  var targetY = position.y + dir.y * distance;
  var targetZ = position.z + dir.z * distance;
  Project.log("target x = " + targetX + " y = " + targetY + " z = " + targetZ + " time = " + time);
  //item.moveLinear(targetX, targetY, targetZ, time, null);
  item.rotate(0, 0, 1, Math.PI * 0.25, 2, null);

}, 2);
*/