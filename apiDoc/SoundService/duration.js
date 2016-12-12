var soundClipId = 'fca0f8181c05ed9068334996fce96c9396974277bf8bf066bd7dd104a11b4ac2';
var soundClipDuration;

Space.loadSound(soundClipId, function(soundClip) {
  soundClipDuration = soundClip.duration();
  Project.log(soundClipDuration); // 82.520813
  soundClip.play();
});
