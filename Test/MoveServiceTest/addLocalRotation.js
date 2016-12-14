//ungrouped
var cube1 = Space.createItem("Cube", 0, 0, 0);
var cube2 = Space.createItem("Cube", 0, 0, 0.5);
var cube3 = Space.createItem("Cube", 0, 0, 1);
cube2.setColor(255, 0, 0);
cube3.setColor(255, 255, 0);

Space.scheduleRepeating(function () {
  cube1.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
  cube2.addLocalRotation(0, 0, 0, 0, 0, 1, -Math.PI / 100);
  cube3.addLocalRotation(0, 0, 0, 0, 0, 1, 0);
}, 0);

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

Space.scheduleRepeating(function () {
  cubeWhite.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
  cubeRed.addLocalRotation(0, 0, 0, 0, 0, 1, -Math.PI / 100);
  cubeYellow.addLocalRotation(0, 0, 0, 0, 0, 1, 0);
}, 0);

Space.schedule(function () {
  group.moveLinear(0, 0, 10, 5);
}, 2);