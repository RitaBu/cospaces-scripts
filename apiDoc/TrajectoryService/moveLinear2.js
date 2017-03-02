var man = Scene.createItem('LP_Man', 0, 0, 0);
var bird = Scene.createItem('LP_BlackBird', -1, -3, 3);

bird.moveLinear(0, 0, 1.5, 3, function() {
  man.say('Heeeey!!!');
});
