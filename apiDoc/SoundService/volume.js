var soundClipId = 'fca0f8181c05ed9068334996fce96c9396974277bf8bf066bd7dd104a11b4ac2';
var soundClipVolume;

Scene.loadSound(soundClipId, function(soundClip) {
  soundClip.setVolume(0.5); // Play the sound clip on 1/2 of the actual volume.
  soundClip.play();
  soundClipVolume = soundClip.volume();

  Space.log(soundClipVolume); // 0.5
});
