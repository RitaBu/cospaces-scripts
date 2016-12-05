var man = Space.createItem('LP_Man', 0, 0, 0);
var cube = Space.createItem('LP_Cube', 0, 0, 0);

var radius = 6;

moveTo();
function moveTo() {
  cube.setPosition(Math.random() * radius, Math.random() * radius, Math.random() * radius / 2);
  man.say('');
  var distance = man.distanceToItem(cube);
  man.moveToItem(cube, distance, function () {
    man.say('Gotcha!!!');
    Space.schedule(moveTo, 1);
  });
}