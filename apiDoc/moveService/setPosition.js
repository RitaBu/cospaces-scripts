var lion = Scene.createItem('LP_Lion', -5, -5, 0);
lion.say('Klick on me to change my position.');

lion.onActivate(function() {
  lion.setPosition(lion.getPosition().x + 0.5, lion.getPosition().y + 0.5, 0);
  lion.say('My position is: (' + lion.getPosition().x + ', ' + lion.getPosition().y + ', 0)');
});
