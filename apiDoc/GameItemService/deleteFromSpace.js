var lion = Space.createItem('LP_Lion', 0, 0, 0);

lion.say('Click me to delete me from the space.');

lion.onActivate(function() {
  lion.deleteFromSpace();
});
