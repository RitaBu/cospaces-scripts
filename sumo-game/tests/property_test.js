#include "../lib/server_framework.js"

var server = new ServerFramework();

var last_property_value = null;

var myDt = 0.0;

var changeCounter = 0;

server.onClientTick = function() {
  var property_value = DX.getProperty("test_prop");
  if(property_value != last_property_value) {
    last_property_value = property_value;
    changeCounter++;
  }
  myDt += server.getDt();
  if(myDt >= 1.0) {
    myDt = 0;
    DX.log("changes: " + changeCounter);
    changeCounter = 0;
  }
}


var counter = 0;


/*
DX.onPropertyChanged("test_prop", function() {
  var property_value = DX.getProperty("test_prop");
  if(parseInt(last_property_value) < parseInt(property_value) - 1) {
    DX.log("new property value: " + property_value);
  }
});
*/

server.onServerTick = function() {
  counter++;


  DX.setProperty("test_prop", counter);
}

server.init("MASCULINE", "ADULT", 0, 0);