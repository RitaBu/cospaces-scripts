var lion = Space.createItem('LP_Lion', 0, 0, 0);
var currentTime;

Space.scheduleRepeating(function() {
  currentTime = Space.currentTime().toFixed(2);
  lion.say('Current time: ' + currentTime);
}, 0);
