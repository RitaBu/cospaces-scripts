var radius = 6;
var sphere1 = Space.createItem("Sphere", 0, 0, radius);
sphere1.say("Center");
sphere1.setScale(0.5);
sphere1.setColor(0, 255, 255);

var cube1 = Space.createItem("Cube", 0, 0, radius);
cube1.setColor(0, 0, 255);
cube1.moveBezierCircle(0, 0, radius, radius * 2, radius * 2);
cube1.say('v = ' + radius * 2 + '\nr = ' + radius * 2);

var cube3 = Space.createItem("Cube", 7, 0, 0);
cube3.setColor(0, 255, 0);
cube3.moveBezierCircle(0, 0, radius, radius / 2, 0);
cube3.say('v = 0\nr = ' + radius / 2);

var cube4 = Space.createItem("Cube", 7, -7, 4);
cube4.setColor(255, 0, 0);
cube4.moveBezierCircle(0, 0, radius, 0, 1);
cube4.say('v = 1\nr = ' + 0);