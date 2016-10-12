#ifndef HEARTBEAT_WRAPPER_JS
#define HEARTBEAT_WRAPPER_JS

#include "api_adapter.js"

//DX.setHeartbeatInterval(0.0);

var Heartbeat = (function() {
  var heartbeatFunctions = [];
  var lastTime = -1.0;
  var add = function(func) {
    DX.schedule(function(dt) {
      heartbeatFunctions.push(func);
    }, 0.1);
  }
  var heartbeatFunc = function(time) {
    if(lastTime != -1.0) {
      for(var heartbeat_it = 0; heartbeat_it < heartbeatFunctions.length; heartbeat_it++) {
        //DX.log("heartbeat time: " + time);
        heartbeatFunctions[heartbeat_it](1.0 / 60.0);
      }
    }
    lastTime = time;
  }
  var runLaterFunc = function(dt) {
    DX.log("dt in runLaterFunc: " + dt);
    dt = 1.0 / 60.0;
    DX.scheduleRepeating(heartbeatFunc, 0);
  }
  DX.schedule(runLaterFunc, 0.2);
  return {
    add : add
  };
})();

#endif