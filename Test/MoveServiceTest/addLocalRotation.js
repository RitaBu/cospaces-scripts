//ungrouped
var cube1 = Space.createItem("Cube", 0, 0, 0);
var cube2 = Space.createItem("Cube", 0, 0, 0.5);
var cube3 = Space.createItem("Cube", 0, 0, 1);
cube2.setColor(255, 0, 0);   //red
cube3.setColor(100, 100, 100); //black

//TEST addLocalRotation FOR UNGROUPED OBJECTS
Space.scheduleRepeating(function () {
  cube1.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
  cube2.addLocalRotation(0, 0, 0, 0, 0, 1, -Math.PI / 100);
  cube3.addLocalRotation(0, 0, 0, 0, 0, 1, 0);
}, 0);

/////////////////////-------------////////////////////////

var cubeGreen = Space.createItem("Cube", 4, 0, 0);
cubeGreen.setColor(0, 255, 0); //green

//TEST rotate & moveLinear
var f = function () {
  cubeGreen.rotateLocal(0, 0, 1, Math.PI * 0.25, 0.5, function () {
    cubeGreen.moveLinearLocal(0, 0, 3, 2, function () {
      cubeGreen.rotateLocal(0, 0, 1, Math.PI * 1.75, 2, function () {
        cubeGreen.moveLinearLocal(0, 0, -3, 2, f);
            });
        });
    });
};
f();

/////////////////////-------------////////////////////////

//grouped
var cubeYel0 = Space.createItem("Cube", 2, 0, 0);
var cubeYel1 = Space.createItem("Cube", 2, 0, 0.5);
var cubeYel2 = Space.createItem("Cube", 2, 0, 1);
cubeYel0.setColor(200, 200, 100); //yellow
cubeYel1.setColor(200, 200, 40); //yellow
cubeYel2.setColor(200, 200, 0); //yellow

cubeYel0.setColor(100 + 40, 100 + 40, 100);
cubeYel1.setColor(120 + 40, 120 + 40, 120);
cubeYel2.setColor(160 + 40, 160 + 40, 160);

//TEST setOrientationFrom
var group = Space.createGroup();
group.add(cubeYel0);
group.add(cubeYel1);
group.add(cubeYel2);

group.setOrientationFrom(cubeYel2);

//TEST addLocalRotation FOR GROUPED OBJECTS
Space.scheduleRepeating(function () {
  cubeYel0.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 200);
  cubeYel1.addLocalRotation(0, 0, 0, 0, 0, 1, -Math.PI / 100);
  cubeYel2.addLocalRotation(0, 0, 0, 0, 0, 1, 0);
}, 0);

/////////////////////-------------////////////////////////

//nested group
var cube10 = Space.createItem("Cube", 8, 0, 0);

var cube01 = Space.createItem("Cube", 7.5, 0, 0.5);
var cube11 = Space.createItem("Cube", 8.0, 0, 0.5);
var cube21 = Space.createItem("Cube", 8.5, 0, 0.5);

cube10.setColor(50, 50, 50);
cube01.setColor(100 + 20, 100, 100);
cube11.setColor(120 + 20, 120, 120);
cube21.setColor(160 + 20, 160, 160);

//TEST setOrientationFrom
var group0 = Space.createGroup();
group0.add(cube01);
group0.add(cube11);
group0.add(cube21);
group0.setOrientationFrom(cube11);

var group1 = Space.createGroup();
group1.add(group0);
group1.add(cube10);
group1.setOrientationFrom(cube10);

//TEST addLocalRotation FOR NESTED GROUPS
Space.scheduleRepeating(function () {
  group0.addLocalRotation(0, 0, 0, 0, 0, 1, Math.PI / 100);
  cube01.addLocalRotation(0, 0, 0.25, 1, 0, 0, Math.PI / 100);
  cube21.addLocalRotation(0, 0, 0.25, 1, 0, 0, -Math.PI / 100);
}, 0);

/////////////////////-------------////////////////////////

//second group
var cubeBlue10 = Space.createItem("Cube", 6, 0, 0);

var cubeBlue01 = Space.createItem("Cube", 5.5, 0, 0.5);
var cubeBlue11 = Space.createItem("Cube", 6.0, 0, 0.5);
var cubeBlue21 = Space.createItem("Cube", 6.5, 0, 0.5);

cubeBlue10.setColor(50, 50, 50 + 20);
cubeBlue01.setColor(100, 100, 100 + 40);
cubeBlue11.setColor(120, 120, 120 + 40);
cubeBlue21.setColor(160, 160, 160 + 40);

var groupBlue0 = Space.createGroup();
groupBlue0.add(cubeBlue01);
groupBlue0.add(cubeBlue11);
groupBlue0.add(cubeBlue21);
groupBlue0.setOrientationFrom(cubeBlue11);

var groupBlue1 = Space.createGroup();
groupBlue1.add(groupBlue0);
groupBlue1.add(cubeBlue10);
groupBlue1.setOrientationFrom(cubeBlue10);


function move(distance) {
  return function() {
    var time = 1;
    var item = groupBlue1;
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
    item.moveLinear(targetX, targetY, targetZ, time, function() {
      item.rotateLocal(0, 0, 1, Math.PI * 0.25, 1, move(-distance));
    });
  };
}

//move linear
Space.schedule(move(3), 0);
