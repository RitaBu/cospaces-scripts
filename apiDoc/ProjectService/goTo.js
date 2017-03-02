var lion = Scene.createItem('LP_Lion', 0, 0, 0);
var Scene2Id = 'Xehi1PEfsUTj5ggshQ5JOi';

lion.say('Click me to switch to space 2.');

lion.onActivate(function() {
  Space.goTo(Scene2Id);
});
