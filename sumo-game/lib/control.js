#ifndef CONTROL_JS
#define CONTROL_JS

//#include "property_utils.js"

var ControlManager = function() {
  var registeredItems = [];

  var ControlledItem = function(itemId) {
    var myItemId = itemId;
    this.direction = 10;
    this.controlEnabled = true;
    this.getItemId = function() {
      return myItemId;
    }
  }

  var thisRef = this;

  this.moveControlledItem = function(itemId, direction) {}

  this.processControls = function() {
    //DX.log("control is processed");
    for(i = 0; i < registeredItems.length; i++) {
      if(!registeredItems[i].controlEnabled) continue;
      thisRef.moveControlledItem(registeredItems[i].getItemId(), registeredItems[i].direction);
    }
  }

  this.registerItemId = function(itemId) {
    for(i = 0; i < registeredItems.length; i++) {
      if(!registeredItems[i].getItemId() === itemId) return;
    }
    var newControlledItem = new ControlledItem(itemId);
    registeredItems.push(newControlledItem);
    var item = DX.item(itemId);
    if(item !== null) {
      DX.onPropertyChanged(itemId + "#control_direction", function(newValue){
        newControlledItem.direction = parseInt(newValue);
      });
      DX.onPropertyChanged(itemId + "#control_enabled", function(newValue) {
        newControlledItem.controlEnabled = newValue === "true";
      });
    }
  }

  this.setDirection = function(itemId, newDir) {
    var item = DX.item(itemId);
    if(item === null) return;
    DX.setProperty(itemId + "#control_direction", newDir.toString());
  }

  this.setControlEnabled = function(itemId, controlEnabled) {
    var item = DX.item(itemId);
    if(item === null) return;
    DX.setProperty(itemId + "#control_enabled", controlEnabled);
  }

  this.unregisterItemId = function(itemId) {
    for(i = 0; i < registeredItems.length; i++) {
      if(registeredItems[i].getItemId() === itemId) {
        var temp = registeredItems[i];
        registeredItems[i] = registeredItems[registeredItems.length - 1];
        registeredItems[registeredItems.length - 1] = temp;
        registeredItems.pop();
      }
    }
  }
}

#endif