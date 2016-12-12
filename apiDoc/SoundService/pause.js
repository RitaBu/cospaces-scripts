var soundClipId = 'fca0f8181c05ed9068334996fce96c9396974277bf8bf066bd7dd104a11b4ac2';
var soundClip = Space.loadSound(soundClipId);
var isPlaying = false;

soundClip.play();

Space.scheduleRepeating(function() {
  if(isPlaying) {
    soundClip.pause();
  } else {
    soundClip.resume();
  }
  isPlaying = !isPlaying;
}, 1.5);
