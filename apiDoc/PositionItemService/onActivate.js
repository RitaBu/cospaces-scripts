var lion = Space.createItem('LP_Lion', 0, 0, 0);
var clickCounter = 0;

lion.say('Click me!');
lion.onActivate(function() {
  clickCounter++;
  lion.say('Click counter: ' + clickCounter);
});
