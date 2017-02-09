#include "../lib/property_utils.js"

PropertyUtils.onPropertyChanged("my_property", function(new_value) {
  DX.log("new value: " + new_value);
});

DX.runLater(function(){
  DX.log("property set");
  PropertyUtils.setProperty("my_property", "kekeke");
}, 1.0);