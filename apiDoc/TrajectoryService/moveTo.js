var lion = Scene.createItem('LP_Lion', 0, 0, 0);
var butterfly = Scene.createItem('LP_Butterfly', 2, 2, 0);
var bird = Scene.createItem('LP_BlackBird', -2, -2, 0);

lion.moveTo(3, 3);
butterfly.moveTo(-1, 2, 3);
bird.moveTo(2, -3, 1, function() {
  bird.say('Yay!');
});
