var source_lang = "en";
var target_lang = "de";

Space.loadLibrary("https://raw.githubusercontent.com/delightex/cospaces-scripts/master/Samples/TextToSpeech/", function() {
  require(['VoiceHelper'], function(VoiceHelper) {
    Space.createSpeechSynthesis(function(tts) {
      var voices = tts.getVoices();
      var getVoice = function(lang) {
        var voice = VoiceHelper.getVoice(voices, lang);
        if (voice === null) {
          throw "Can not find appropriate voice for query lang = " + lang
          + "; consider modifying this sample";
        }
        return voice;
      };

      var source, target;

      try {
        source = getVoice(source_lang);
        target = getVoice(target_lang);
      } catch (e) {
        Project.log(e);
        return;
      }

      Space.getItems().forEach(function(item) {
        if (typeof item.text == "function") {
          (function(text) {
            item.onActivate(function() {
              var texts = text.split("\n");
              var sourceUtterance = tts.createUtterance(texts[0]);
              sourceUtterance.setVoice(source);

              var targetUtterance = tts.createUtterance(texts[texts.length - 1]);
              targetUtterance.setVoice(target);

              tts.say(sourceUtterance);
              tts.say(targetUtterance);
            });
          })(item.text());
        }
      });
    });
  });
});