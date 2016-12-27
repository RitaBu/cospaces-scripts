function randomPosition() {
  return {x: (Math.random() * 2 - 1) * radius, y: (Math.random() * 2 - 1) * radius, z: (Math.random() + 1) * radius};
}

var radius = 5;

var man = Space.createItem('LP_Man', 0, 0, radius);
man.say('moveTo');
var target = Space.createItem("Sphere", 0, 0, 0);
target.setScale(0.5);
target.setColor(0, 0, 255);

move();
function move() {
  var pos = randomPosition();
  target.setPosition(pos.x, pos.y, pos.z);
  man.moveTo(pos.x, pos.y, pos.z, move);
}

var woman = Space.createItem('LP_Wom', 0, 0, 0);
var target2 = Space.createItem('Sphere', 0, 0, 0);
target2.setScale(0.5);
target2.setColor(255, 0, 0);

moveToItem();
function moveToItem() {
  var pos = randomPosition();
  target2.setPosition(pos.x, pos.y, 0);
  woman.say('moveToItem');
  var distance = woman.distanceToItem(target2);
  woman.moveToItem(target2, distance, function () {
    woman.say('Gotcha!!!');
    Space.schedule(moveToItem, 1);
  });
}

var lion = Space.createItem('LP_Lion', -3, 1, 1);
lion.say('moveTo(-10, 10)');
var placeholder3 = Space.createItem('Sphere', -10, 10, 1);
placeholder3.setScale(0.5);
placeholder3.setColor(0, 255, 0);
lion.moveTo(-10, 10);
