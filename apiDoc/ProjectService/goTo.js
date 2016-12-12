var lion = Space.createItem('LP_Lion', 0, 0, 0);
var space2Id = 'Xehi1PEfsUTj5ggshQ5JOi';

lion.say('Click me to switch to space 2.');

lion.onActivate(function() {
  Project.goTo(space2Id);
});
