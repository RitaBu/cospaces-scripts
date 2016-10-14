define(function() {
  return function(person, voice, tts) {

    var ttsSay = function(phrase, cb) {
      var utterance = tts.createUtterance(phrase);
      utterance.setVoice(voice);
      tts.say(utterance, cb);
    };

    this.say = function(phrase, cb) {
      person.say(phrase);
      ttsSay(phrase, function() {
        person.say(null);
        cb();
      });
    };

    this.think = function(phrase, cb) {
      person.think(phrase);
      ttsSay(phrase, function() {
        person.think(null);
        cb();
      });
    };
  };
});