var soundClipId = 'fca0f8181c05ed9068334996fce96c9396974277bf8bf066bd7dd104a11b4ac2';
var soundClip = Scene.loadSound(soundClipId);

soundClip.play(function() {
  Space.log('Sound clip finished.');
});

// Simple call:
// soundClip.play();

// To loop the sound clip:
// soundClip.play(true);
