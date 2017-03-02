var lion = Scene.createItem('LP_Lion', 0, 0, 0);

lion.say('Click me to delete me from the space.');

lion.onActivate(function() {
  lion.deleteFromScene();
});
