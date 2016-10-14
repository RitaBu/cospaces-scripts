var male = Space.createItem("LP_Man", 0, 0, 0);
male.rotate(-1, 0, 0, 0, 0, 1, Math.PI / 2, true);
male.setName("Husband");

var female = Space.createItem("LP_Wom", 0, 0, 0);
female.rotate(1, 0, 0, 0, 0, 1, - Math.PI / 2, true);
female.setName("Wife");

var cat = Space.createItem("LP_Cat", 0, -3, 0);
cat.setName("Cat");

var people = [female, male];
var phrases = [
  "Что ты мне принес?... Опять ничего?",
  "Приведи мне хотя бы один аргумент против этого.",
  "Клоун!",
  "Может быть... А ты?",
  "Ну точно клоун."
];

var catPhrase = "Thanks god I do not speak Elvish.";

function start(tts, maleVoice, femaleVoice, onFinish) {
  (function next(i) {
    var phrase = phrases[i];
    var person = people[i % people.length];
    var msg = tts.createUtterance(phrase);
    msg.setVoice(isMale(person) ? maleVoice : femaleVoice);
    person.say(phrase);
    tts.say(msg, function() {
      person.say(null);
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

Space.createSpeechSynthesis(function(tts) {
  var maleVoice = getVoice(tts, "Yuri", "ru_RU");
  var femaleVoice = getVoice(tts, "Milena", "ru_RU");
  var catVoice = getVoice(tts, "Fiona", "en_GB") || getVoiceByLang(tts, "en_US");

  start(tts, maleVoice, femaleVoice, function() {
    var catMsg = tts.createUtterance(catPhrase);
    catMsg.setVoice(catVoice);
    cat.think(catPhrase);
    tts.say(catMsg, function() {
      cat.think(null);
      Project.finishPlayMode();
    });
  });
});

function isMale(person) {
  return person.name() == "Husband";
}

function getVoice(tts, name, lang) {
  return getVoiceByName(tts, name) || getVoiceByLang(tts, lang);
}

function getVoiceByLang(tts, lang) {
  var voices = tts.getVoices();
  for (var i = 0; i < voices.length; ++i) {
    var voice = voices[i];
    if (voice.lang() == lang) {
      return voice;
    }
  }

  return null;
}

function getVoiceByName(tts, name) {
  var voices = tts.getVoices();
  for (var i = 0; i < voices.length; ++i) {
    var voice = voices[i];
    if (voice.name().indexOf(name) != -1) {
      return voice;
    }
  }

  return null;
}