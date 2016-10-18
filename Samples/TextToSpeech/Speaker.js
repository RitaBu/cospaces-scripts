define(function() {
  return function(person, voice, tts, rate) {

    var ttsSay = function(phrase, cb) {
      var utterance = tts.createUtterance(phrase);
      utterance.setVoice(voice);
      if (typeof rate == 'number') {
        utterance.setRate(rate);
      }
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