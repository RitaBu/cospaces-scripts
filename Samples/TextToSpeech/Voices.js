Space.createSpeechSynthesis(function (tts) {
  var voices = tts.getVoices();
  var row  = 0;
  var column = 0;
  var width = 10;
  var height = 1;
  var distance = 0.5;
  var columns = Math.ceil(Math.sqrt(voices.length) / 2);
  var rows = Math.ceil(voices.length / columns);
  var fullWidth = columns * width + Math.max(0, columns - 1) * distance;
  var fullHeight = rows * height + Math.max(0, rows - 1) * distance;

  voices.forEach(function (voice) {
    var billboard = Space.createTextBillboard(
        column * width + (column * distance) - fullWidth / 2 + width / 2,
        row * height + (row * distance) - fullHeight / 2 + height / 2,
        0
    );
    billboard.setSize(width, height);
    billboard.setLying(true);
    var text = "name = " + voice.name()
        + "; lang = " + voice.lang()
        + "; local = " + voice.isLocal();
    billboard.setText(text);
    column++;
    if (column >= columns) {
      column = 0;
      row ++;
    }
  });
});