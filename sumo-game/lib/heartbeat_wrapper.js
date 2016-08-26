#ifndef HEARTBEAT_WRAPPER_JS
#define HEARTBEAT_WRAPPER_JS

DX.setHeartbeatInterval(0.0);

var Heartbeat = (function() {
  var heartbeatFunctions = [];
  var lastTime = -1.0;
  var add = function(func) {
    DX.runLater(function(dt) {
      heartbeatFunctions.push(func);
    }, 0.1);
  }
  var heartbeatFunc = function(time) {
    if(lastTime != -1.0) {
      for(var heartbeat_it = 0; heartbeat_it < heartbeatFunctions.length; heartbeat_it++) {
        heartbeatFunctions[heartbeat_it](time - lastTime);
      }
    }
    lastTime = time;
  }
  var runLaterFunc = function(dt) {
    DX.heartbeat(heartbeatFunc);
  }
  DX.runLater(runLaterFunc, 0.2);
  return {
    add : add
  };
})();

#endif