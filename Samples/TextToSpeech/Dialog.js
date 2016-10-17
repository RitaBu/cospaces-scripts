var phrases = [
  "Что ты мне принес?... Опять ничего?",
  "Приведи мне хотя бы один аргумент против этого.",
  "Клоун!",
  "Может быть... А ты?",
  "Ну точно клоун."
];

var catPhrase = "Thanks god I do not speak Elvish.";

var preferredMaleVoices = ["Yuri", "Pavel", "Google русский", "#male", "l01"];
var preferredFemaleVoices = ["Milena", "Irina", "Google русский", "Female", "#female", "f00"];
var preferredCatVoices = ["Samantha (Enhanced)", "Samantha", "Victoria", "Female", "#female"];
var peopleLang = "ru_RU";
var catLang = "en";

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
      var male = Space.createItem("LP_Man", 0, 0, 0);
      var female = Space.createItem("LP_Wom", 0, 0, 0);
      var cat = Space.createItem("LP_Cat", 0, -3, 0);

      male.setPositionAngle(-1, 0, 0, 0, 0, 1, Math.PI / 2);
      female.setPositionAngle(1, 0, 0, 0, 0, 1, - Math.PI / 2);

      var voices = tts.getVoices();
      var getVoice = function(lang, preferredVoices) {
        var voice = VoiceHelper.getVoice(voices, lang, preferredVoices)
            || VoiceHelper.getVoice(voices, lang);
        if (voice === null) {
          throw "Can not find appropriate voice for query lang = " + lang
          + "; preferredVoices = " + preferredVoices
          + "; consider modifying this sample";
        }
        return voice;
      };

      var maleVoice, femaleVoice, catVoice;

      try {
        maleVoice = getVoice(peopleLang, preferredMaleVoices);
        femaleVoice = getVoice(peopleLang, preferredFemaleVoices);
        catVoice = getVoice(catLang, preferredCatVoices);
      } catch (e) {
        cat.say(e);
        return;
      }

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

