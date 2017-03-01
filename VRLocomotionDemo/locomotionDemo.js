//#region "Constructor Functions"
//Camera constructor function
function Camera() {
  //NOTE: returned item of Stage.getCamera() differs from Stage.getItem(cameraID)
  //Motion-related functions like moveLinear() do not exist *yet* for Stage.getCamera() objects.
  //In this script, cameraItem is used for getDirection(), which does not exist for objects returned by .getItem()
  this.cameraItem = Stage.getCamera();
  this.objectItem = Stage.getItem("0QiMEUjZAo");
  this.pos = new Vector(this.objectItem.getPosition().x, this.objectItem.getPosition().y, this.objectItem.getPosition().z);
  this.dir = new Vector(0, 0, 0);
}
//Pin constructor
function Pin(object) {
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

//#region "Pin Functions"
//Toggle visibility based on class property
Pin.prototype.toggleVisibility = function() {
  var self = this;
  if (this.visible === true) {
    self.item.setOpacity(1);
  } else {
    self.item.setOpacity(0);
  }
};

//Updates pin position to face the camera
Pin.prototype.setFacing = function() {
  var camPos = mainCamera.objectItem.getPosition();
  var targetHelper = Stage.createItem("Cube", camPos.x, camPos.y, this.position.z);
  this.item.faceTo(targetHelper);
  targetHelper.deleteFromStage();
};

//Move camera to this object, add positive Z offset
Pin.prototype.moveCamera = function() {
  var pinPosVector = {
    x: this.position.x,
    y: this.position.y,
    z: this.position.z + heightOffset
  };
  mainCamera.objectItem.moveLinear(pinPosVector.x, pinPosVector.y, pinPosVector.z, 0.15, function() {
    PinManager.updatePins();
  });
};

Pin.prototype.setOpacity = function() {
  var opacity = 1 - this.con.angleTo(mainCamera.dir) * 2;
  this.item.setOpacity(opacity);
};

Pin.prototype.update = function() {
  this.con = Vector.sub(this.pos, mainCamera.pos);
  this.setOpacity();
};

//Creates onHover interaction to this object
Pin.prototype.bindEvents = function() {
  var self = this;
  var originPos = this.position;
  this.item.onHover(function(isHovered) {
    if (isHovered) {
      self.item.setColor(255, 157, 0);
      self.item.say('Click me to move!');
      self.bouncing = true;
      self.bounceUpDown(originPos);
    } else {
      self.item.setColor(214, 84, 73);
      self.item.say("");
      self.bouncing = false;
    }
  });

  this.item.onActivate(function() {
    //Flag all other pins as visible, hide selected one
    pinGroup.forEach(function(pin) {
      pin.visible = true;
    });
    self.visible = false;
    self.toggleVisibility();
    self.moveCamera();
  });
};

Pin.prototype.bounceUpDown = function(originPos) {
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
        Stage.log("Bounce out of bounds!");
    }
  }
};
//#endregion "Pin Functions"

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
var pin1 = Stage.getItem("pin1");
var pin2 = Stage.getItem("pin2");
var pin3 = Stage.getItem("pin3");
var pin4 = Stage.getItem("pin4");
var pin5 = Stage.getItem("pin5");
var pin6 = Stage.getItem("pin6");
var pinGroup = [pin1, pin2, pin3, pin4, pin5, pin6];
var mainCamera = new Camera();
var heightOffset = 2;

mainCamera.cameraItem.setPlayerCamera();

//Add existing pins in Stage to Pin class
for (i = 0; i < pinGroup.length; i++) {
  pinGroup[i] = new Pin(pinGroup[i]);
  pinGroup[i].toggleVisibility();
  pinGroup[i].setFacing();
  pinGroup[i].bindEvents(i);
}

var PinManager = {
  updatePins: function() {
    pinGroup.forEach(function(pin) {
      pin.setFacing();
      pin.toggleVisibility();
    })
  }
};

//Update pin transparency
Stage.scheduleRepeating(function() {
  mainCamera.update();
  pinGroup.forEach(function(pin) {
    if (pin.visible == true) {
      pin.update();
    }
  });
}, 0);
//#endregion "Init and Update"




