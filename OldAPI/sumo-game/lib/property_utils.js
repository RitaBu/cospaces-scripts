#ifndef PROPERTY_UTILS_H
#define PROPERTY_UTILS_H

#include "api_adapter.js"

#include "heartbeat_wrapper.js"

Object.prototype.toString = function() {
  var str = "";
  var first = true;
  for(prop in this) {
    if(first) {
      first = false;
    } else {
      str += " ";
    }
    str += prop.toString();
  }
  return str;
}

function getProperty (item, propertyName) {
  if(item === null) {
    return null;
  }
  var res = item.getProperty(propertyName);
  if(res === null) return res;
  return res + "";
}


var PropertyUtils = (function(){
  function PropertyData(name, callback) {
    this.name = name;
    this.callback = callback;
    var propertyTime = DX.getProperty(name + "#approve_time");
    if(propertyTime === null) {
      this.time = -1;
    } else {
      this.time = parseInt(propertyTime);
    }
  }
  var callbackMap = {};
  var localTime = 1;
  var onPropertyChanged = function(name, callback) {
    DX.log("subscribed to property: " + name);
    callbackMap[name] = new PropertyData(name, callback);
  }
  var setProperty = function(name, value) {
    DX.setProperty(name, value);
    DX.setProperty(name + "#time", localTime);
  }

  var tempDt = 1.0 / 60.0;

  var propFunc = function(dt) {
    localTime++;
    for(prop_name in callbackMap) {

      if(!callbackMap.hasOwnProperty(prop_name)) continue;
      var propertyTime = DX.getProperty(prop_name + "#time");
      if(propertyTime === null) continue;
      var time = parseInt(propertyTime);

      if(time !== callbackMap[prop_name].time) {
        callbackMap[prop_name].time = time;
        DX.setProperty(prop_name + "#approve_time", time);
        callbackMap[prop_name].callback(DX.getProperty(prop_name));
      }
    }
  }

  Heartbeat.add(function(dt){
    propFunc(dt);
  });

  var setPropertyWithCompare = function (name, value) {
    var lastValue = DX.getProperty(name);
    if(lastValue === null && value != null || String(lastValue) !== String(value)) {
      DX.setProperty(name, value);
    }
  }

  var ndTeleportWithCompare = function (item, x, y, z) {
    var pos = item.position();
    if(pos[0] != x || pos[1] != y || pos[2] != z) {
      item.nonDiscreteTeleport(x, y, z);
    }
  }
  
  return {
    onPropertyChanged : onPropertyChanged,
    setProperty : setProperty,
    updateProperties : function() {propFunc(0.01); },
    setPropertyWithCompare : setPropertyWithCompare,
    ndTeleportWithCompare : ndTeleportWithCompare
  };
})();


#endif