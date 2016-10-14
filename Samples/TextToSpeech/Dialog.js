var male = Space.createItem("LP_Man", 0, 0, 0);
male.rotate(-1, 0, 0, 0, 0, 1, Math.PI / 2, true);

var female = Space.createItem("LP_Wom", 0, 0, 0);
female.rotate(1, 0, 0, 0, 0, 1, - Math.PI / 2, true);

var cat = Space.createItem("LP_Cat", 0, -3, 0);

var phrases = [
  "Что ты мне принес?... Опять ничего?",
  "Приведи мне хотя бы один аргумент против этого.",
  "Клоун!",
  "Может быть... А ты?",
  "Ну точно клоун."
];

var catPhrase = "Thanks god I do not speak Elvish.";

function start(speakers, onFinish) {
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
      var maleVoice = VoiceHelper.getVoice(tts, "ru_RU", ["Yuri", "Pavel", "Google русский"]);
      var femaleVoice = VoiceHelper.getVoice(tts, "ru_RU", ["Milena", "Irina", "Google русский"]);
      var catVoice = VoiceHelper.getVoiceByName(tts, "en_GB", "Female")
          || VoiceHelper.getVoiceByName(tts, "en_US", ["Samantha", "Victoria"])
          || VoiceHelper.getVoiceByLang(tts, "en");

      var speakers = [
        new Speaker(male, maleVoice, tts),
        new Speaker(female, femaleVoice, tts)
      ];
      var catSpeaker = new Speaker(cat, catVoice, tts);

      start(speakers, function() {
        catSpeaker.think(catPhrase, function() {
          Project.finishPlayMode();
        });
      });
    });
  });
});

