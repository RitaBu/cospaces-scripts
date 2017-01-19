/**
 * Only web (Chrome)
 *
 */
// music location: https://studio.cospaces.io/file/download?id=hFX2rULBsfucgDuTR2KJ5ORXlMo0j7yxbBw8wd8b5Nd
var Helper = {
  randNumBetween: function(min, max) {
    return Math.random() * (max - min) + min;
  }
};

var ctx; // audio context
var buf; // audio buffer
var fft; // fft audio node
var samples = 128;
var isSetup = false;
var cubes = [];
var spheres = [];
var data = [];

function init() {
  try {
    ctx = new AudioContext();
    loadFile();
  } catch (e) {
    Project.log('ERROR: ' + e);
  }
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      var cube = Space.createItem('Cube', (i / 2) - 2, (j / 2) - 1.5, 0);
      cube.setOpacity(0);
      cubes.push(cube);
      spheres.push(Space.createItem('LP_Sphere', 0, 0, 0));
    }
  }
}

// load the mp3 file
function loadFile() {
  var req = new XMLHttpRequest();
  req.open('GET', 'https://studio.cospaces.io/file/download?id=hFX2rULBsfucgDuTR2KJ5ORXlMo0j7yxbBw8wd8b5Nd', true);
  req.responseType = 'arraybuffer';

  req.onload = function() {
    // decode the loaded data
    ctx.decodeAudioData(req.response, function(buffer) {
      buf = buffer;
      play();
    });
  };
  req.send();
}

function play() {
  // create a source node from the buffer
  var src = ctx.createBufferSource();
  Project.log(src);
  src.buffer = buf;

  // create fft
  fft = ctx.createAnalyser();
  fft.fftSize = samples;

  // connect them up into a chain
  src.connect(fft);
  fft.connect(ctx.destination);

  // play
  src.start();
  isSetup = true;
}

init();
Space.scheduleRepeating(function() {
  if (isSetup) {
    data = new Uint8Array(samples);
    fft.getByteFrequencyData(data);

    for (var i = 0; i < 48; i++) {
      cubes[i].setColor(data[i], 255 / data[i], data[i] / 2);
      cubes[i].setScale((1 / 255) * data[i]);
      cubes[i].setOpacity((1 / 255) * data[i]);
      spheres[i].setPosition(Math.cos(Math.PI * 2 / 48 * i) * 5, Math.sin(Math.PI * 2 / 48 * i) * 5, 1 / 255 * data[i] * 2);
      spheres[i].setColor(255 - data[i] / 2, 255 - data[i], data[i]);
    }

    Space.setMood((1 / 255) * data[36]);
  }
}, 0);
