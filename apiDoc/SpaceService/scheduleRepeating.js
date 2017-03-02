var lion = Scene.createItem('LP_Lion', 0, 0, 0);

Scene.scheduleRepeating(function() {
  lion.say('Time passed since script started: ' + Math.ceil(Scene.currentTime()) + 's');
}, 1);
