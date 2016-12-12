var lion = Space.createItem('LP_Lion', 0, 0, 0);
var butterfly = Space.createItem('LP_Butterfly', -2, 1, 1);
var bird = Space.createItem('LP_BlackBird', 3, 2, 2);

lion.move(5, 3);
butterfly.move(-1, 2, 3);
bird.move(2, -3, 1, function() {
  bird.say('Yay!');
});
