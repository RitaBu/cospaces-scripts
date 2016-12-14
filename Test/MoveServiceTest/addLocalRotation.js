//ungrouped
var cube1 = Space.createItem("Cube", 0, 0, 0);
var cube2 = Space.createItem("Cube", 0, 0, 0.5);
var cube3 = Space.createItem("Cube", 0, 0, 1);
cube2.setColor(255, 0, 0);
cube3.setColor(255, 255, 0);

//addLocalRotation FOR UNGROUPED OBJECTS
Space.scheduleRepeating(function () {
  cube1.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
  cube2.addLocalRotation(0, 0, 0, 0, 0, 1, -Math.PI / 100);
  cube3.addLocalRotation(0, 0, 0, 0, 0, 1, 0);
}, 0);

var cubeGreen = Space.createItem("Cube", 4, 0, 0);
cubeGreen.setColor(0, 255, 0); //green

//rotate & moveLinear
Space.schedule(function () {
  cubeGreen.rotate(0, 0, 1, Math.PI * 0.5, 2, function () {
    cubeGreen.moveLinear(4, 0, 3, 2, function () {
      cubeGreen.rotate(0, 0, 1, Math.PI * 1.5, 2, function () {
        cubeGreen.moveLinear(4, 0, 0, 2, function () {
        });
      });
    });
  });
}, 2);

//grouped
var cubeWhite = Space.createItem("Cube", 2, 0, 0);
var cubeRed = Space.createItem("Cube", 2, 0, 0.5);
var cubeYellow = Space.createItem("Cube", 2, 0, 1);
cubeRed.setColor(255, 0, 0); //red
cubeYellow.setColor(255, 255, 0); //yellow

var group = Space.createGroup();
group.add(cubeWhite);
group.add(cubeRed);
group.add(cubeYellow);

group.setOrientationFrom(cubeYellow);

//addLocalRotation FOR GROUPED OBJECTS
Space.scheduleRepeating(function () {
  cubeWhite.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
  cubeRed.addLocalRotation(0, 0, 0, 0, 0, 1, -Math.PI / 100);
  cubeYellow.addLocalRotation(0, 0, 0, 0, 0, 1, 0);
}, 0);

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