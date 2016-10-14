define(function() {
  var getVoiceByNameString = function(voices, lang, name) {
    for (var i = 0; i < voices.length; ++i) {
      var voice = voices[i];
      if (voice.name().indexOf(name) != -1 && voice.lang() == lang) {
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

  return {
    getVoiceByLang: function(voices, lang) {
      for (var i = 0; i < voices.length; ++i) {
        var voice = voices[i];
        if (voice.lang() == lang) {
          return voice;
        }
      }

      return null;
    },

    getVoiceByName: function(voices, lang, name) {
      if (typeof name == "string") {
        return getVoiceByNameString(voices, lang, name);
      }

      if (typeof name == "object") {
        return getPreferredVoice(voices, lang, name);
      }

      return null;
    },

    getVoice: function(voices, lang, name) {
      return this.getVoiceByName(voices, lang, name) || this.getVoiceByLang(voices, lang);
    }
  }
});