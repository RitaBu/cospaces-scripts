var man = Space.createItem('LP_Man', 0, 0, 0);
var cube = Space.createItem('LP_Cube', 3, 5, 0);

var radius = 6;

moveTo();
function moveTo() {
  var distance = man.distanceToItem(cube);
  man.moveToItem(cube, distance, function () {
    man.say('Gotcha!!!');
  });
  Space.schedule(function () {
    cube.setPosition(Math.random() * radius, Math.random() * radius, Math.random() * radius / 2);
    man.say('');
    moveTo();
  }, 5);
}