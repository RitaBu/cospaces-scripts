define(function() {
  var langFits = function(source, target) {
    if (source == target) {
      return true;
    }

    return target.indexOf("_") == -1 && (source == target || source.indexOf(target + "_") == 0);
  };

  var getVoiceByNameString = function(voices, lang, name) {
    for (var i = 0; i < voices.length; ++i) {
      var voice = voices[i];
      if (voice.name().indexOf(name) != -1 && langFits(voice.lang(), lang)) {
        return voice;
      }
    }

    return null;
  };

  var getPreferredVoice = function(voices, lang, preferredVoices) {
    for (var i = 0; i < preferredVoices.length; ++i) {
      var voice = getVoiceByNameString(voices, lang, preferredVoices[i]);
      if (voice != null) {
        return voice;
      }
    }

    return null;
  };

  var getVoiceByLang = function(voices, lang) {
    for (var i = 0; i < voices.length; ++i) {
      var voice = voices[i];
      if (langFits(voice.lang(), lang)) {
        return voice;
      }
    }

    return null;
  };

  return {
    getVoice: function(voices, lang, name) {
      if (typeof name == "string") {
        return getVoiceByNameString(voices, lang, name);
      }

      if (typeof name == "object") {
        return getPreferredVoice(voices, lang, name);
      }

      if (typeof name == "undefined") {
        return getVoiceByLang(voices, lang);
      }

      return null;
    }
  }
});