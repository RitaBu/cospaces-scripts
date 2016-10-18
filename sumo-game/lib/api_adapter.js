#ifndef API_ADAPTER_JS
#define API_ADAPTER_JS

var DX = {};
for(var dx_prop in Space) {
  DX[dx_prop] = Space[dx_prop];
}

DX.log = function(str) {
  if(console !== undefined && console !== null) {
    if(console.log !== undefined && console !== null) {
      console.log("log: " + str);
    }
  }
};

DX.resource = Space.loadSound;

DX.camera = function() {
  var res = {};
  var temp = Space.getCamera();
  for(var camera_prop in temp) {
    res[camera_prop] = temp[camera_prop];
  }
  //res.cameraDirection = res.getDirection;
  
  res.cameraDirection = function() {
    var resAxis = [];
    var temp = res.getDirection();
    resAxis.push(temp.x);
    resAxis.push(temp.y);
    resAxis.push(temp.z);
    return resAxis;
  }
  
  res.position = function() {
    var resAxis = [];
    var axis = temp.getPosition();
    resAxis.push(axis.x);
    resAxis.push(axis.y);
    resAxis.push(axis.z);
    return resAxis;
  }
  return res;
};

DX.command = Space.onExternalCommand;

DX.setControlEnabled = Space.requestPlayerControl;



DX.item = function(id) {
  var temp = Space.getItem(id);
  var res = {};
  for(var item_prop in temp) {
    res[item_prop] = temp[item_prop];
  }
  res.nonDiscreteTeleport = function(x, y, z) {
    res.setLocalPosition(x, y, z);
  }

  res.getAxisX = function() {
    var resAxis = [];
    var axis = temp.getAxisX();
    resAxis.push(axis.x);
    resAxis.push(axis.y);
    resAxis.push(axis.z);
    return resAxis;
  }

  res.getAxisY = function() {
    var resAxis = [];
    var axis = temp.getAxisY();
    resAxis.push(axis.x);
    resAxis.push(axis.y);
    resAxis.push(axis.z);
    return resAxis;
  }

  res.getAxisZ = function() {
    var resAxis = [];
    var axis = temp.getAxisZ();
    resAxis.push(axis.x);
    resAxis.push(axis.y);
    resAxis.push(axis.z);
    return resAxis;
  }

  res.position = function() {
    var resAxis = [];
    var axis = temp.getPosition();
    resAxis.push(axis.x);
    resAxis.push(axis.y);
    resAxis.push(axis.z);
    return resAxis;
  }

  res.remove = res.deleteFromSpace;

  res.moveToPos = function(x, y, z, qx, qy, qz, qw) {
    res.setPositionRotation(x, y, z, qx, qy, qz, qw, false);
  }

  return res;
}

DX.createItemWithoutId = function(name, x, y, z) {
  var created = Space.createItem(name, x, y, z);
  var res = {};
  for(var item_prop in created) {
    res[item_prop] = created[item_prop];
  }

  return DX.item(res.id());
}

DX.createItem = function(name, x, y, z) {
  return DX.createItemWithoutId(name, x, y, z).id();
}



#endif