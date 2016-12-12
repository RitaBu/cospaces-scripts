var lion = Space.createItem('LP_Lion', 0, 0, 0);

Space.scheduleRepeating(function() {
  lion.say('Time passed since script started: ' + Math.ceil(Space.currentTime()) + 's');
}, 1);
