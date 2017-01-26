//TODO getItems() does not seem to function in NewCoSpaces app
//var tpMarkerGroup = Space.getItems();

//#region "Constructor Functions"
//Camera constructor function
function Camera() {
  //NOTE: returned item of Space.getCamera() differs from Space.getItem(cameraID)
  //Motion-related functions like moveLinear() do not exist for Space.getCamera() objects.
  //In this script, cameraItem is used for getDirection(), which does not exist for objects returned by .getItem()
  this.cameraItem = Space.getCamera();
  this.objectItem = Space.getItem("tLn6tPPKTq");
  this.pos = new Vector(this.objectItem.getPosition().x, this.objectItem.getPosition().y, this.objectItem.getPosition().z);
  this.dir = new Vector(0, 0, 0);
}
//Marker constructor
function Marker(object) {
  this.item = object;
  this.position = this.item.getPosition();
  this.visible = true;
  this.bounceDir = "up";
  this.bouncing = true;
  this.pos = new Vector(this.position.x, this.position.y, this.position.z);
  this.con = new Vector();
}
//#endregion "Constructor Functions"

//#region "Camera Functions"
Camera.prototype.update = function() {
  var newDir = this.cameraItem.getDirection();
  var newPos = this.objectItem.getPosition();
  this.pos = new Vector(newPos.x, newPos.y, newPos.z);
  this.dir.set(newDir.x, newDir.y, newDir.z);
};
//#endregion "Camera Functions"

//#region "Marker Functions"
//Toggle visibility based on class property
Marker.prototype.toggleVisibility = function() {
  var self = this;
  if (this.visible === true) {
    self.item.setOpacity(1);
  } else {
    self.item.setOpacity(0);
  }
};

//Updates marker position to face the camera
Marker.prototype.setFacing = function() {
  var camPos = mainCamera.objectItem.getPosition();
  var targetHelper = Space.createItem("Cube", camPos.x, camPos.y, this.position.z);
  this.item.faceTo(targetHelper);
  targetHelper.deleteFromSpace();
};

//Move camera to this object, add positive Z offset
Marker.prototype.moveCamera = function() {
  var markerPosVector = {
    x: this.position.x,
    y: this.position.y,
    z: this.position.z + heightOffset
  };
  mainCamera.objectItem.moveLinear(markerPosVector.x, markerPosVector.y, markerPosVector.z, 0.15, function() {
    MarkerManager.updateMarkers();
  });
};

Marker.prototype.setOpacity = function() {
  var opacity = 1 - this.con.angleTo(mainCamera.dir) * 2;
  this.item.setOpacity(opacity);
  torusOpacity = opacity;
};

Marker.prototype.update = function() {
  this.con = Vector.sub(this.pos, mainCamera.pos);
  this.setOpacity();
};

//Creates onHover interaction to this object
Marker.prototype.bindEvents = function() {
  var self = this;
  var originPos = this.position;
  this.item.onHover(function(isHovered) {
    if (isHovered) {
      self.item.setColor(255, 157, 0);
      self.item.say('Click me to move!');
      self.bouncing = true;
      self.bounceUpDown(originPos);
    } else {
      self.item.setColor(255, 10, 10);
      self.item.say("");
      self.bouncing = false;
    }
  });

  this.item.onActivate(function() {
    //Flag all other markers as visible, hide selected one
    tpMarkerGroup.forEach(function(tpMarker) {
      tpMarker.visible = true;
    });
    self.visible = false;
    self.toggleVisibility();
    self.moveCamera();
  });
};

Marker.prototype.bounceUpDown = function(originPos) {
  var self = this;
  if (self.bouncing) {
    switch (self.bounceDir) {
      case "up":
        self.item.moveLinear(originPos.x, originPos.y, originPos.z + 0.5, 0.5, function() {
          self.bounceDir = "down";
          self.bounceUpDown(originPos);
        });
        break;
      case "down":
        self.item.moveLinear(originPos.x, originPos.y, originPos.z, 0.5, function() {
          self.bounceDir = "up";
          self.bounceUpDown(originPos);
        });
        break;
      default:
        Project.log("Bounce out of bounds!");
    }
  }
};
//#endregion "Marker Functions"

//#region "Vector3 Helper"
//Vector constructor function
function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

//Instance methods
Vector.prototype.set = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Vector.prototype.mag = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

Vector.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y + this.z * v.z;
};

Vector.prototype.angleTo = function(a) {
  return Math.acos(this.dot(a) / (this.mag() * a.mag()));
};

//Static methods
Vector.sub = function(v1, v2) {
  return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
};
//#endregion "Vector3 Helper"

//#region "Init and Update"
//Init
//Objects in scene
var tpMarker1 = Space.getItem("tpMarker1");
var tpMarker2 = Space.getItem("tpMarker2");
var tpMarker3 = Space.getItem("tpMarker3");
var tpMarker4 = Space.getItem("tpMarker4");
var tpMarker5 = Space.getItem("tpMarker5");
var tpMarker6 = Space.getItem("tpMarker6");
var tpMarkerGroup = [tpMarker1, tpMarker2, tpMarker3, tpMarker4, tpMarker5, tpMarker6];
var mainCamera = new Camera();
var heightOffset = 2;
var torusOpacity = 0;

mainCamera.cameraItem.setPlayerCamera();

//Add existing markers in Stage to Marker class
for (i = 0; i < tpMarkerGroup.length; i++) {
  tpMarkerGroup[i] = new Marker(tpMarkerGroup[i]);
  tpMarkerGroup[i].toggleVisibility();
  tpMarkerGroup[i].setFacing();
  tpMarkerGroup[i].bindEvents(i);
}

var MarkerManager = {
  updateMarkers: function() {
    tpMarkerGroup.forEach(function(tpMarker) {
      tpMarker.setFacing();
      tpMarker.toggleVisibility();
    })
  }
};

//Update marker transparency
Space.scheduleRepeating(function() {
  mainCamera.update();
  tpMarkerGroup.forEach(function(tpMarker) {
    if (tpMarker.visible == true) {
      tpMarker.update();
    }
  });
}, 0);
//#endregion "Init and Update"




