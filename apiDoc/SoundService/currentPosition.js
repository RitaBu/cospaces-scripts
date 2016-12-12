var lion = Space.createItem('LP_Lion', 0, 0, 0);
var soundClipId = 'fca0f8181c05ed9068334996fce96c9396974277bf8bf066bd7dd104a11b4ac2';
var soundClip = Space.loadSound(soundClipId);

soundClip.play(true); // True for loop

Space.scheduleRepeating(function() {
  lion.say('Sound clip time: ' + soundClip.currentPosition());
}, 0); // 0 to execute the callback function as often as possible which is 60 times per second.
