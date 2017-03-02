var soundClipId = 'fca0f8181c05ed9068334996fce96c9396974277bf8bf066bd7dd104a11b4ac2';
var soundClip = Scene.loadSound(soundClipId);

soundClip.play();

Scene.schedule(soundClip.stop, 2); // Stop sound clip after 2 seconds.
