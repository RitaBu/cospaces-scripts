var phrases = [
  "Что ты мне принес?... Опять ничего?",
  "Приведи мне хотя бы один аргумент против этого.",
  "Клоун!",
  "Может быть... А ты?",
  "Ну точно клоун."
];

var catPhrase = "Thanks god I do not speak Elvish.";

function iterate(speakers, onFinish) {
  (function next(i) {
    var speaker = speakers[i % speakers.length];
    speaker.say(phrases[i], function() {
      Space.schedule(function() {
        if (i < phrases.length - 1) {
          next(i + 1);
        } else {
          onFinish();
        }
      }, 1);
    });
  })(0);
}

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/TextToSpeech/", function() {
  require(['Speaker', 'VoiceHelper'], function(Speaker, VoiceHelper) {
    Space.createSpeechSynthesis(function(tts) {
      var voices = tts.getVoices();
      var maleVoice = VoiceHelper.getVoice(voices, "ru_RU", ["Yuri", "Pavel", "Google русский"]);
      var femaleVoice = VoiceHelper.getVoice(voices, "ru_RU", ["Milena", "Irina", "Google русский"]);
      var catVoice = VoiceHelper.getVoiceByName(voices, "en_GB", "Female")
          || VoiceHelper.getVoiceByName(voices, "en_US", ["Samantha", "Victoria"])
          || VoiceHelper.getVoiceByLang(voices, "en");

      var male = Space.createItem("LP_Man", 0, 0, 0);
      male.rotate(-1, 0, 0, 0, 0, 1, Math.PI / 2, true);

      var female = Space.createItem("LP_Wom", 0, 0, 0);
      female.rotate(1, 0, 0, 0, 0, 1, - Math.PI / 2, true);

      var cat = Space.createItem("LP_Cat", 0, -3, 0);

      var speakers = [
        new Speaker(female, femaleVoice, tts),
        new Speaker(male, maleVoice, tts)
      ];

      iterate(speakers, function() {
        new Speaker(cat, catVoice, tts).think(catPhrase, function() {
          Project.finishPlayMode();
        });
      });
    });
  });
});

