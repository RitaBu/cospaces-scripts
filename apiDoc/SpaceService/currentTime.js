var lion = Scene.createItem('LP_Lion', 0, 0, 0);
var currentTime;

Scene.scheduleRepeating(function() {
  currentTime = Scene.currentTime().toFixed(2);
  lion.say('Current time: ' + currentTime);
}, 0);
