var swan = Space.createItem('LP_Swan', 0, 0, 0);

swan.onHover(function(isHovered) {
  if(isHovered) {
    swan.setColor(0, 0, 0);
    swan.say('I\'m a black swan!');
  } else {
    swan.setColor(255, 255, 255);
    swan.say('');
  }
});
